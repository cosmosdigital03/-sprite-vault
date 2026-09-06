// Sprite Vault — Override (C7S4) roster
// Released roster verified against Fortnite.gg. Legacy Override renders continue to use
// staticvacant/fnsprites; newer entries use their current Fortnite.gg sprite renders.
// Existing entries are the previous Runners season; these are the Override entries shown in the Vault.

SPRITES.forEach(sprite => {
  if (!sprite.season) sprite.season = "Runners";
  // "Nuevo" now means the current Override season only.
  sprite.isNew = false;
});

// Follow the current source assets so restored/updated Gold renders appear without another code change.
const OVERRIDE_IMAGE_BASE = "https://raw.githubusercontent.com/staticvacant/fnsprites/main/sprites";
const FORTNITE_GG_IMAGE_BASE = "https://fortnite.gg/img/x/sprites/icons";

const OVERRIDE_SPRITES = [
  { id:"bush_basic", name:"Bush", originalName:"Bush", theme:"Básico", rarity:"Raro" },
  { id:"bush_gold", name:"Gold Bush", originalName:"Gold Bush", theme:"Dorado", rarity:"Especial" },
  { id:"bush_cheat", name:"Cheat Master Bush", originalName:"Cheat Master Bush", theme:"Cheat Master", rarity:"Especial" },

  { id:"jonesy_basic", name:"Jonesy", originalName:"Jonesy", theme:"Básico", rarity:"Raro" },
  { id:"jonesy_gold", name:"Gold Jonesy", originalName:"Gold Jonesy", theme:"Dorado", rarity:"Especial" },
  { id:"jonesy_cheat", name:"Cheat Master Jonesy", originalName:"Cheat Master Jonesy", theme:"Cheat Master", rarity:"Especial" },

  { id:"adventure_basic", name:"Adventure", originalName:"Adventure", theme:"Básico", rarity:"Raro" },
  { id:"adventure_gold", name:"Gold Adventure", originalName:"Gold Adventure", theme:"Dorado", rarity:"Especial" },
  { id:"adventure_cheat", name:"Cheat Master Adventure", originalName:"Cheat Master Adventure", theme:"Cheat Master", rarity:"Especial" },

  { id:"8bit_basic", name:"8-Bit", originalName:"8-Bit", theme:"Básico", rarity:"Raro" },
  { id:"8bit_gold", name:"Gold 8-Bit", originalName:"Gold 8-Bit", theme:"Dorado", rarity:"Especial" },
  { id:"8bit_cheat", name:"Cheat Master 8-Bit", originalName:"Cheat Master 8-Bit", theme:"Cheat Master", rarity:"Especial" },

  { id:"stormking_basic", name:"Storm Scout", originalName:"Storm Scout", theme:"Básico", rarity:"Raro" },
  { id:"stormking_gold", name:"Gold Storm Scout", originalName:"Gold Storm Scout", theme:"Dorado", rarity:"Especial" },
  { id:"stormking_cheat", name:"Cheat Master Storm Scout", originalName:"Cheat Master Storm Scout", theme:"Cheat Master", rarity:"Especial" },

  { id:"killswitch_basic", name:"Killswitch", originalName:"Killswitch", theme:"Básico", rarity:"Épico" },
  { id:"killswitch_gold", name:"Gold Killswitch", originalName:"Gold Killswitch", theme:"Dorado", rarity:"Especial" },
  { id:"killswitch_cheat", name:"Cheat Master Killswitch", originalName:"Cheat Master Killswitch", theme:"Cheat Master", rarity:"Especial" },

  { id:"sonic_basic", name:"Sonic", originalName:"Sonic", theme:"Básico", rarity:"Épico" },
  { id:"sonic_gold", name:"Gold Sonic", originalName:"Gold Sonic", theme:"Dorado", rarity:"Especial" },
  { id:"sonic_cheat", name:"Cheat Master Sonic", originalName:"Cheat Master Sonic", theme:"Cheat Master", rarity:"Especial" },

  { id:"tails_basic", name:"Tails", originalName:"Tails", theme:"Básico", rarity:"Épico" },
  { id:"tails_gold", name:"Gold Tails", originalName:"Gold Tails", theme:"Dorado", rarity:"Especial" },
  { id:"tails_cheat", name:"Cheat Master Tails", originalName:"Cheat Master Tails", theme:"Cheat Master", rarity:"Especial" },

  { id:"shadow_basic", name:"Shadow", originalName:"Shadow", theme:"Básico", rarity:"Épico" },
  { id:"shadow_gold", name:"Gold Shadow", originalName:"Gold Shadow", theme:"Dorado", rarity:"Especial" },
  { id:"shadow_cheat", name:"Cheat Master Shadow", originalName:"Cheat Master Shadow", theme:"Cheat Master", rarity:"Especial" },

  { id:"jackrabbit_basic", name:"Jackrabbit", originalName:"Jackrabbit", theme:"Básico", rarity:"Legendario" },
  { id:"jackrabbit_gold", name:"Gold Jackrabbit", originalName:"Gold Jackrabbit", theme:"Dorado", rarity:"Especial" },
  { id:"jackrabbit_cheat", name:"Cheat Master Jackrabbit", originalName:"Cheat Master Jackrabbit", theme:"Cheat Master", rarity:"Especial" },

  { id:"klombo_basic", name:"Klombo", originalName:"Klombo", theme:"Básico", rarity:"Mítico" },
  { id:"klombo_gold", name:"Gold Klombo", originalName:"Gold Klombo", theme:"Dorado", rarity:"Especial" },
  { id:"klombo_cheat", name:"Cheat Master Klombo", originalName:"Cheat Master Klombo", theme:"Cheat Master", rarity:"Especial" },

  { id:"crown_basic", name:"Crown", originalName:"Crown", theme:"Básico", rarity:"Mítico" },
  { id:"crown_gold", name:"Gold Crown", originalName:"Gold Crown", theme:"Dorado", rarity:"Especial" },
  { id:"crown_cheat", name:"Cheat Master Crown", originalName:"Cheat Master Crown", theme:"Cheat Master", rarity:"Especial" }
].map(sprite => ({
  ...sprite,
  image: `${OVERRIDE_IMAGE_BASE}/${encodeURIComponent(sprite.id)}.png`,
  findRate: "No disponible",
  isNew: true,
  season: "Override",
  unreleased: false,
  enabled: true
}));

