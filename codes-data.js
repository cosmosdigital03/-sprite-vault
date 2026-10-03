// Sprite Vault — Fortnite Override Lobby Hacks
// Synced with Fortnite.GG on 2026-10-03.
// Existing used/not-used storage remains compatible because code strings are stable.

const LOBBY_HACK_CATEGORIES = [
  { id: "sprites", label: "Sprites", icon: "◆", command: "sprite.unlock", tone: "green" },
  { id: "resources", label: "XP / Sprite Dust", icon: "+", command: "wallet.inject", tone: "purple" },
  { id: "items", label: "Objetos / Consumibles", icon: "⌁", command: "inventory.spawn", tone: "orange" },
  { id: "locker", label: "Locker / Cosméticos", icon: "▣", command: "locker.override", tone: "cyan" },
  { id: "effects", label: "Efectos / Transformaciones", icon: "▦", command: "lobby.transform", tone: "yellow" }
];

const LOBBY_HACKS = [
  // Sprites
  { code: "JonesyIsGolden", reward: "Gold Jonesy Sprite", category: "sprites" },
  { code: "Born2Play", reward: "Cheat Master Adventure Sprite", category: "sprites" },
  { code: "8BitBlast", reward: "Cheat Master 8-Bit Sprite", category: "sprites" },
  { code: "GottaGoFast", reward: "Cheat Master Sonic Sprite", category: "sprites" },
  { code: "IWannaFlyHigh", reward: "Cheat Master Tails Sprite", category: "sprites" },
  { code: "Play4All", reward: "Cheat Master Jonesy Sprite", category: "sprites" },
  {
    code: "GatherAndCraft",
    reward: "Cheat Master Bush Sprite",
    category: "sprites",
    flag: "QUEST FIRST",
    note: "Completa primero las misiones de historia “Wrixel's Get Crafty”."
  },

  // Loading screens, Back Blings, sprays and styles
  { code: "S7H-50P-R03", reward: "Geno Story", category: "locker" },
  { code: "WeAreTheWorldChampionsToday", reward: "FNCS Sentry BackBling", category: "locker" },
  { code: "9Years", reward: "9th Birthday Sprite Spray", category: "locker" },
  { code: "SAYH12WR1X3L", reward: "Wrixel's Hero Portrait Spray", category: "locker" },
  {
    code: "YourThoughtsAreMine",
    reward: "Void Master Geno style + 5,000 Sprite Dust",
    category: "locker",
    flag: "HIDDEN QUEST",
    note: "Avanza hasta la misión final “Geno: The Ultimate Reality”, dispara al escudo de Geno y deja que te elimine para completar la misión oculta."
  },
  { code: "BeMoreAlien", reward: "Override Ready Loading Screen", category: "locker" },
  { code: "ReachYourImpossible", reward: "Block Party Loading Screen", category: "locker" },

  // XP and Sprite Dust
  { code: "WhoCrackedTheCode", reward: "40,000 XP", category: "resources" },
  { code: "DustySprites", reward: "5,000 Sprite Dust", category: "resources" },
  { code: "PlayToLevelUp", reward: "2,000 Sprite Dust", category: "resources" },
  { code: "BlinkyInkyPinkyClyde", reward: "5,000 Sprite Dust", category: "resources" },
  { code: "DustInTheWind", reward: "5,000 Sprite Dust", category: "resources" },
  { code: "WhereIsTheDustyTree", reward: "5,000 Sprite Dust", category: "resources" },
  {
    code: "H0p0nVC",
    reward: "2,000 Sprite Dust",
    category: "resources",
    flag: "0 = CERO",
    note: "Los caracteres redondos del código son ceros: 0."
  },
  { code: "OverrideXP", reward: "40,000 XP", category: "resources" },
  { code: "Magilume", reward: "2,000 Sprite Dust", category: "resources" },
  { code: "Chispambo", reward: "2,000 Sprite Dust", category: "resources" },
  { code: "Abgestaubt", reward: "2,000 Sprite Dust", category: "resources" },
  { code: "PerlimPinPin", reward: "2,000 Sprite Dust", category: "resources" },

  // Consumables / utility items
  { code: "IThinkTheKeyFoundMeChat", reward: "1× Extraction Accelerator", category: "items" },
  { code: "BoneRattler", reward: "4× Spicy Tacos", category: "items" },
  { code: "AlmostScaringSeason", reward: "2× Cheat Code Locators", category: "items" },
  { code: "ChatFindMeAnotherCode", reward: "2× Cheat Code Locators", category: "items" },
  { code: "NOCTURNEOP55N1", reward: "2× Extraction Accelerators", category: "items" },
  { code: "DestinyAwaits", reward: "2× Llama Supply Drops", category: "items" },
  { code: "BeamMeUp", reward: "2× Extraction Accelerators", category: "items" },
  { code: "NoProLlama", reward: "1× Llama Supply Drop", category: "items" },
  { code: "ChatWhereDoYouFindTheKey", reward: "2× Extraction Accelerators", category: "items" },
  { code: "InvalidCheat", reward: "2× Cheat Code Locators", category: "items" },
  { code: "SurviveTheNight", reward: "2× Cheat Code Locators", category: "items" },
  { code: "FindItChat", reward: "2× Cheat Code Locators", category: "items" },
  { code: "TakeYourHeart", reward: "2× Extraction Accelerators", category: "items" },
  { code: "PerfectOrder", reward: "4× Spicy Tacos", category: "items" },
  { code: "O2Override", reward: "1× Llama Supply Drop + 1× Portable Extractor", category: "items" },

  // Fun effects
  { code: "CrowsAreAfraid", reward: "Te convierte en un espantapájaros", category: "effects" },
  { code: "PumpkinSpiceLife", reward: "Te convierte en una calabaza", category: "effects" },
  { code: "PowerOut", reward: "FNAF Jumpscare", category: "effects" },
  { code: "BRB", reward: "Te convierte en un inodoro", category: "effects" },
  { code: "InsertCoinToContinue", reward: "Te convierte en una máquina arcade", category: "effects" },
  { code: "DontBlockMe", reward: "Te convierte en un Tetrimino", category: "effects" },
  { code: "LetsBlockAndRoll", reward: "Te convierte en un Tetrimino", category: "effects" }
];
