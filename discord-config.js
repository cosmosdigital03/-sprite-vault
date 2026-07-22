import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DISCORD_API = "https://discord.com/api/v10";
const SPECIAL_KEYS = new Set(["galaxy", "gummy", "gold", "holofoil", "cubes"]);
const MAX_DISCORD_RETRIES = 5;

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ThresholdRole = {
  min: number;
  max: number | null;
  roleId: string;
  name: string;
};

type SpecialRole = {
  key: string;
  roleId: string;
  name: string;
};

type RoleRules = {
  collection: ThresholdRole[];
  mastery: ThresholdRole[];
  specials: SpecialRole[];
};

type DiscordMember = {
  roles?: string[];
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isDiscordRoleId(value: unknown): value is string {
  return typeof value === "string" && /^\d{16,22}$/.test(value);
}

function validateThresholdRules(value: unknown, label: string): ThresholdRole[] {
  if (!Array.isArray(value)) throw new Error(`${label} role rules are invalid.`);
  const rules = value as ThresholdRole[];
  if (rules.some(rule => (
    !Number.isInteger(rule.min) ||
    rule.min < 0 ||
    (rule.max !== null && (!Number.isInteger(rule.max) || rule.max < rule.min)) ||
    !isDiscordRoleId(rule.roleId) ||
    typeof rule.name !== "string" ||
    !rule.name.trim()
  ))) {
    throw new Error(`${label} role rules are invalid.`);
  }
  return [...rules].sort((a, b) => a.min - b.min);
}

function validateSpecialRules(value: unknown): SpecialRole[] {
  if (!Array.isArray(value)) throw new Error("Special role rules are invalid.");
  const rules = value as SpecialRole[];
  if (rules.some(rule => (
    !SPECIAL_KEYS.has(rule.key) ||
    !isDiscordRoleId(rule.roleId) ||
    typeof rule.name !== "string" ||
    !rule.name.trim()
  ))) {
    throw new Error("Special role rules are invalid.");
  }
  return rules;
}

function readRoleRules(): RoleRules {
  const raw = Deno.env.get("DISCORD_ROLE_RULES");
  if (!raw) throw new Error("DISCORD_ROLE_RULES is missing.");
  const parsed = JSON.parse(raw) as Partial<RoleRules>;
  return {
    collection: validateThresholdRules(parsed.collection, "Collection"),
    mastery: validateThresholdRules(parsed.mastery, "Mastery"),
    specials: validateSpecialRules(parsed.specials),
  };
}

function chooseThresholdRole(rules: ThresholdRole[], count: number) {
  return rules.find(rule => count >= rule.min && (rule.max === null || count <= rule.max)) || null;
}

async function discordRequest(path: string, init: RequestInit = {}) {
  const token = Deno.env.get("DISCORD_BOT_TOKEN");
  if (!token) throw new Error("DISCORD_BOT_TOKEN is missing.");

  for (let attempt = 0; attempt <= MAX_DISCORD_RETRIES; attempt += 1) {
    const response = await fetch(`${DISCORD_API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
        "X-Audit-Log-Reason": encodeURIComponent("Sprite Vault role sync"),
        ...(init.headers || {}),
      },
    });

    if (response.status !== 429) return response;

    const rateLimit = await response.json().catch(() => ({})) as {
      retry_after?: number;
      global?: boolean;
    };
    const retryAfterSeconds = Number(rateLimit.retry_after);

    if (attempt === MAX_DISCORD_RETRIES || !Number.isFinite(retryAfterSeconds)) {
      return new Response(JSON.stringify(rateLimit), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    const waitMs = Math.max(1000, Math.ceil(retryAfterSeconds * 1000) + 300);
    console.warn(
      `Discord rate limit reached. Waiting ${waitMs}ms before retry ${attempt + 1}.`,
      { path, global: Boolean(rateLimit.global) },
    );
    await sleep(waitMs);
  }

  throw new Error("Discord request retry loop ended unexpectedly.");
}

async function removeRole(guildId: string, userId: string, roleId: string) {
  const response = await discordRequest(
    `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    { method: "DELETE" },
  );

  if (response.status === 403) {
    throw new Error("Move the bot role above every managed role and enable Manage Roles.");
  }
  if (!response.ok && response.status !== 404) {
    const detail = await response.text();
    console.error("Could not remove role", roleId, response.status, detail);
    throw new Error("Discord rejected a role removal.");
  }
}

async function addRole(guildId: string, userId: string, roleId: string) {
  const response = await discordRequest(
    `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    { method: "PUT" },
  );

  if (response.status === 403) {
    throw new Error("Move the bot role above every managed role and enable Manage Roles.");
  }
  if (!response.ok) {
    const detail = await response.text();
    console.error("Could not add role", roleId, response.status, detail);
    throw new Error("Discord rejected a role addition.");
  }
}

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, message: "Method not allowed." }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const authHeader = req.headers.get("Authorization");
    const guildId = Deno.env.get("DISCORD_GUILD_ID");

    if (!supabaseUrl || !supabaseAnonKey || !authHeader || !guildId) {
      return json({ ok: false, message: "Server configuration is incomplete." }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return json({ ok: false, message: "You must connect Discord first." }, 401);
    }

    const identity = userData.user.identities?.find(item => item.provider === "discord");
    const identityData = identity?.identity_data as Record<string, unknown> | undefined;
    const discordUserId = String(
      identityData?.sub || identityData?.provider_id || identity?.id || ""
    );

    if (!discordUserId || !/^\d{16,22}$/.test(discordUserId)) {
      return json({ ok: false, message: "The connected account is not a valid Discord identity." }, 400);
    }

    const payload = await req.json().catch(() => ({}));
    const ownedSpriteIds = Array.isArray(payload.ownedSpriteIds)
      ? [...new Set(payload.ownedSpriteIds.filter((id: unknown) => typeof id === "string"))]
      : [];
    const masteredSpriteIds = Array.isArray(payload.masteredSpriteIds)
      ? [...new Set(payload.masteredSpriteIds.filter((id: unknown) => typeof id === "string"))]
      : [];
    const ownedSpecialKeys = Array.isArray(payload.ownedSpecialKeys)
      ? [...new Set(payload.ownedSpecialKeys.filter((key: unknown) => typeof key === "string" && SPECIAL_KEYS.has(key)))]
      : [];
    const totalSprites = Number(payload.totalSprites);

    if (!Number.isInteger(totalSprites) || totalSprites < 1 || totalSprites > 500) {
      return json({ ok: false, message: "Invalid Sprite total." }, 400);
    }
    if (ownedSpriteIds.length > totalSprites || masteredSpriteIds.length > totalSprites) {
      return json({ ok: false, message: "Invalid collection count." }, 400);
    }
    if (masteredSpriteIds.some(id => !ownedSpriteIds.includes(id))) {
      return json({ ok: false, message: "A mastered Sprite must also be marked as owned." }, 400);
    }

    const memberResponse = await discordRequest(`/guilds/${guildId}/members/${discordUserId}`);
    if (memberResponse.status === 404) {
      return json({ ok: false, code: "not_member", message: "Join Sprite Vault before syncing." });
    }
    if (!memberResponse.ok) {
      const detail = await memberResponse.text();
      console.error("Discord member lookup failed", memberResponse.status, detail);
      return json({ ok: false, message: "The bot could not verify your server membership." }, 502);
    }

    const member = await memberResponse.json() as DiscordMember;
    const currentRoleIds = new Set(
      Array.isArray(member.roles) ? member.roles.filter(isDiscordRoleId) : [],
    );

    const rules = readRoleRules();
    const collectionRole = chooseThresholdRole(rules.collection, ownedSpriteIds.length);
    const masteryRole = chooseThresholdRole(rules.mastery, masteredSpriteIds.length);
    const specialKeySet = new Set(ownedSpecialKeys);
    const selectedSpecialRoles = rules.specials.filter(rule => specialKeySet.has(rule.key));

    const desiredRoles = [
      collectionRole,
      masteryRole,
      ...selectedSpecialRoles,
    ].filter((role): role is ThresholdRole | SpecialRole => Boolean(role));

    const desiredRoleIds = new Set(desiredRoles.map(role => role.roleId));
    const managedRoleIds = new Set([
      ...rules.collection.map(role => role.roleId),
      ...rules.mastery.map(role => role.roleId),
      ...rules.specials.map(role => role.roleId),
    ]);

    // Only change roles that actually need changing. The old function sent up to
    // 22 Discord requests on every click, which caused Discord HTTP 429 rate limits.
    const roleIdsToRemove = [...currentRoleIds].filter(
      roleId => managedRoleIds.has(roleId) && !desiredRoleIds.has(roleId),
    );
    const roleIdsToAdd = [...desiredRoleIds].filter(
      roleId => !currentRoleIds.has(roleId),
    );

    for (const roleId of roleIdsToRemove) {
      await removeRole(guildId, discordUserId, roleId);
    }
    for (const roleId of roleIdsToAdd) {
      await addRole(guildId, discordUserId, roleId);
    }

    return json({
      ok: true,
      roleNames: desiredRoles.map(role => role.name),
      ownedCount: ownedSpriteIds.length,
      masteredCount: masteredSpriteIds.length,
      totalSprites,
      specialKeys: ownedSpecialKeys,
      changes: {
        added: roleIdsToAdd.length,
        removed: roleIdsToRemove.length,
      },
    });
  } catch (error) {
    console.error(error);
    return json({
      ok: false,
      message: error instanceof Error ? error.message : "Unexpected error.",
    }, 500);
  }
});
