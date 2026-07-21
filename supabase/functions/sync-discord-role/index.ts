import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DISCORD_API = "https://discord.com/api/v10";
const SPECIAL_KEYS = new Set(["galaxy", "gummy", "gold", "holofoil", "cubes"]);

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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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

  return fetch(`${DISCORD_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
      "X-Audit-Log-Reason": encodeURIComponent("Sprite Vault role sync"),
      ...(init.headers || {}),
    },
  });
}

async function removeRole(guildId: string, userId: string, roleId: string) {
  const response = await discordRequest(
    `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    { method: "DELETE" },
  );
  if (!response.ok && response.status !== 404) {
    console.error("Could not remove role", roleId, response.status, await response.text());
  }
}

async function addRole(guildId: string, userId: string, roleId: string) {
  const response = await discordRequest(
    `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    { method: "PUT" },
  );
  if (response.status === 403) {
    throw new Error("Coloca el rol del bot por encima de todos los roles administrados y activa Manage Roles.");
  }
  if (!response.ok) {
    console.error("Could not add role", roleId, response.status, await response.text());
    throw new Error("Discord rechazó la actualización de uno de los roles.");
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

    const rules = readRoleRules();
    const collectionRole = chooseThresholdRole(rules.collection, ownedSpriteIds.length);
    const masteryRole = chooseThresholdRole(rules.mastery, masteredSpriteIds.length);
    const specialKeySet = new Set(ownedSpecialKeys);
    const selectedSpecialRoles = rules.specials.filter(rule => specialKeySet.has(rule.key));

    for (const role of rules.collection) {
      if (collectionRole?.roleId !== role.roleId) await removeRole(guildId, discordUserId, role.roleId);
    }
    for (const role of rules.mastery) {
      if (masteryRole?.roleId !== role.roleId) await removeRole(guildId, discordUserId, role.roleId);
    }
    for (const role of rules.specials) {
      if (!selectedSpecialRoles.some(selected => selected.roleId === role.roleId)) {
        await removeRole(guildId, discordUserId, role.roleId);
      }
    }

    const rolesToAdd = [
      collectionRole,
      masteryRole,
      ...selectedSpecialRoles,
    ].filter((role): role is ThresholdRole | SpecialRole => Boolean(role));

    for (const role of rolesToAdd) {
      await addRole(guildId, discordUserId, role.roleId);
    }

    return json({
      ok: true,
      roleNames: rolesToAdd.map(role => role.name),
      ownedCount: ownedSpriteIds.length,
      masteredCount: masteredSpriteIds.length,
      totalSprites,
      specialKeys: ownedSpecialKeys,
    });
  } catch (error) {
    console.error(error);
    return json({ ok: false, message: error instanceof Error ? error.message : "Unexpected error." }, 500);
  }
});
