# Sprite Vault Tracker

Rastreador en español para organizar una colección de Sprites.

## Funciones incluidas

- Interfaz en español y diseño adaptable a teléfonos.
- Búsqueda por nombre o tema.
- Filtros: todos, tengo, me faltan y dominados.
- Agrupación por tema.
- Favoritos.
- Progreso de colección y dominio.
- Guardado automático en el navegador con `localStorage`.
- Enlace compartible que codifica únicamente el progreso de la colección.
- Botón para Discord.
- Sin base de datos ni instalación complicada.

## Abrirlo en tu computadora

Solo abre `index.html` en un navegador. Para evitar restricciones del navegador, también puedes iniciar un servidor local:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Publicarlo gratis en GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `sprite-vault`.
2. Sube estos archivos a la raíz del repositorio.
3. En GitHub abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/root`.
6. Guarda los cambios.

GitHub mostrará la dirección pública del sitio.

## Cambiar el enlace de Discord

En `index.html`, busca:

```html
href="https://discord.com/"
```

y reemplázalo por la invitación oficial de Sprite Vault.

## Agregar o editar Sprites

Abre `sprites.js`. Cada Sprite usa este formato:

```js
{
  id: "nombre-unico",
  name: "Nombre visible",
  theme: "Tema",
  rarity: "Rareza",
  glyph: "✨",
  accent: "rgba(139,92,246,.55)",
  description: "Descripción breve."
}
```

El prototipo usa iconos temporales para evitar copiar imágenes o recursos de otro sitio. Puedes sustituirlos por imágenes propias o por recursos que tengas permiso de usar.

## Importante

Este proyecto fue construido desde cero como una alternativa independiente inspirada únicamente en la idea general de un rastreador de colección. No copia el código, el diseño exacto ni los recursos visuales de otro proyecto.
