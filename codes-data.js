// Sprite Vault — Fortnite Override Lobby Hacks
// Updated 2026-08-20. Existing used/not-used storage remains compatible.

const LOBBY_HACK_CATEGORIES = [
  { id: "sprites", label: "Cheat Master Sprites", icon: "◆", command: "sprite.unlock", tone: "green" },
  { id: "resources", label: "XP / Sprite Dust", icon: "+", command: "wallet.inject", tone: "purple" },
  { id: "items", label: "Gizmos / Objetos", icon: "⌁", command: "inventory.spawn", tone: "orange" },
  { id: "locker", label: "Pantallas de carga", icon: "▣", command: "locker.override", tone: "cyan" },
  { id: "effects", label: "Efectos Tetris", icon: "▦", command: "lobby.transform", tone: "yellow" }
];

const LOBBY_HACKS = [
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
    note: "Requiere completar primero la misión correspondiente dentro del juego."
  },

  { code: "OverrideXP", reward: "40,000 XP", category: "resources" },
  {
    code: "H0p0nVC",
    reward: "2,000 Sprite Dust",
    category: "resources",
    flag: "0 = CERO",
    note: "Los caracteres redondos del código son ceros: 0."
  },
  { code: "Magilume", reward: "2,000 Sprite Dust", category: "resources" },
  { code: "Chispambo", reward: "2,000 Sprite Dust", category: "resources" },
  { code: "Abgestaubt", reward: "2,000 Sprite Dust", category: "resources" },
  { code: "PerlimPinPin", reward: "2,000 Sprite Dust", category: "resources" },

  { code: "SurviveTheNight", reward: "2× Cheat Code Locators", category: "items" },
  { code: "FindItChat", reward: "2× Cheat Code Locators", category: "items" },
  { code: "TakeYourHeart", reward: "2× Extraction Accelerators", category: "items" },
  { code: "PerfectOrder", reward: "4× Spicy Tacos", category: "items" },
  {
    code: "O2Override",
    reward: "1× Llama Supply Drop + Portable Extractor(s)",
    category: "items",
    flag: "CANTIDAD EN DISPUTA",
    note: "El código es real. Fortnite.GG indica 1 Portable Extractor; Beebom, GamesRadar y listas actuales de la comunidad reportan 5."
  },

  { code: "BeMoreAlien", reward: "Override Ready Loading Screen", category: "locker" },
  { code: "ReachYourImpossible", reward: "Block Party Loading Screen", category: "locker" },

  { code: "DontBlockMe", reward: "Te convierte en un Tetrimino", category: "effects" },
  { code: "LetsBlockAndRoll", reward: "Te convierte en un Tetrimino", category: "effects" }
];
