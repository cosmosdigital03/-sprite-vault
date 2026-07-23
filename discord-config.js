/*
  Sprite Vault Discord integration — public browser configuration.
  Only the Supabase Project URL and Publishable key belong here.
  NEVER place the Discord bot token, Supabase secret key, or Discord role IDs in this file.
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
    { key: "galaxy",   name: "🌌 Sprites Galaxia" },
    { key: "gummy",    name: "🍬 Sprites Gummy" },
    { key: "gold",     name: "🟡 Sprites Dorados" },
    { key: "holofoil", name: "🌈 Sprites Holofoil" },
    { key: "cubes",    name: "🧊 Sprites Cubos" }
  ]
};

/*
  Cube Sprite release update.
  This runs before app.js initializes, preserving every existing Sprite ID and
  saved selection while moving the Nuevo tag exclusively to Cube variants.
*/
document.addEventListener("DOMContentLoaded", () => {
  if (typeof SPRITES === "undefined" || !Array.isArray(SPRITES)) return;

  SPRITES.forEach((sprite) => {
    sprite.isNew = false;
  });

  const cubeSprites = [
    { id: "batman_cube", name: "Batman Cubo", originalName: "Cube Batman", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_FossilMeal_Cube_L.webp", findRate: "0%", isNew: true },
    { id: "water_cube", name: "Agua Cubo", originalName: "Cube Water", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/tmp_water_cube.webp", findRate: "0%", isNew: true },
    { id: "earth_cube", name: "Tierra Cubo", originalName: "Cube Earth", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Earth_Cube_ui_L.webp", findRate: "0%", isNew: true },
    { id: "fire_cube", name: "Fuego Cubo", originalName: "Cube Fire", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Fire_Cube_ui_L.webp", findRate: "0%", isNew: true },
    { id: "duck_cube", name: "Pato Cubo", originalName: "Cube Duck", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/tmp_duck_cube.webp", findRate: "0%", isNew: true },
    { id: "ghost_cube", name: "Fantasma Cubo", originalName: "Cube Ghost", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/tmp_ghost_cube.webp", findRate: "0%", isNew: true },
    { id: "dream_cube", name: "Sueño Cubo", originalName: "Cube Dream", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Sleepy_Cube_ui_L.webp", findRate: "0%", isNew: true },
    { id: "demon_cube", name: "Demonio Cubo", originalName: "Cube Demon", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/tmp_demon_cube.webp", findRate: "0%", isNew: true },
    { id: "punk_cube", name: "Punk Cubo", originalName: "Cube Punk", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Punk_Cube_ui_L.webp", findRate: "0%", isNew: true },
    { id: "king_cube", name: "Rey Cubo", originalName: "Cube King", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/tmp_king_cube.webp", findRate: "0%", isNew: true },
    { id: "zeropoint_cube", name: "Punto Cero Cubo", originalName: "Cube Zero Point", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/tmp_zero_point_cube.webp", findRate: "0%", isNew: true },
    { id: "fishy_cube", name: "Pez Cubo", originalName: "Cube Fishy", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Fishy_Cube_L.webp", findRate: "0%", isNew: true },
    { id: "striker_cube", name: "Atacante Cubo", originalName: "Cube Striker", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/tmp_soccer_cube.webp", findRate: "0%", isNew: true },
    { id: "aura_cube", name: "Aura Cubo", originalName: "Cube Aura", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/tmp_drifter_cube.webp", findRate: "0%", isNew: true },
    { id: "boss_cube", name: "Jefe Cubo", originalName: "Cube Boss", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_Creature_Sprite_Boss_Cube_ui_L.webp", findRate: "0%", isNew: true },
    { id: "grim_cube", name: "Sombrío Cubo", originalName: "Cube Grim", theme: "Cubo", rarity: "Especial", image: "https://fortnite.gg/img/x/sprites/icons/T_Icon_BR_GrimReaper_Cube_L.webp", findRate: "0%", isNew: true }
  ];

  const existingIds = new Set(SPRITES.map((sprite) => sprite.id));
  cubeSprites.forEach((sprite) => {
    if (!existingIds.has(sprite.id)) SPRITES.push(sprite);
  });
});