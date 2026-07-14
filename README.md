# Sprite Vault Tracker — Versión 3 (imágenes locales)

Esta versión incluye los 66 Sprites publicados y guarda sus imágenes dentro de la carpeta `images/`. El sitio ya no depende de las direcciones de imágenes del rastreador de referencia.

## Qué incluye

- 66 imágenes PNG locales.
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
- La carpeta completa `images` con sus 66 archivos PNG

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

- El botón **Entrar al Discord** abre `https://discord.gg/7AAnVUPZc`.
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
