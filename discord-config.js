/*
  Sprite Vault Discord integration — configuración pública del navegador.
  Pega aquí solamente la URL del proyecto Supabase y la Publishable/Anon key.
  NUNCA coloques aquí el token del bot, claves secretas de Supabase ni IDs de roles.
*/
window.SPRITE_VAULT_CONFIG = {
  supabaseUrl: "https://vaxwnrhspjjbsdxgzeqr.supabase.co",
  supabasePublishableKey: "sb_publishable_J2ehJ9XLxh98LrbB-za-Cg_G8F3eTas",
  functionName: "sync-discord-role",
  discordInvite: "https://discord.gg/7AAnVUPZc",

  collectionRoleThresholds: [
    { min: 10,  max: 19,  name: "☁️ Coleccionista Básico" },
    { min: 20,  max: 29,  name: "🦆 Coleccionista Explorador" },
    { min: 30,  max: 39,  name: "💤 Coleccionista Maestro" },
    { min: 40,  max: 49,  name: "🏕️ Súper Coleccionista" },
    { min: 50,  max: 59,  name: "🌿 Gran Coleccionista" },
    { min: 60,  max: 69,  name: "⭐ Coleccionista Estelar" },
    { min: 70,  max: 79,  name: "💎 Coleccionista Élite" },
    { min: 80,  max: 89,  name: "🐉 Coleccionista Legendario" },
    { min: 90,  max: 99,  name: "🪄 Coleccionista Mítico" },
    { min: 100, max: null, name: "👑✨ Coleccionista Absoluto" }
  ],

  masteryRoleThresholds: [
    { min: 5,  max: 9,   name: "🏅 5 Sprites Dominados" },
    { min: 10, max: 14,  name: "🥉 10 Sprites Dominados" },
    { min: 15, max: 19,  name: "🥈 15 Sprites Dominados" },
    { min: 20, max: 29,  name: "🥇 20 Sprites Dominados" },
    { min: 30, max: 49,  name: "💠 30 Sprites Dominados" },
    { min: 50, max: 74,  name: "👑 50 Sprites Dominados" },
    { min: 75, max: null, name: "🌌 75 Sprites Dominados" }
  ],

  specialRoles: [
    { key: "galaxy",  name: "🌌 Sprites Galaxia" },
    { key: "gummy",   name: "🍬 Sprites Gummy" },
    { key: "gold",    name: "🟡 Sprites Dorados" },
    { key: "holofoil", name: "🌈 Sprites Holofoil" },
    { key: "cubes",   name: "🧊 Sprites Cubos" }
  ]
};
