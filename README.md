# Sprite Vault Tracker — V10.1

Esta versión incluye los 83 Sprites publicados y guarda sus imágenes dentro de la carpeta `images/`. El sitio ya no depende de las direcciones de imágenes del rastreador de referencia.

## Qué incluye

- 83 imágenes locales (PNG y WebP).
- Nombres en español y nombres originales en inglés.
- Búsqueda en ambos idiomas.
- Filtros por estado y tema.
- Progreso de colección y dominio.
- Favoritos y enlaces compartibles.
- Guardado automático en el navegador.
- Diseño adaptable para computadora y teléfono.

## Archivos que debes subir a GitHub

Sube todo lo que aparece dentro de esta carpeta:

- `index.html`
- `styles.css`
- `sprites.js`
- `app.js`
- `README.md`
- La carpeta completa `images` con sus 83 imágenes

No subas solamente el ZIP. Extrae el ZIP y arrastra todo su contenido a **Add file → Upload files** en GitHub. Son 71 archivos, por debajo del límite de 100 archivos de la subida web.

Después pulsa **Commit changes**. GitHub Pages se actualizará automáticamente.

## Cambiar el enlace del Discord

En `index.html`, reemplaza:

```html
href="https://discord.com/"
```

por la invitación oficial de Sprite Vault.

## Agregar nuevos Sprites

1. Guarda la nueva imagen PNG dentro de `images/`.
2. Abre `sprites.js`.
3. Agrega una entrada con este formato:

```js
{
  "id": "id_del_sprite",
  "name": "Nombre en español",
  "originalName": "English Name",
  "theme": "Tema",
  "rarity": "Rareza",
  "image": "images/id_del_sprite.png"
}
```

## Derechos y política de fans

Las imágenes de Fortnite siguen siendo propiedad de Epic Games. Guardarlas localmente evita que el sitio se rompa si otra persona cambia su repositorio, pero no transfiere la propiedad de las imágenes a Sprite Vault. El sitio debe seguir siendo gratuito y no comercial y cumplir la Política de contenido de fans de Epic.

El sitio incluye el aviso exigido por Epic:

> Portions of the materials used are trademarks and/or copyrighted works of Epic Games, Inc. All rights reserved by Epic. This material is not official and is not endorsed by Epic.


## Actualización V4

- Fondos temáticos en cada tarjeta de Sprite.
- La imagen del fondo se revela más al pasar el mouse (hover).
- Cada variante tiene un color de ambiente distinto, por ejemplo Dorado y Galaxia.
- Se agregó `images/vault-card-bg.webp` como fondo local para las tarjetas.


## Actualización V5 — Fondo visible

- La imagen `images/vault-card-bg.webp` aparece claramente detrás de cada Sprite.
- En estado normal se ve con un tinte según la variante.
- Al pasar el mouse, el fondo se aclara y hace un zoom suave.
- Se conservó la clave de progreso anterior para evitar reiniciar las colecciones guardadas.


## Actualización V6

- El fondo de la habitación ahora pertenece a toda la página.
- Las tarjetas ya no repiten la habitación; conservan únicamente el tinte de cada variante.
- En teléfonos, el panel de búsqueda y filtros deja de seguir al usuario al desplazarse.
- La introducción superior es más corta.
- El contador de Sprites de la introducción se actualiza automáticamente al agregar nuevos elementos.


## Actualización V7

- El botón **Únete a Sprite Vault** abre `https://discord.gg/7AAnVUPZc`.
- El icono `SV` fue reemplazado por el Sprite dorado local en `images/sprite-vault-logo.png`.


## Actualización V8

- Nuevo filtro **Sin dominar**.
- Este filtro muestra solamente los Sprites que el usuario tiene pero todavía no ha dominado.
- Los botones de estado ahora muestran contadores automáticos:
  - Todos
  - Tengo
  - Me faltan
  - Dominados
  - Sin dominar
- El progreso guardado existente sigue siendo compatible.


## Actualización V9

- Círculo de progreso con porcentaje total.
- Botón para limpiar búsqueda y filtros.
- Barra de categorías reorganizada para teléfonos.
- Ventana de detalles al pulsar una imagen.
- Porcentajes comunitarios estimados de aparición consultados en Fortnite.GG el 14 de julio de 2026.
- Explicación automática de qué tan raro es cada porcentaje.
- Etiqueta **Nuevo** en los Sprites marcados como recientes.
- Nombre de perfil y usuario de Discord guardados localmente.
- Tarjeta personalizada de colección.
- Enlace público compacto con el progreso codificado en la URL.
- Las colecciones públicas se abren en modo de solo lectura.

Los porcentajes de aparición pueden cambiar con el tiempo y no son probabilidades oficiales publicadas por Epic Games.


## Actualización V9.1

