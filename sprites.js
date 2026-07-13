const SPRITES = [
  {
    "id": "water_basic",
    "name": "Agua",
    "originalName": "Water",
    "theme": "Básico",
    "rarity": "Raro",
    "image": "images/water_basic.png"
  },
  {
    "id": "water_gold",
    "name": "Agua Dorada",
    "originalName": "Gold Water",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/water_gold.png"
  },
  {
    "id": "water_candy",
    "name": "Agua Gomita",
    "originalName": "Gummy Water",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/water_candy.png"
  },
  {
    "id": "water_galaxy",
    "name": "Agua Galáctica",
    "originalName": "Galaxy Water",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/water_galaxy.png"
  },
  {
    "id": "water_holofoil",
    "name": "Agua Holográfica",
    "originalName": "Holofoil Water",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/water_holofoil.png"
  },
  {
    "id": "earth_basic",
    "name": "Tierra",
    "originalName": "Earth",
    "theme": "Básico",
    "rarity": "Raro",
    "image": "images/earth_basic.png"
  },
  {
    "id": "earth_gold",
    "name": "Tierra Dorada",
    "originalName": "Gold Earth",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/earth_gold.png"
  },
  {
    "id": "earth_candy",
    "name": "Tierra Gomita",
    "originalName": "Gummy Earth",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/earth_candy.png"
  },
  {
    "id": "earth_galaxy",
    "name": "Tierra Galáctica",
    "originalName": "Galaxy Earth",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/earth_galaxy.png"
  },
  {
    "id": "fire_basic",
    "name": "Fuego",
    "originalName": "Fire",
    "theme": "Básico",
    "rarity": "Raro",
    "image": "images/fire_basic.png"
  },
  {
    "id": "fire_gold",
    "name": "Fuego Dorado",
    "originalName": "Gold Fire",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/fire_gold.png"
  },
  {
    "id": "fire_candy",
    "name": "Fuego Gomita",
    "originalName": "Gummy Fire",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/fire_candy.png"
  },
  {
    "id": "fire_galaxy",
    "name": "Fuego Galáctico",
    "originalName": "Galaxy Fire",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/fire_galaxy.png"
  },
  {
    "id": "fire_holofoil",
    "name": "Fuego Holográfico",
    "originalName": "Holofoil Fire",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/fire_holofoil.png"
  },
  {
    "id": "duck_basic",
    "name": "Pato",
    "originalName": "Duck",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/duck_basic.png"
  },
  {
    "id": "duck_gold",
    "name": "Pato Dorado",
    "originalName": "Gold Duck",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/duck_gold.png"
  },
  {
    "id": "duck_candy",
    "name": "Pato Gomita",
    "originalName": "Gummy Duck",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/duck_candy.png"
  },
  {
    "id": "duck_galaxy",
    "name": "Pato Galáctico",
    "originalName": "Galaxy Duck",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/duck_galaxy.png"
  },
  {
    "id": "ghost_basic",
    "name": "Fantasma",
    "originalName": "Ghost",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/ghost_basic.png"
  },
  {
    "id": "ghost_gold",
    "name": "Fantasma Dorado",
    "originalName": "Gold Ghost",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/ghost_gold.png"
  },
  {
    "id": "ghost_candy",
    "name": "Fantasma Gomita",
    "originalName": "Gummy Ghost",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/ghost_candy.png"
  },
  {
    "id": "ghost_galaxy",
    "name": "Fantasma Galáctico",
    "originalName": "Galaxy Ghost",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/ghost_galaxy.png"
  },
  {
    "id": "ghost_holofoil",
    "name": "Fantasma Holográfico",
    "originalName": "Holofoil Ghost",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/ghost_holofoil.png"
  },
  {
    "id": "dream_basic",
    "name": "Sueño",
    "originalName": "Dream",
    "theme": "Básico",
    "rarity": "Legendario",
    "image": "images/dream_basic.png"
  },
  {
    "id": "dream_gold",
    "name": "Sueño Dorado",
    "originalName": "Gold Dream",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/dream_gold.png"
  },
  {
    "id": "dream_candy",
    "name": "Sueño Gomita",
    "originalName": "Gummy Dream",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/dream_candy.png"
  },
  {
    "id": "dream_galaxy",
    "name": "Sueño Galáctico",
    "originalName": "Galaxy Dream",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/dream_galaxy.png"
  },
  {
    "id": "demon_basic",
    "name": "Demonio",
    "originalName": "Demon",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/demon_basic.png"
  },
  {
    "id": "demon_gold",
    "name": "Demonio Dorado",
    "originalName": "Gold Demon",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/demon_gold.png"
  },
  {
    "id": "demon_candy",
    "name": "Demonio Gomita",
    "originalName": "Gummy Demon",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/demon_candy.png"
  },
  {
    "id": "demon_galaxy",
    "name": "Demonio Galáctico",
    "originalName": "Galaxy Demon",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/demon_galaxy.png"
  },
  {
    "id": "punk_basic",
    "name": "Punk",
    "originalName": "Punk",
    "theme": "Básico",
    "rarity": "Legendario",
    "image": "images/punk_basic.png"
  },
  {
    "id": "punk_gold",
    "name": "Punk Dorado",
    "originalName": "Gold Punk",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/punk_gold.png"
  },
  {
    "id": "punk_candy",
    "name": "Punk Gomita",
    "originalName": "Gummy Punk",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/punk_candy.png"
  },
  {
    "id": "punk_galaxy",
    "name": "Punk Galáctico",
    "originalName": "Galaxy Punk",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/punk_galaxy.png"
  },
  {
    "id": "king_basic",
    "name": "Rey",
    "originalName": "King",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/king_basic.png"
  },
  {
    "id": "king_gold",
    "name": "Rey Dorado",
    "originalName": "Gold King",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/king_gold.png"
  },
  {
    "id": "king_candy",
    "name": "Rey Gomita",
    "originalName": "Gummy King",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/king_candy.png"
  },
  {
    "id": "king_galaxy",
    "name": "Rey Galáctico",
    "originalName": "Galaxy King",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/king_galaxy.png"
  },
  {
    "id": "king_holofoil",
    "name": "Rey Holográfico",
    "originalName": "Holofoil King",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/king_holofoil.png"
  },
  {
    "id": "zeropoint_basic",
    "name": "Punto Cero",
    "originalName": "Zero Point",
    "theme": "Básico",
    "rarity": "Mítico",
    "image": "images/zeropoint_basic.png"
  },
  {
    "id": "zeropoint_gold",
    "name": "Punto Cero Dorado",
    "originalName": "Gold Zero Point",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/zeropoint_gold.png"
  },
  {
    "id": "zeropoint_candy",
    "name": "Punto Cero Gomita",
    "originalName": "Gummy Zero Point",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/zeropoint_candy.png"
  },
  {
    "id": "zeropoint_galaxy",
    "name": "Punto Cero Galáctico",
    "originalName": "Galaxy Zero Point",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/zeropoint_galaxy.png"
  },
  {
    "id": "theburntpeanut_basic",
    "name": "Maní Quemado",
    "originalName": "Burnt Peanut",
    "theme": "Básico",
    "rarity": "Mítico",
    "image": "images/theburntpeanut_basic.png"
  },
  {
    "id": "fishy_basic",
    "name": "Pez",
    "originalName": "Fishy",
    "theme": "Básico",
    "rarity": "Raro",
    "image": "images/fishy_basic.png"
  },
  {
    "id": "fishy_gold",
    "name": "Pez Dorado",
    "originalName": "Gold Fishy",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/fishy_gold.png"
  },
  {
    "id": "fishy_candy",
    "name": "Pez Gomita",
    "originalName": "Gummy Fishy",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/fishy_candy.png"
  },
  {
    "id": "fishy_galaxy",
    "name": "Pez Galáctico",
    "originalName": "Galaxy Fishy",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/fishy_galaxy.png"
  },
  {
    "id": "striker_basic",
    "name": "Atacante",
    "originalName": "Striker",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/striker_basic.png"
  },
  {
    "id": "striker_gold",
    "name": "Atacante Dorado",
    "originalName": "Gold Striker",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/striker_gold.png"
  },
  {
    "id": "striker_candy",
    "name": "Atacante Gomita",
    "originalName": "Gummy Striker",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/striker_candy.png"
  },
  {
    "id": "striker_galaxy",
    "name": "Atacante Galáctico",
    "originalName": "Galaxy Striker",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/striker_galaxy.png"
  },
  {
    "id": "striker_holofoil",
    "name": "Atacante Holográfico",
    "originalName": "Holofoil Striker",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/striker_holofoil.png"
  },
  {
    "id": "aura_basic",
    "name": "Aura",
    "originalName": "Aura",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/aura_basic.png"
  },
  {
    "id": "aura_gold",
    "name": "Aura Dorada",
    "originalName": "Gold Aura",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/aura_gold.png"
  },
  {
    "id": "aura_candy",
    "name": "Aura Gomita",
    "originalName": "Gummy Aura",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/aura_candy.png"
  },
  {
    "id": "aura_galaxy",
    "name": "Aura Galáctica",
    "originalName": "Galaxy Aura",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/aura_galaxy.png"
  },
  {
    "id": "boss_basic",
    "name": "Jefe",
    "originalName": "Boss",
    "theme": "Básico",
    "rarity": "Legendario",
    "image": "images/boss_basic.png"
  },
  {
    "id": "boss_gold",
    "name": "Jefe Dorado",
    "originalName": "Gold Boss",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/boss_gold.png"
  },
  {
    "id": "boss_candy",
    "name": "Jefe Gomita",
    "originalName": "Gummy Boss",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/boss_candy.png"
  },
  {
    "id": "boss_galaxy",
    "name": "Jefe Galáctico",
    "originalName": "Galaxy Boss",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/boss_galaxy.png"
  },
  {
    "id": "grim_basic",
    "name": "Sombrío",
    "originalName": "Grim",
    "theme": "Básico",
    "rarity": "Mítico",
    "image": "images/grim_basic.png"
  },
  {
    "id": "grim_gold",
    "name": "Sombrío Dorado",
    "originalName": "Gold Grim",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/grim_gold.png"
  },
  {
    "id": "grim_candy",
    "name": "Sombrío Gomita",
    "originalName": "Gummy Grim",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/grim_candy.png"
  },
  {
    "id": "grim_galaxy",
    "name": "Sombrío Galáctico",
    "originalName": "Galaxy Grim",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/grim_galaxy.png"
  }
];
