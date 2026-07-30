# Configuración de roles de Sprite Vault V10.6

## No se asignan estos separadores

- 🧩 Colección
- 🏆 Dominio
- ✨ Especiales

Déjalos sin permisos. Solo sirven para ordenar la lista de roles.

## Comportamiento

- Colección: el bot elimina el nivel anterior y deja únicamente el nivel más alto.
- Dominio: el bot elimina el nivel anterior y deja únicamente el nivel más alto.
- Especiales: el usuario puede conservar varios a la vez.

## Nuevos niveles finales de Dominio

Conserva el rol que ya tienes y crea estos dos nuevos roles en Discord:

- 🌌 75 Sprites Dominados — de 75 a 90
- 🌠 91 Sprites Dominados — de 91 a 99
- 🏆 100 Sprites Dominados — 100

Colócalos en ese orden, con `🏆 100 Sprites Dominados` arriba de `🌠 91 Sprites Dominados`, y `🌠 91 Sprites Dominados` arriba de `🌌 75 Sprites Dominados`.

El sincronizador elimina el nivel anterior y deja únicamente el nivel de Dominio más alto que corresponda.

## Dos roles adicionales recomendados

- 🌈 Sprites Holofoil
- 🧊 Sprites Cubos

## Orden de Discord

Coloca el rol del bot por encima de todos los roles que administrará. Los separadores pueden quedarse donde ayuden a organizar visualmente la lista.

## Archivo para Supabase

1. Abre `supabase/ROLE-RULES-ONE-LINE.txt`.
2. Reemplaza cada `ROLE_ID_...` con el ID real copiado desde Discord.
3. En Supabase, crea el secreto `DISCORD_ROLE_RULES`.
4. Pega la línea completa como valor.
5. Despliega la función `sync-discord-role` incluida en esta versión.
