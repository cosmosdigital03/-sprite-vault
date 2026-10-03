// Sprite Vault — Override (C7S4) roster
// Synced with Fortnite.GG on 2026-10-03.
// Released entries count toward collection progress. Datamined/upcoming entries remain
// visible but are marked unreleased until Fortnite.GG shows them as obtainable.
//
// Recent-added rotation:
// - Previous batches are cleared from "Nuevo".
// - Only the newest released batch is tagged isNew.
// - The scheduled sync replaces this set only when a genuinely newer batch releases.

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
  },
  trick: {
    idSuffix: "trick",
    assetSuffix: "trickortreat",
    theme: "Trick or Treat",
    label: name => `Trick or Treat ${name}`
  }
};

const STANDARD_OVERRIDE_VARIANTS = [
  "basic",
  "gold",
  "cheat",
  "hacker",
  "bounty",
  "trick"
];

const RELEASED_STANDARD = ["basic", "gold", "cheat", "hacker", "bounty"];
const RELEASED_CROWN = [...RELEASED_STANDARD, "trick"];

const OVERRIDE_FAMILIES = [
  { id:"jonesy", asset:"jonesy", name:"Jonesy", rarity:"Raro", released:RELEASED_STANDARD },
  { id:"adventure", asset:"adventure", name:"Adventure", rarity:"Raro", released:RELEASED_STANDARD },
  {
    id:"bush",
    asset:"bushranger",
    name:"Bush",
    rarity:"Raro",
    released:RELEASED_STANDARD,
    labels:{ hacker:"Loot Hacker Bushranger", trick:"Trick or Treat Bushranger" }
  },
  { id:"sonic", asset:"sonic", name:"Sonic", rarity:"Épico", released:RELEASED_STANDARD },
  { id:"tails", asset:"tails", name:"Tails", rarity:"Épico", released:RELEASED_STANDARD },
  { id:"shadow", asset:"shadow", name:"Shadow", rarity:"Épico", released:RELEASED_STANDARD },
  { id:"8bit", asset:"blaster", name:"8-Bit", rarity:"Raro", released:RELEASED_STANDARD },
  { id:"jackrabbit", asset:"jazz", name:"Jackrabbit", rarity:"Legendario", released:RELEASED_STANDARD },
  {
    id:"crown",
    asset:"victorycrown",
    name:"Crown",
    rarity:"Mítico",
    released:RELEASED_CROWN
  },
  { id:"killswitch", asset:"killswitch", name:"Killswitch", rarity:"Épico", released:RELEASED_STANDARD },
  { id:"klombo", asset:"klombo", name:"Klombo", rarity:"Mítico", released:RELEASED_STANDARD },
  { id:"overshield", asset:"overshield", name:"Overshield", rarity:"Raro", released:RELEASED_STANDARD },
  { id:"xray", asset:"xray", name:"X-Ray", rarity:"Legendario", released:RELEASED_STANDARD },
  { id:"onigiri", asset:"onigiri", name:"Onigiri", rarity:"Raro", released:RELEASED_STANDARD },
  { id:"stormking", asset:"stormscout", name:"Storm Scout", rarity:"Raro", released:RELEASED_STANDARD },

  {
    id:"megaman",
    asset:"megaman",
    name:"Mega Man",
    rarity:"Raro",
    variants:["basic"],
    released:["basic"]
  },

  { id:"blinky", asset:"blinky", name:"Blinky", rarity:"Épico", released:RELEASED_STANDARD },
  {
    id:"crash",
    asset:"crash",
    name:"Crash Bandicoot",
    rarity:"Épico",
    released:RELEASED_STANDARD,
    labels:{ bounty:"Bounty Hunter Body Slam" }
  },
  { id:"pond", asset:"pond", name:"Pond", rarity:"Épico", released:RELEASED_STANDARD },
  { id:"birthday", asset:"birthday", name:"Birthday", rarity:"Épico", released:RELEASED_STANDARD },
  { id:"morgana", asset:"morgana", name:"Morgana", rarity:"Épico", released:RELEASED_STANDARD },

  // Fortnitemares v42.30 — released 2026-10-01.
  { id:"spookydash", asset:"phasedash", name:"Spooky Dash", rarity:"Mítico", released:RELEASED_STANDARD },
  { id:"vampire", asset:"vampire", name:"Vampire", rarity:"Legendario", released:RELEASED_STANDARD },
  { id:"thedeer", asset:"deer", name:"The Deer", rarity:"Legendario", released:RELEASED_STANDARD },
  { id:"dumpsterdive", asset:"dumpster", name:"Dumpster Dive", rarity:"Épico", released:RELEASED_STANDARD }
];

// Current "Nuevos" batch: the four Fortnitemares families (all five live variants)
// plus the first live Trick or Treat variant, Crown.
const RECENT_OVERRIDE_IDS = new Set([
  "spookydash_basic",
  "spookydash_gold",
  "spookydash_cheat",
  "spookydash_hacker",
  "spookydash_bounty",
  "vampire_basic",
  "vampire_gold",
  "vampire_cheat",
  "vampire_hacker",
  "vampire_bounty",
  "thedeer_basic",
  "thedeer_gold",
  "thedeer_cheat",
  "thedeer_hacker",
  "thedeer_bounty",
  "dumpsterdive_basic",
  "dumpsterdive_gold",
  "dumpsterdive_cheat",
  "dumpsterdive_hacker",
  "dumpsterdive_bounty",
  "crown_trick"
]);

const OVERRIDE_SPRITES = OVERRIDE_FAMILIES.flatMap(family => {
  const variants = family.variants || STANDARD_OVERRIDE_VARIANTS;
  const released = new Set(family.released || []);

  return variants.map(key => {
    const variant = OVERRIDE_VARIANTS[key];
    const id = `${family.id}_${variant.idSuffix}`;
    const displayName = family.labels?.[key] || variant.label(family.name);

    return {
      id,
      name: displayName,
      originalName: displayName,
      theme: variant.theme,
      rarity: key === "basic" ? family.rarity : "Especial",
      image: `${OVERRIDE_ASSET_BASE}/${family.asset}_${variant.assetSuffix}.webp`,
      findRate: "0%",
      isNew: RECENT_OVERRIDE_IDS.has(id) && released.has(key),
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