// These 11 released entries are present in Fortnite.gg's current 47-sprite Override roster
// but were not yet present in Sprite Vault.
const FORTNITE_GG_SPRITES = [
  {
    id:"megaman_basic",
    name:"Mega Man",
    originalName:"Mega Man",
    theme:"Básico",
    rarity:"Raro",
    image:`${FORTNITE_GG_IMAGE_BASE}/T_Icon_BR_Creature_Sprite_ImprovedSlide_L.webp`
  },

  {
    id:"overshield_basic",
    name:"Overshield",
    originalName:"Overshield",
    theme:"Básico",
    rarity:"Raro",
    image:`${FORTNITE_GG_IMAGE_BASE}/T_Icon_BR_Creature_Sprite_Overshield_L.webp`
  },
  {
    id:"overshield_gold",
    name:"Gold Overshield",
    originalName:"Gold Overshield",
    theme:"Dorado",
    rarity:"Especial",
    image:`${FORTNITE_GG_IMAGE_BASE}/T_Icon_BR_Creature_Sprite_Overshield_Gold_L.webp`
  },
  {
    id:"overshield_cheat",
    name:"Cheat Master Overshield",
    originalName:"Cheat Master Overshield",
    theme:"Cheat Master",
    rarity:"Especial",
    image:`${FORTNITE_GG_IMAGE_BASE}/T_Icon_BR_Creature_Sprite_Overshield_Cheatmaster_L.webp`
  },

  {
    id:"xray_basic",
    name:"X-Ray",
    originalName:"X-Ray",
    theme:"Básico",
    rarity:"Legendario",
    image:`${FORTNITE_GG_IMAGE_BASE}/T_Icon_BR_Creature_Sprite_WinnerB_L.webp`
  },
  {
    id:"xray_gold",
    name:"Gold X-Ray",
    originalName:"Gold X-Ray",
    theme:"Dorado",
    rarity:"Especial",
    image:`${FORTNITE_GG_IMAGE_BASE}/T_Icon_BR_Creature_Sprite_WinnerB_Gold_L.webp`
  },
  {
    id:"xray_cheat",
    name:"Cheat Master X-Ray",
    originalName:"Cheatmaster X-Ray",
    theme:"Cheat Master",
    rarity:"Especial",
    image:`${FORTNITE_GG_IMAGE_BASE}/T_Icon_BR_Creature_Sprite_WinnerB_Cheatmaster_L.webp`
  },

  {
    id:"onigiri_basic",
    name:"Onigiri",
    originalName:"Onigiri",
    theme:"Básico",
    rarity:"Raro",
    image:`${FORTNITE_GG_IMAGE_BASE}/T_Icon_BR_Creature_Sprite_WinnerC_L.webp`
  },
  {
    id:"onigiri_gold",
    name:"Gold Onigiri",
    originalName:"Gold Onigiri",
    theme:"Dorado",
    rarity:"Especial",
    image:`${FORTNITE_GG_IMAGE_BASE}/T_Icon_BR_Creature_Sprite_WinnerC_Gold_L.webp`
  },
  {
    id:"onigiri_cheat",
    name:"Cheat Master Onigiri",
    originalName:"Cheatmaster Onigiri",
    theme:"Cheat Master",
    rarity:"Especial",
    image:`${FORTNITE_GG_IMAGE_BASE}/T_Icon_BR_Creature_Sprite_WinnerC_Cheatmaster_L.webp`
  },

  {
    id:"crown_hacker",
    name:"Loot Hacker Crown",
    originalName:"Loot Hacker Crown",
    theme:"Loot Hacker",
    rarity:"Especial",
    image:`${FORTNITE_GG_IMAGE_BASE}/T_Icon_BR_Creature_Sprite_Crown_Hacker_L.webp`
  }
].map(sprite => ({
  ...sprite,
  findRate: "No disponible",
  isNew: true,
  season: "Override",
  unreleased: false,
  enabled: true
}));

const existingSpriteIds = new Set(SPRITES.map(sprite => sprite.id));
for (const sprite of [...OVERRIDE_SPRITES, ...FORTNITE_GG_SPRITES]) {
  if (!existingSpriteIds.has(sprite.id)) {
    SPRITES.push(sprite);
    existingSpriteIds.add(sprite.id);
  }
}
