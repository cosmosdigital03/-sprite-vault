// Sprite Vault — Override (C7S4) roster
// Synced with the current Fortnite.GG Sprite roster on 2026-09-17.
// Released entries count toward collection progress; datamined/upcoming entries remain visible
// but are marked unreleased until they become obtainable.

SPRITES.forEach(sprite => {
  if (!sprite.season) sprite.season = "Runners";
  sprite.isNew = false;
  if (typeof sprite.unreleased !== "boolean") sprite.unreleased = false;
  if (typeof sprite.enabled !== "boolean") sprite.enabled = true;
});

const OVERRIDE_ASSET_BASE =
  "https://raw.githubusercontent.com/mombiemala/fnsprites/main/public/sprites";

const OVERRIDE_VARIANTS = {
  basic: {
    idSuffix: "basic",
    assetSuffix: "normal",
    theme: "Básico",
    label: name => name
  },
  gold: {
    idSuffix: "gold",
    assetSuffix: "gold",
    theme: "Dorado",
    label: name => `Gold ${name}`
  },
  cheat: {
    idSuffix: "cheat",
    assetSuffix: "cheatmaster",
    theme: "Cheat Master",
    label: name => `Cheat Master ${name}`
  },
  hacker: {
    idSuffix: "hacker",
    assetSuffix: "loothacker",
    theme: "Loot Hacker",
    label: name => `Loot Hacker ${name}`
  },
  bounty: {
    idSuffix: "bounty",
    assetSuffix: "bountyhunter",
    theme: "Bounty Hunter",
    label: name => `Bounty Hunter ${name}`
  }
};

const STANDARD_OVERRIDE_VARIANTS = ["basic", "gold", "cheat", "hacker", "bounty"];
const RELEASED_FOUR = ["basic", "gold", "cheat", "hacker"];

const OVERRIDE_FAMILIES = [
  { id:"jonesy", asset:"jonesy", name:"Jonesy", rarity:"Raro", released:RELEASED_FOUR },
  { id:"adventure", asset:"adventure", name:"Adventure", rarity:"Raro", released:RELEASED_FOUR },
  {
    id:"bush",
    asset:"bushranger",
    name:"Bush",
    rarity:"Raro",
    released:RELEASED_FOUR,
    labels:{ hacker:"Loot Hacker Bushranger" }
  },
  { id:"sonic", asset:"sonic", name:"Sonic", rarity:"Épico", released:RELEASED_FOUR },
  { id:"tails", asset:"tails", name:"Tails", rarity:"Épico", released:RELEASED_FOUR },
  { id:"shadow", asset:"shadow", name:"Shadow", rarity:"Épico", released:RELEASED_FOUR },
  { id:"8bit", asset:"blaster", name:"8-Bit", rarity:"Raro", released:RELEASED_FOUR },
  { id:"jackrabbit", asset:"jazz", name:"Jackrabbit", rarity:"Legendario", released:RELEASED_FOUR },
  {
    id:"crown",
    asset:"victorycrown",
    name:"Crown",
    rarity:"Mítico",
    released:["basic", "gold", "cheat", "hacker", "bounty"]
  },
  { id:"killswitch", asset:"killswitch", name:"Killswitch", rarity:"Épico", released:RELEASED_FOUR },
  { id:"klombo", asset:"klombo", name:"Klombo", rarity:"Mítico", released:RELEASED_FOUR },
  { id:"overshield", asset:"overshield", name:"Overshield", rarity:"Raro", released:RELEASED_FOUR },
  { id:"xray", asset:"xray", name:"X-Ray", rarity:"Legendario", released:RELEASED_FOUR },
  { id:"onigiri", asset:"onigiri", name:"Onigiri", rarity:"Raro", released:RELEASED_FOUR },
  { id:"stormking", asset:"stormscout", name:"Storm Scout", rarity:"Raro", released:RELEASED_FOUR },

  {
    id:"megaman",
    asset:"megaman",
    name:"Mega Man",
    rarity:"Raro",
    variants:["basic"],
    released:["basic"]
  },

  { id:"blinky", asset:"blinky", name:"Blinky", rarity:"Épico", released:RELEASED_FOUR },
  {
    id:"crash",
    asset:"crash",
    name:"Crash Bandicoot",
    rarity:"Épico",
    released:RELEASED_FOUR,
    labels:{ bounty:"Bounty Hunter Body Slam" }
  },
  { id:"pond", asset:"pond", name:"Pond", rarity:"Épico", released:RELEASED_FOUR },

  { id:"birthday", asset:"birthday", name:"Birthday", rarity:"Épico", released:[] },
  { id:"morgana", asset:"morgana", name:"Morgana", rarity:"Épico", released:[] }
];

const OVERRIDE_SPRITES = OVERRIDE_FAMILIES.flatMap(family => {
  const variants = family.variants || STANDARD_OVERRIDE_VARIANTS;
  const released = new Set(family.released || []);

  return variants.map(key => {
    const variant = OVERRIDE_VARIANTS[key];
    const displayName = family.labels?.[key] || variant.label(family.name);

    return {
      id: `${family.id}_${variant.idSuffix}`,
      name: displayName,
      originalName: displayName,
      theme: variant.theme,
      rarity: key === "basic" ? family.rarity : "Especial",
      image: `${OVERRIDE_ASSET_BASE}/${family.asset}_${variant.assetSuffix}.webp`,
      findRate: "No disponible",
      isNew: true,
      season: "Override",
      unreleased: !released.has(key),
      enabled: true
    };
  });
});

const existingSpriteIds = new Set(SPRITES.map(sprite => sprite.id));
for (const sprite of OVERRIDE_SPRITES) {
  if (!existingSpriteIds.has(sprite.id)) {
    SPRITES.push(sprite);
    existingSpriteIds.add(sprite.id);
  }
}