- Se eliminó de todos los detalles la línea:
  `Dato comunitario consultado en Fortnite.GG. Puede cambiar con nuevas estadísticas.`
- El botón **Perfil y compartir** ahora aparece también en teléfonos.
- Los dos botones del encabezado se ajustan para pantallas móviles pequeñas.


## Actualización V9.2

- El ejemplo de nombre del perfil ahora es `John`.
- El ejemplo de usuario de Discord ahora es `vault034`.
- La vista previa vacía muestra `John` y `@vault034`.
- No se modificó ninguna otra función del Tracker.


## Actualización V9.3

- Total actualizado de 66 a **83 Sprites publicados**.
- Se agregaron 17 Sprites nuevos con imágenes locales:
  - Batman, Batman Dorado, Batman Gomita, Batman Galáctico y Batman Holográfico.
  - Pollo.
  - Vini Jr.
  - Aire, Aire Dorado, Aire Gomita, Aire Galáctico y Aire Holográfico.
  - Siete, Siete Dorado, Siete Gomita, Siete Galáctico y Siete Holográfico.
- Los 17 nuevos aparecen con la etiqueta **Nuevo**.
- Los IDs y el orden de los 66 Sprites anteriores se conservaron para proteger el progreso guardado y la compatibilidad de enlaces compartidos anteriores.


## Actualización V9.4

- `Perfil y compartir` fue reemplazado por **Compartir lista**.
- La nueva vista reúne todos los Sprites en una cuadrícula compacta para hacer capturas.
- Los Sprites que faltan aparecen oscuros, en escala de grises y con borde rojo.
- Los Sprites que el usuario tiene muestran una marca verde.
- Los dominados muestran una estrella dorada.
- Se puede alternar entre:
  - Todos juntos
  - Solo me faltan
- Se agregó la categoría **Nuevos**.
- En Nuevos, los Sprites faltantes aparecen primero y están claramente marcados.
- El progreso guardado continúa usando la misma clave y no se reinicia.


## Actualización V9.5

- Los Sprites que faltan permanecen completamente a color en la lista para capturas.
- El borde rojo y el símbolo `!` identifican los faltantes sin oscurecer sus imágenes.
- El ícono azul del inicio fue reemplazado por una vitrina 3D de Sprites.
- La vitrina:
  - selecciona un Sprite aleatorio;
  - cambia cada 5 a 10 segundos;
  - gira suavemente;
  - utiliza el color de su rareza como iluminación;
  - muestra su nombre, tema y rareza;
  - continúa visible en teléfonos.
- El progreso guardado conserva la misma clave y no se reinicia.


## Actualización V9.6

- Se corrigió la vitrina 3D que podía quedarse mostrando `Cargando Sprite`.
- La página ahora fuerza la carga de los archivos V9.6 mediante versionado:
  - `styles.css?v=9.6`
  - `sprites.js?v=9.6`
  - `app.js?v=9.6`
- La vitrina muestra `Fuego` inmediatamente como respaldo y luego comienza la rotación aleatoria.
- Se añadió un sistema de respaldo para que ninguna transición se quede bloqueada.
- Todos los Sprites faltantes permanecen completamente a color.
- Los faltantes se distinguen únicamente mediante borde rojo y símbolo rojo.
- También se eliminó el efecto oscuro de los Sprites faltantes en la categoría Nuevos.
- La clave de progreso sigue siendo `spriteVaultProgressV4`.


## Actualización V9.7 — Banner y roles por colección

> Nota: la configuración de cinco roles descrita en esta sección fue reemplazada por el sistema V10.1 al final de este archivo. Usa `DISCORD_ROLE_RULES`, no `DISCORD_COLLECTION_ROLES`.

- Se agregó un banner público en español: **¿Te falta un Sprite?**
- El banner invita a entrar a Sprite Vault para hacer intercambios, prestar o recibir Sprites.
- El tracker continúa gratis y público; Discord no es obligatorio.
- Se agregó una tarjeta de **Recompensas de Discord** que calcula el rol disponible según la colección.
- Se preparó el inicio de sesión con Discord usando Supabase Auth.
- Se agregó el botón **Sincronizar rol** y una Supabase Edge Function segura.
- El token del bot y los IDs de roles nunca se colocan en el navegador.
- La clave de progreso continúa siendo `spriteVaultProgressV4`, por lo que esta actualización no borra selecciones guardadas.

### Activar la conexión de Discord

1. En Supabase, abre **Authentication → Providers → Discord** y activa el proveedor.
2. En Discord Developer Portal, crea o usa la aplicación del bot y agrega la Redirect URL que Supabase muestra para Discord.
3. En Supabase **URL Configuration**, agrega la dirección exacta de tu GitHub Pages como Redirect URL permitida.
4. Abre `discord-config.js` y pega únicamente:
   - `supabaseUrl`
   - `supabasePublishableKey`
