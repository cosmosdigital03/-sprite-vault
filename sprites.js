const SPRITES = [
  {
    "id": "water_basic",
    "name": "Agua",
    "originalName": "Water",
    "theme": "Básico",
    "rarity": "Raro",
    "image": "images/water_basic.png",
    "findRate": "12.83%",
    "isNew": false
  },
  {
    "id": "water_gold",
    "name": "Agua Dorada",
    "originalName": "Gold Water",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/water_gold.png",
    "findRate": "0.7%",
    "isNew": false
  },
  {
    "id": "water_candy",
    "name": "Agua Gomita",
    "originalName": "Gummy Water",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/water_candy.png",
    "findRate": "0.28%",
    "isNew": false
  },
  {
    "id": "water_galaxy",
    "name": "Agua Galáctica",
    "originalName": "Galaxy Water",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/water_galaxy.png",
    "findRate": "0.28%",
    "isNew": false
  },
  {
    "id": "water_holofoil",
    "name": "Agua Holográfica",
    "originalName": "Holofoil Water",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/water_holofoil.png",
    "findRate": "0%",
    "isNew": false
  },
  {
    "id": "earth_basic",
    "name": "Tierra",
    "originalName": "Earth",
    "theme": "Básico",
    "rarity": "Raro",
    "image": "images/earth_basic.png",
    "findRate": "12.83%",
    "isNew": false
  },
  {
    "id": "earth_gold",
    "name": "Tierra Dorada",
    "originalName": "Gold Earth",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/earth_gold.png",
    "findRate": "0.7%",
    "isNew": false
  },
  {
    "id": "earth_candy",
    "name": "Tierra Gomita",
    "originalName": "Gummy Earth",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/earth_candy.png",
    "findRate": "0.28%",
    "isNew": false
  },
  {
    "id": "earth_galaxy",
    "name": "Tierra Galáctica",
    "originalName": "Galaxy Earth",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/earth_galaxy.png",
    "findRate": "0.28%",
    "isNew": false
  },
  {
    "id": "fire_basic",
    "name": "Fuego",
    "originalName": "Fire",
    "theme": "Básico",
    "rarity": "Raro",
    "image": "images/fire_basic.png",
    "findRate": "12.45%",
    "isNew": false
  },
  {
    "id": "fire_gold",
    "name": "Fuego Dorado",
    "originalName": "Gold Fire",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/fire_gold.png",
    "findRate": "0.68%",
    "isNew": false
  },
  {
    "id": "fire_candy",
    "name": "Fuego Gomita",
    "originalName": "Gummy Fire",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/fire_candy.png",
    "findRate": "0.68%",
    "isNew": false
  },
  {
    "id": "fire_galaxy",
    "name": "Fuego Galáctico",
    "originalName": "Galaxy Fire",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/fire_galaxy.png",
    "findRate": "0.27%",
    "isNew": false
  },
  {
    "id": "fire_holofoil",
    "name": "Fuego Holográfico",
    "originalName": "Holofoil Fire",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/fire_holofoil.png",
    "findRate": "0%",
    "isNew": false
  },
  {
    "id": "duck_basic",
    "name": "Pato",
    "originalName": "Duck",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/duck_basic.png",
    "findRate": "5.74%",
    "isNew": false
  },
  {
    "id": "duck_gold",
    "name": "Pato Dorado",
    "originalName": "Gold Duck",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/duck_gold.png",
    "findRate": "0.07%",
    "isNew": false
  },
  {
    "id": "duck_candy",
    "name": "Pato Gomita",
    "originalName": "Gummy Duck",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/duck_candy.png",
    "findRate": "0.04%",
    "isNew": false
  },
  {
    "id": "duck_galaxy",
    "name": "Pato Galáctico",
    "originalName": "Galaxy Duck",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/duck_galaxy.png",
    "findRate": "0.02%",
    "isNew": false
  },
  {
    "id": "ghost_basic",
    "name": "Fantasma",
    "originalName": "Ghost",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/ghost_basic.png",
    "findRate": "5.74%",
    "isNew": false
  },
  {
    "id": "ghost_gold",
    "name": "Fantasma Dorado",
    "originalName": "Gold Ghost",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/ghost_gold.png",
    "findRate": "0.07%",
    "isNew": false
  },
  {
    "id": "ghost_candy",
    "name": "Fantasma Gomita",
    "originalName": "Gummy Ghost",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/ghost_candy.png",
    "findRate": "0.04%",
    "isNew": false
  },
  {
    "id": "ghost_galaxy",
    "name": "Fantasma Galáctico",
    "originalName": "Galaxy Ghost",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/ghost_galaxy.png",
    "findRate": "0.02%",
    "isNew": false
  },
  {
    "id": "ghost_holofoil",
    "name": "Fantasma Holográfico",
    "originalName": "Holofoil Ghost",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/ghost_holofoil.png",
    "findRate": "0%",
    "isNew": false
  },
  {
    "id": "dream_basic",
    "name": "Sueño",
    "originalName": "Dream",
    "theme": "Básico",
    "rarity": "Legendario",
    "image": "images/dream_basic.png",
    "findRate": "2.63%",
    "isNew": false
  },
  {
    "id": "dream_gold",
    "name": "Sueño Dorado",
    "originalName": "Gold Dream",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/dream_gold.png",
    "findRate": "0.03%",
    "isNew": false
  },
  {
    "id": "dream_candy",
    "name": "Sueño Gomita",
    "originalName": "Gummy Dream",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/dream_candy.png",
    "findRate": "0.02%",
    "isNew": false
  },
  {
    "id": "dream_galaxy",
    "name": "Sueño Galáctico",
    "originalName": "Galaxy Dream",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/dream_galaxy.png",
    "findRate": "0.01%",
    "isNew": false
  },
  {
    "id": "demon_basic",
    "name": "Demonio",
    "originalName": "Demon",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/demon_basic.png",
    "findRate": "5.76%",
    "isNew": false
  },
  {
    "id": "demon_gold",
    "name": "Demonio Dorado",
    "originalName": "Gold Demon",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/demon_gold.png",
    "findRate": "0.07%",
    "isNew": false
  },
  {
    "id": "demon_candy",
    "name": "Demonio Gomita",
    "originalName": "Gummy Demon",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/demon_candy.png",
    "findRate": "0.04%",
    "isNew": false
  },
  {
    "id": "demon_galaxy",
    "name": "Demonio Galáctico",
    "originalName": "Galaxy Demon",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/demon_galaxy.png",
    "findRate": "0.02%",
    "isNew": false
  },
  {
    "id": "punk_basic",
    "name": "Punk",
    "originalName": "Punk",
    "theme": "Básico",
    "rarity": "Legendario",
    "image": "images/punk_basic.png",
    "findRate": "1.98%",
    "isNew": false
  },
  {
    "id": "punk_gold",
    "name": "Punk Dorado",
    "originalName": "Gold Punk",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/punk_gold.png",
    "findRate": "0.02%",
    "isNew": false
  },
  {
    "id": "punk_candy",
    "name": "Punk Gomita",
    "originalName": "Gummy Punk",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/punk_candy.png",
    "findRate": "0.01%",
    "isNew": false
  },
  {
    "id": "punk_galaxy",
    "name": "Punk Galáctico",
    "originalName": "Galaxy Punk",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/punk_galaxy.png",
    "findRate": "0.01%",
    "isNew": false
  },
  {
    "id": "king_basic",
    "name": "Rey",
    "originalName": "King",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/king_basic.png",
    "findRate": "5.74%",
    "isNew": false
  },
  {
    "id": "king_gold",
    "name": "Rey Dorado",
    "originalName": "Gold King",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/king_gold.png",
    "findRate": "0.07%",
    "isNew": false
  },
  {
    "id": "king_candy",
    "name": "Rey Gomita",
    "originalName": "Gummy King",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/king_candy.png",
    "findRate": "0.04%",
    "isNew": false
  },
  {
    "id": "king_galaxy",
    "name": "Rey Galáctico",
    "originalName": "Galaxy King",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/king_galaxy.png",
    "findRate": "0.02%",
    "isNew": false
  },
  {
    "id": "king_holofoil",
    "name": "Rey Holográfico",
    "originalName": "Holofoil King",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/king_holofoil.png",
    "findRate": "0%",
    "isNew": false
  },
  {
    "id": "zeropoint_basic",
    "name": "Punto Cero",
    "originalName": "Zero Point",
    "theme": "Básico",
    "rarity": "Mítico",
    "image": "images/zeropoint_basic.png",
    "findRate": "0.000098%",
    "isNew": false
  },
  {
    "id": "zeropoint_gold",
    "name": "Punto Cero Dorado",
    "originalName": "Gold Zero Point",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/zeropoint_gold.png",
    "findRate": "0.0000012%",
    "isNew": false
  },
  {
    "id": "zeropoint_candy",
    "name": "Punto Cero Gomita",
    "originalName": "Gummy Zero Point",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/zeropoint_candy.png",
    "findRate": "0.0000006%",
    "isNew": false
  },
  {
    "id": "zeropoint_galaxy",
    "name": "Punto Cero Galáctico",
    "originalName": "Galaxy Zero Point",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/zeropoint_galaxy.png",
    "findRate": "0.0000004%",
    "isNew": false
  },
  {
    "id": "theburntpeanut_basic",
    "name": "Maní Quemado",
    "originalName": "Burnt Peanut",
    "theme": "Básico",
    "rarity": "Mítico",
    "image": "images/theburntpeanut_basic.png",
    "findRate": "1.01%",
    "isNew": false
  },
  {
    "id": "fishy_basic",
    "name": "Pez",
    "originalName": "Fishy",
    "theme": "Básico",
    "rarity": "Raro",
    "image": "images/fishy_basic.png",
    "findRate": "13.79%",
    "isNew": false
  },
  {
    "id": "fishy_gold",
    "name": "Pez Dorado",
    "originalName": "Gold Fishy",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/fishy_gold.png",
    "findRate": "0.17%",
    "isNew": false
  },
  {
    "id": "fishy_candy",
    "name": "Pez Gomita",
    "originalName": "Gummy Fishy",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/fishy_candy.png",
    "findRate": "0.08%",
    "isNew": false
  },
  {
    "id": "fishy_galaxy",
    "name": "Pez Galáctico",
    "originalName": "Galaxy Fishy",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/fishy_galaxy.png",
    "findRate": "0.06%",
    "isNew": false
  },
  {
    "id": "striker_basic",
    "name": "Atacante",
    "originalName": "Striker",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/striker_basic.png",
    "findRate": "5.74%",
    "isNew": false
  },
  {
    "id": "striker_gold",
    "name": "Atacante Dorado",
    "originalName": "Gold Striker",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/striker_gold.png",
    "findRate": "0.07%",
    "isNew": false
  },
  {
    "id": "striker_candy",
    "name": "Atacante Gomita",
    "originalName": "Gummy Striker",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/striker_candy.png",
    "findRate": "0.04%",
    "isNew": false
  },
  {
    "id": "striker_galaxy",
    "name": "Atacante Galáctico",
    "originalName": "Galaxy Striker",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/striker_galaxy.png",
    "findRate": "0.02%",
    "isNew": false
  },
  {
    "id": "striker_holofoil",
    "name": "Atacante Holográfico",
    "originalName": "Holofoil Striker",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/striker_holofoil.png",
    "findRate": "0%",
    "isNew": false
  },
  {
    "id": "aura_basic",
    "name": "Aura",
    "originalName": "Aura",
    "theme": "Básico",
    "rarity": "Épico",
    "image": "images/aura_basic.png",
    "findRate": "5.74%",
    "isNew": false
  },
  {
    "id": "aura_gold",
    "name": "Aura Dorada",
    "originalName": "Gold Aura",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/aura_gold.png",
    "findRate": "0.07%",
    "isNew": false
  },
  {
    "id": "aura_candy",
    "name": "Aura Gomita",
    "originalName": "Gummy Aura",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/aura_candy.png",
    "findRate": "0.04%",
    "isNew": false
  },
  {
    "id": "aura_galaxy",
    "name": "Aura Galáctica",
    "originalName": "Galaxy Aura",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/aura_galaxy.png",
    "findRate": "0.02%",
    "isNew": false
  },
  {
    "id": "boss_basic",
    "name": "Jefe",
    "originalName": "Boss",
    "theme": "Básico",
    "rarity": "Legendario",
    "image": "images/boss_basic.png",
    "findRate": "2.63%",
    "isNew": false
  },
  {
    "id": "boss_gold",
    "name": "Jefe Dorado",
    "originalName": "Gold Boss",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/boss_gold.png",
    "findRate": "0.03%",
    "isNew": false
  },
  {
    "id": "boss_candy",
    "name": "Jefe Gomita",
    "originalName": "Gummy Boss",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/boss_candy.png",
    "findRate": "0.02%",
    "isNew": false
  },
  {
    "id": "boss_galaxy",
    "name": "Jefe Galáctico",
    "originalName": "Galaxy Boss",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/boss_galaxy.png",
    "findRate": "0.01%",
    "isNew": false
  },
  {
    "id": "grim_basic",
    "name": "Sombrío",
    "originalName": "Grim",
    "theme": "Básico",
    "rarity": "Mítico",
    "image": "images/grim_basic.png",
    "findRate": "0.000098%",
    "isNew": false
  },
  {
    "id": "grim_gold",
    "name": "Sombrío Dorado",
    "originalName": "Gold Grim",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/grim_gold.png",
    "findRate": "0.0000012%",
    "isNew": false
  },
  {
    "id": "grim_candy",
    "name": "Sombrío Gomita",
    "originalName": "Gummy Grim",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/grim_candy.png",
    "findRate": "0.0000006%",
    "isNew": false
  },
  {
    "id": "grim_galaxy",
    "name": "Sombrío Galáctico",
    "originalName": "Galaxy Grim",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/grim_galaxy.png",
    "findRate": "0.0000004%",
    "isNew": false
  },
  {
    "id": "batman_basic",
    "name": "Batman",
    "originalName": "Batman",
    "theme": "Básico",
    "rarity": "Mítico",
    "image": "images/batman_basic.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "batman_gold",
    "name": "Batman Dorado",
    "originalName": "Gold Batman",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/batman_gold.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "batman_candy",
    "name": "Batman Gomita",
    "originalName": "Gummy Batman",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/batman_candy.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "batman_galaxy",
    "name": "Batman Galáctico",
    "originalName": "Galaxy Batman",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/batman_galaxy.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "batman_holofoil",
    "name": "Batman Holográfico",
    "originalName": "Holofoil Batman",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/batman_holofoil.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "pollo_basic",
    "name": "Pollo",
    "originalName": "Pollo",
    "theme": "Básico",
    "rarity": "Mítico",
    "image": "images/pollo_basic.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "vini_jr_basic",
    "name": "Vini Jr.",
    "originalName": "Vini Jr.",
    "theme": "Básico",
    "rarity": "Mítico",
    "image": "images/vini_jr_basic.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "air_basic",
    "name": "Aire",
    "originalName": "Air",
    "theme": "Básico",
    "rarity": "Raro",
    "image": "images/air_basic.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "air_gold",
    "name": "Aire Dorado",
    "originalName": "Gold Air",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/air_gold.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "air_candy",
    "name": "Aire Gomita",
    "originalName": "Gummy Air",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/air_candy.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "air_galaxy",
    "name": "Aire Galáctico",
    "originalName": "Galaxy Air",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/air_galaxy.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "air_holofoil",
    "name": "Aire Holográfico",
    "originalName": "Holofoil Air",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/air_holofoil.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "seven_basic",
    "name": "Siete",
    "originalName": "Seven",
    "theme": "Básico",
    "rarity": "Legendario",
    "image": "images/seven_basic.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "seven_gold",
    "name": "Siete Dorado",
    "originalName": "Gold Seven",
    "theme": "Dorado",
    "rarity": "Especial",
    "image": "images/seven_gold.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "seven_candy",
    "name": "Siete Gomita",
    "originalName": "Gummy Seven",
    "theme": "Gomita",
    "rarity": "Especial",
    "image": "images/seven_candy.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "seven_galaxy",
    "name": "Siete Galáctico",
    "originalName": "Galaxy Seven",
    "theme": "Galaxia",
    "rarity": "Especial",
    "image": "images/seven_galaxy.webp",
    "findRate": "0%",
    "isNew": true
  },
  {
    "id": "seven_holofoil",
    "name": "Siete Holográfico",
    "originalName": "Holofoil Seven",
    "theme": "Holográfico",
    "rarity": "Especial",
    "image": "images/seven_holofoil.webp",
    "findRate": "0%",
    "isNew": true
  }
];
