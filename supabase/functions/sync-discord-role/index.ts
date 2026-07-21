import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DISCORD_API = "https://discord.com/api/v10";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type RoleRule = {
  min: number;
  max: number | null;
  roleId: string;
  name: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function readRoleRules(): RoleRule[] {
  const raw = Deno.env.get("DISCORD_COLLECTION_ROLES");
  if (!raw) throw new Error("DISCORD_COLLECTION_ROLES is missing.");
  const rules = JSON.parse(raw) as RoleRule[];
  if (!Array.isArray(rules) || rules.some(rule => !rule.roleId || !rule.name)) {
    throw new Error("DISCORD_COLLECTION_ROLES is invalid.");
  }
  return rules.sort((a, b) => a.min - b.min);
}

function chooseRole(rules: RoleRule[], count: number, total: number) {
  const completion = rules.find(rule => rule.max === null && count >= total && total > 0);
  if (completion) return completion;
  return rules.find(rule => rule.max !== null && count >= rule.min && count <= rule.max) || null;
}

async function discordRequest(path: string, init: RequestInit = {}) {
  const token = Deno.env.get("DISCORD_BOT_TOKEN");
  if (!token) throw new Error("DISCORD_BOT_TOKEN is missing.");

  return fetch(`${DISCORD_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
      "X-Audit-Log-Reason": encodeURIComponent("Sprite Vault collection role sync"),
      ...(init.headers || {}),
    },
  });
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
    const totalSprites = Number(payload.totalSprites);

    if (!Number.isInteger(totalSprites) || totalSprites < 1 || totalSprites > 500) {
      return json({ ok: false, message: "Invalid Sprite total." }, 400);
    }
    if (ownedSpriteIds.length > totalSprites) {
      return json({ ok: false, message: "Invalid collection count." }, 400);
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
    const selectedRole = chooseRole(rules, ownedSpriteIds.length, totalSprites);
    const allRoleIds = [...new Set(rules.map(rule => rule.roleId))];

    for (const roleId of allRoleIds) {
      if (selectedRole?.roleId === roleId) continue;
      const response = await discordRequest(
        `/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`,
        { method: "DELETE" },
      );
      if (!response.ok && response.status !== 404) {
        console.error("Could not remove role", roleId, response.status, await response.text());
      }
    }

    if (!selectedRole) {
      return json({
        ok: true,
        roleName: "Sin rol de colección",
        ownedCount: ownedSpriteIds.length,
      });
    }

    const addResponse = await discordRequest(
      `/guilds/${guildId}/members/${discordUserId}/roles/${selectedRole.roleId}`,
      { method: "PUT" },
    );

    if (addResponse.status === 403) {
      return json({
        ok: false,
        message: "Place the bot role above every collection role and give it Manage Roles.",
      }, 500);
    }
    if (!addResponse.ok) {
      console.error("Could not add role", addResponse.status, await addResponse.text());
      return json({ ok: false, message: "Discord rejected the role update." }, 502);
    }

    return json({
      ok: true,
      roleName: selectedRole.name,
      roleId: selectedRole.roleId,
      ownedCount: ownedSpriteIds.length,
      totalSprites,
    });
  } catch (error) {
    console.error(error);
    return json({ ok: false, message: error instanceof Error ? error.message : "Unexpected error." }, 500);
  }
});
