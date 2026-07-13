# Sprite Vault Tracker — Versión 2

Actualización del rastreador de Sprite Vault con los 66 Sprites publicados actualmente.

## Cambios incluidos

- 66 Sprites publicados.
- Imagen correcta asociada al ID de cada Sprite.
- Nombres traducidos al español.
- Nombre original en inglés debajo del nombre español.
- Búsqueda en español o inglés.
- Temas y rarezas traducidos.
- Diseño adaptable para computadora y teléfono.
- Progreso de colección y dominio.
- Filtros por estado y tema.
- Favoritos.
- Enlaces compartibles.
- Guardado automático en el navegador.

## Cómo actualizar tu página de GitHub

Sube y reemplaza estos cuatro archivos en la raíz del repositorio:

- `index.html`
- `styles.css`
- `sprites.js`
- `app.js`

También puedes reemplazar `README.md`, pero no es necesario para que la página funcione.

Después de hacer **Commit changes**, GitHub Pages se actualizará automáticamente. Generalmente tarda uno o dos minutos.

## Cambiar el enlace del Discord

En `index.html`, reemplaza:

```html
href="https://discord.com/"
```

por tu invitación de Sprite Vault.

## Agregar nuevos Sprites más adelante

En `sprites.js`, agrega otra entrada antes del cierre de la lista:

```js
{
  "id": "id_del_sprite",
  "name": "Nombre en español",
  "originalName": "English Name",
  "theme": "Tema",
  "rarity": "Rareza",
  "image": "URL_DE_LA_IMAGEN"
}
```

## Imágenes

Esta versión muestra las imágenes desde las direcciones públicas del repositorio de referencia. No incluye copias locales de los archivos. Si el repositorio original cambia las direcciones o elimina una imagen, esa imagen dejará de mostrarse.

Fortnite y sus recursos visuales pertenecen a Epic Games. Sprite Vault es un proyecto comunitario no oficial.
