# Configuración de roles de Sprite Vault V9.8

## No se asignan estos separadores

- 🧩 Colección
- 🏆 Dominio
- ✨ Especiales

Déjalos sin permisos. Solo sirven para ordenar la lista de roles.

## Comportamiento

- Colección: el bot elimina el nivel anterior y deja únicamente el nivel más alto.
- Dominio: el bot elimina el nivel anterior y deja únicamente el nivel más alto.
- Especiales: el usuario puede conservar varios a la vez.

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
