/*
  Sprite Vault Discord integration — public browser configuration.
  Paste only your Supabase Project URL and Publishable/Anon key here.
  NEVER place the Discord bot token, Supabase secret/service key, or Discord role IDs in this file.
*/
window.SPRITE_VAULT_CONFIG = {
  supabaseUrl: "",
  supabasePublishableKey: "",
  functionName: "sync-discord-role",
  discordInvite: "https://discord.gg/7AAnVUPZc",
  roleThresholds: [
    { min: 1,  max: 9,  name: "🧩 Sprite Collector" },
    { min: 10, max: 24, name: "🔹 Vault Collector" },
    { min: 25, max: 49, name: "💠 Sprite Archivist" },
    { min: 50, max: 82, name: "🔮 Master Collector" },
    { min: 83, max: null, name: "👑 Vault Completionist" }
  ]
};