5. Crea estos cinco roles en Discord y copia sus IDs:
   - 🧩 Sprite Collector — 1 a 9
   - 🔹 Vault Collector — 10 a 24
   - 💠 Sprite Archivist — 25 a 49
   - 🔮 Master Collector — 50 a 82
   - 👑 Vault Completionist — 83
6. El bot necesita **Manage Roles** y su rol debe estar por encima de los cinco roles de colección.
7. En Supabase Edge Function Secrets agrega:
   - `DISCORD_BOT_TOKEN`
   - `DISCORD_GUILD_ID`
   - `DISCORD_COLLECTION_ROLES` usando el contenido de `supabase/ROLE-RULES-EXAMPLE.json` con los IDs reales.
   - `ALLOWED_ORIGIN` con la URL de tu GitHub Pages.
8. Despliega la función:

```bash
supabase functions deploy sync-discord-role
```

### Seguridad importante

Los siguientes valores son privados y nunca deben aparecer en `discord-config.js`, `index.html` ni GitHub:

- Discord bot token
- Supabase secret key o service role key
- Cualquier archivo `.env`

La Publishable/Anon key de Supabase sí se usa en el navegador; protege los datos con autenticación y Row Level Security.


## Actualización V10.1 — Colección, Dominio y Especiales

- El sincronizador ahora administra tres grupos independientes de roles:
  - **Colección:** mantiene solamente el nivel más alto alcanzado.
  - **Dominio:** mantiene solamente el nivel más alto alcanzado.
  - **Especiales:** permite tener varios al mismo tiempo.
- Se configuraron los diez niveles de Colección desde 10 hasta 100+ Sprites.
- Se configuraron los siete niveles de Dominio desde 5 hasta 75+ Sprites dominados.
- Se prepararon roles Especiales para Galaxia, Gummy, Dorados, Holofoil y Cubos.
- Los roles `🧩 Colección`, `🏆 Dominio` y `✨ Especiales` son separadores visuales; el bot nunca los asigna.
- El tracker actual contiene 83 Sprites. Por ahora, el nivel máximo alcanzable de Colección es `🐉 Coleccionista Legendario` con 80 Sprites.
- `🪄 Coleccionista Mítico` y `👑✨ Coleccionista Absoluto` comenzarán a funcionar automáticamente cuando el tracker alcance 90 y 100 Sprites.
- La clave local sigue siendo `spriteVaultProgressV4`; la actualización no borra selecciones guardadas.

### Roles Especiales que debes tener creados

Además de los tres que ya creaste, crea estos dos si deseas sincronizarlos:

- `🌈 Sprites Holofoil`
- `🧊 Sprites Cubos`

El rol de Cubos quedará preparado, pero no se entregará hasta que los Sprites Cubo estén añadidos a `sprites.js` con tema `Cubo` o un ID que comience con `cube_`.

### Secretos de Supabase para V10.1

Usa estos secretos en la Edge Function:

- `DISCORD_BOT_TOKEN`
- `DISCORD_GUILD_ID`
- `ALLOWED_ORIGIN`
- `DISCORD_ROLE_RULES`

Para `DISCORD_ROLE_RULES`, abre `supabase/ROLE-RULES-ONE-LINE.txt`, reemplaza cada texto `ROLE_ID_...` por el ID real del rol correspondiente y pega la línea completa como valor del secreto.

No agregues los tres roles separadores al JSON. El bot solo debe administrar los 10 roles de Colección, 7 de Dominio y 5 Especiales.


## Cambios V10.1

- Botón móvil visible “Volver a la lista” dentro de los detalles de cada Sprite.
- El botón Atrás del teléfono también cierra los detalles.
- Nombre inglés y porcentaje aparecen juntos en cada tarjeta.
- En detalles, el porcentaje aparece junto al nombre inglés con la etiqueta “Probabilidad estimada de encontrarlo”.
- “Compartir lista” está junto a “Únete a Sprite Vault”.
- Se eliminaron los botones repetidos “Entrar al Discord / Entrar al servidor”.
- Incluye la Edge Function corregida para respetar los límites de Discord.


## V10.1 — Mobile compact UI

- Mobile cards and progress sections are denser and easier to scan.
- Sprite details use a floating rounded back button.
- Sharing adds a Screenshot mode organized by Sprite type, one row per type and one column per variant.
- Existing browser progress and Discord role synchronization remain unchanged.

## V10.1
- Restored full Sprite visibility on mobile cards.
- Screenshot matrix reduced to about 632 CSS pixels for all 21 type rows.
- Screenshot type names and variant headings are now Spanish.
- Mastery indicators use a centered gold crown.
- The existing `spriteVaultProgressV4` storage key and Discord integration are unchanged.
