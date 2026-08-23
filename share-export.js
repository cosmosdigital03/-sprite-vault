// Sprite Vault — share/export menu
// Replaces the old inline capture flow with PNG exports opened in a new page.
(() => {
  if (typeof SPRITES === "undefined" || typeof state === "undefined") return;

  const shareButton = document.getElementById("shareButton");
  if (!shareButton || shareButton.dataset.pngShareReady === "true") return;
  shareButton.dataset.pngShareReady = "true";

  const SHARE_MODES = [
    { key: "all", label: "Lista completa", dot: "#9ca3af" },
    { key: "collected", label: "Mi colección", dot: "#22c55e" },
    { key: "missing", label: "Sprites que me faltan", dot: "#ef4444" },
    { key: "unmastered", label: "Sprites no dominados", dot: "#22d3ee" },
    { key: "mastered", label: "Sprites dominados", dot: "#facc15" }
  ];

  const MODE_CONFIG = {
    all: { title: "LISTA COMPLETA", accent: "#8b5cf6" },
    collected: { title: "MI COLECCIÓN", accent: "#22c55e" },
    missing: { title: "ME FALTAN", accent: "#ef4444" },
    unmastered: { title: "NO DOMINADOS", accent: "#22d3ee" },
    mastered: { title: "DOMINADOS", accent: "#facc15" }
  };

  const THEME_ORDER = [
    "Básico", "Dorado", "Gomita", "Galaxia", "Gema", "Holográfico", "Cubo", "Pato", "Cheat Master"
  ];

  const style = document.createElement("style");
  style.textContent = `
    .share-export-wrap { position: relative; display: inline-flex; }
    .share-export-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      z-index: 1200;
      width: min(290px, calc(100vw - 28px));
      padding: 8px;
      border: 1px solid rgba(151, 168, 210, .22);
      border-radius: 14px;
      background: rgba(13, 18, 32, .98);
      box-shadow: 0 20px 55px rgba(0,0,0,.48);
      backdrop-filter: blur(18px);
    }
    .share-export-menu[hidden] { display: none !important; }
    .share-export-menu button {
      width: 100%;
      min-height: 42px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border: 0;
      border-radius: 9px;
      background: transparent;
      color: #eef5ff;
      font: 700 13px/1.25 Inter, sans-serif;
      text-align: left;
      cursor: pointer;
    }
    .share-export-menu button:hover,
    .share-export-menu button:focus-visible { background: rgba(121, 145, 255, .12); outline: none; }
    .share-export-dot { width: 8px; height: 8px; border-radius: 999px; flex: 0 0 auto; box-shadow: 0 0 12px currentColor; }
    .share-export-note {
      display: block;
      padding: 8px 12px 4px;
      color: rgba(210,220,242,.58);
      font: 600 10px/1.35 Inter, sans-serif;
      letter-spacing: .03em;
    }
    #shareButton[aria-expanded="true"] { border-color: rgba(143, 100, 255, .72); box-shadow: 0 0 0 1px rgba(143,100,255,.18), 0 0 24px rgba(113,72,255,.16); }
    @media (max-width: 620px) {
      .share-export-menu { position: fixed; top: auto; left: 14px; right: 14px; bottom: 14px; width: auto; }
    }
  `;
  document.head.append(style);

  const wrapper = document.createElement("div");
  wrapper.className = "share-export-wrap";
  shareButton.parentNode.insertBefore(wrapper, shareButton);
  wrapper.append(shareButton);

  shareButton.setAttribute("aria-haspopup", "menu");
  shareButton.setAttribute("aria-expanded", "false");

  const menu = document.createElement("div");
  menu.className = "share-export-menu";
  menu.hidden = true;
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-label", "Opciones para compartir la lista");

  for (const mode of SHARE_MODES) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.shareExport = mode.key;
    button.setAttribute("role", "menuitem");
    button.innerHTML = `<span class="share-export-dot" style="background:${mode.dot};color:${mode.dot}"></span><span>${mode.label}</span>`;
    menu.append(button);
  }

  const note = document.createElement("span");
  note.className = "share-export-note";
  note.textContent = "Cada opción abre una página nueva con una imagen PNG lista para guardar o compartir.";
  menu.append(note);
  wrapper.append(menu);

  function setMenuOpen(open) {
    menu.hidden = !open;
    shareButton.setAttribute("aria-expanded", String(open));
  }

  // Capture-phase listener intentionally takes priority over the legacy openCaptureView click handler in app.js.
  shareButton.addEventListener("click", event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    setMenuOpen(menu.hidden);
  }, true);

  document.addEventListener("click", event => {
    if (!wrapper.contains(event.target)) setMenuOpen(false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  menu.addEventListener("click", event => {
    const button = event.target.closest("button[data-share-export]");
    if (!button) return;
    const mode = button.dataset.shareExport;
    setMenuOpen(false);
    openSharePng(mode, button);
  });

  function getProgress(sprite) {
    return state.progress?.[sprite.id] || { owned: false, mastered: false };
  }

  function getSpritesForMode(mode) {
    const list = SPRITES.filter(sprite => {
      const progress = getProgress(sprite);
      if (mode === "collected") return progress.owned;
      if (mode === "missing") return !progress.owned;
      if (mode === "unmastered") return progress.owned && !progress.mastered;
      if (mode === "mastered") return progress.mastered;
      return true;
    });

    const order = new Map(SPRITES.map((sprite, index) => [sprite.id, index]));
    return [...list].sort((a, b) => {
      const themeA = THEME_ORDER.indexOf(a.theme);
      const themeB = THEME_ORDER.indexOf(b.theme);
      const safeA = themeA < 0 ? 999 : themeA;
      const safeB = themeB < 0 ? 999 : themeB;
      if (safeA !== safeB) return safeA - safeB;
      return (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0);
    });
  }

  function loadImage(src) {
    return new Promise(resolve => {
      const image = new Image();
      if (/^https?:\/\//i.test(src)) image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });
  }

  function roundedRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function fitText(ctx, text, maxWidth, startSize, minSize = 8, weight = 800) {
    let size = startSize;
    do {
      ctx.font = `${weight} ${size}px Oswald, Arial Narrow, sans-serif`;
      if (ctx.measureText(text).width <= maxWidth || size <= minSize) break;
      size -= .5;
    } while (size > minSize);
    return size;
  }

  function themeColors(sprite) {
    const byTheme = {
      "Básico": ["#113e68", "#071526", "#38bdf8"],
      "Dorado": ["#655019", "#211904", "#facc15"],
      "Gomita": ["#682149", "#210817", "#f472b6"],
      "Galaxia": ["#322067", "#0b071e", "#a78bfa"],
      "Gema": ["#154e45", "#061a18", "#34d399"],
      "Holográfico": ["#214c59", "#07171e", "#67e8f9"],
      "Cubo": ["#532069", "#16071d", "#c084fc"],
      "Pato": ["#175685", "#08182b", "#7dd3fc"],
      "Cheat Master": ["#5b1d62", "#16071d", "#f472d0"]
    };
    return byTheme[sprite.theme] || byTheme["Básico"];
  }

  function rarityLabel(sprite) {
    return String(sprite.rarity || "Especial").toUpperCase();
  }

  function drawCard(ctx, sprite, image, x, y, w, h, mode) {
    const progress = getProgress(sprite);
    const [top, bottom, border] = themeColors(sprite);
    const imageH = h - 42;

    ctx.save();
    roundedRect(ctx, x, y, w, h, 10);
    ctx.clip();

    const gradient = ctx.createLinearGradient(x, y, x, y + imageH);
    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, w, imageH);

    const shine = ctx.createLinearGradient(x, y, x, y + imageH);
    shine.addColorStop(0, "rgba(255,255,255,.16)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = shine;
    ctx.fillRect(x, y, w, imageH);

    if (image && image.naturalWidth) {
      const maxW = w * .84;
      const maxH = imageH * .76;
      const scale = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight);
      const dw = image.naturalWidth * scale;
      const dh = image.naturalHeight * scale;
      ctx.drawImage(image, x + (w - dw) / 2, y + (imageH - dh) / 2 + 7, dw, dh);
    }

    ctx.fillStyle = "rgba(4,8,15,.88)";
    ctx.fillRect(x, y + imageH, w, 42);

    ctx.fillStyle = border;
    ctx.fillRect(x, y + imageH - 4, w, 4);

    ctx.fillStyle = "rgba(2,7,14,.82)";
    ctx.fillRect(x + 7, y + 7, Math.min(72, w - 14), 20);
    ctx.fillStyle = border;
    ctx.font = "900 10px Oswald, Arial Narrow, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(rarityLabel(sprite), x + 12, y + 17);

    if (sprite.isNew) {
      ctx.fillStyle = "#67e8f9";
      ctx.fillRect(x + w - 37, y + 7, 30, 20);
      ctx.fillStyle = "#06131a";
      ctx.font = "900 9px Oswald, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("NEW", x + w - 22, y + 17);
    }

    if (progress.mastered) {
      ctx.beginPath();
      ctx.arc(x + w - 17, y + imageH - 18, 12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(250,204,21,.94)";
      ctx.fill();
      ctx.fillStyle = "#151004";
      ctx.font = "900 14px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("♛", x + w - 17, y + imageH - 17);
    }

    const name = String(sprite.name || sprite.originalName || "Sprite").toUpperCase();
    ctx.fillStyle = "#f8fbff";
    fitText(ctx, name, w - 12, 16, 7, 800);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, x + w / 2, y + imageH + 21);

    ctx.restore();

    ctx.strokeStyle = mode === "missing" ? "rgba(239,68,68,.9)" : border;
    ctx.lineWidth = 2;
    roundedRect(ctx, x + 1, y + 1, w - 2, h - 2, 10);
    ctx.stroke();
  }

  async function buildShareCanvas(mode) {
    const config = MODE_CONFIG[mode] || MODE_CONFIG.all;
    const sprites = getSpritesForMode(mode);

    if (!sprites.length) {
      const emptyMessages = {
        collected: "Todavía no tienes Sprites marcados en tu colección.",
        missing: "¡Ya tienes todos los Sprites!",
        unmastered: "No tienes Sprites pendientes por dominar.",
        mastered: "Todavía no has marcado Sprites como dominados."
      };
      alert(emptyMessages[mode] || "No hay Sprites para esta imagen.");
      return null;
    }

    try { await document.fonts.ready; } catch {}

    const cardW = 148;
    const cardH = 184;
    const gap = 12;
    const pad = 18;
    const border = 6;
    const headerH = 92;
    const footerH = 54;
    const cols = Math.min(6, sprites.length);
    const rows = Math.ceil(sprites.length / cols);
    const contentW = cols * cardW + (cols - 1) * gap;

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(420, contentW + pad * 2 + border * 2);
    canvas.height = border + headerH + pad + rows * cardH + Math.max(0, rows - 1) * gap + pad + footerH + border;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = config.accent;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#070a11";
    ctx.fillRect(border, border, canvas.width - border * 2, canvas.height - border * 2);

    const headerGrad = ctx.createLinearGradient(border, border, canvas.width - border, border + headerH);
    headerGrad.addColorStop(0, "#151b2a");
    headerGrad.addColorStop(1, "#0d111b");
    ctx.fillStyle = headerGrad;
    ctx.fillRect(border, border, canvas.width - border * 2, headerH);
    ctx.fillStyle = config.accent;
    ctx.fillRect(border, border + headerH - 3, canvas.width - border * 2, 3);

    const [logo, ...images] = await Promise.all([
      loadImage("images/sprite-vault-logo.png"),
      ...sprites.map(sprite => loadImage(sprite.image))
    ]);

    let titleX = border + pad;
    if (logo) {
      const size = 50;
      ctx.drawImage(logo, titleX, border + (headerH - size) / 2, size, size);
      titleX += size + 14;
    }

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    fitText(ctx, `SPRITE VAULT · ${config.title}`, canvas.width - titleX - pad - border, 28, 14, 900);
    ctx.fillText(`SPRITE VAULT · ${config.title}`, titleX, border + 34);

    const owned = SPRITES.filter(sprite => getProgress(sprite).owned).length;
    const mastered = SPRITES.filter(sprite => getProgress(sprite).mastered).length;
    ctx.fillStyle = "rgba(221,231,250,.72)";
    ctx.font = "600 13px Inter, Arial, sans-serif";
    ctx.fillText(`${sprites.length} en esta imagen · ${owned}/${SPRITES.length} en colección · ${mastered} dominados`, titleX, border + 62);

    sprites.forEach((sprite, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = border + pad + col * (cardW + gap) + Math.max(0, (canvas.width - border * 2 - pad * 2 - contentW) / 2);
      const y = border + headerH + pad + row * (cardH + gap);
      drawCard(ctx, sprite, images[index], x, y, cardW, cardH, mode);
    });

    const footerY = canvas.height - border - footerH;
    ctx.fillStyle = "#0d1119";
    ctx.fillRect(border, footerY, canvas.width - border * 2, footerH);
    ctx.fillStyle = "#f4f7ff";
    ctx.font = "800 16px Oswald, Arial Narrow, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("discord.gg/ZrneTN3DRr", canvas.width / 2, footerY + footerH / 2);

    return { canvas, title: config.title };
  }

  function writePreviewPage(previewWindow, imageUrl, title, width) {
    previewWindow.document.open();
    previewWindow.document.write(`<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5,user-scalable=yes">
  <meta name="theme-color" content="#05070d">
  <title>${title} | Sprite Vault</title>
  <style>
    *{box-sizing:border-box}html,body{margin:0;min-height:100%;background:#05070d;color:#fff;font-family:Arial,sans-serif}
    body{display:flex;justify-content:center;align-items:flex-start;padding:0;overflow-x:auto}
    img{display:block;width:min(100%,${width}px);height:auto;margin:0 auto}
  </style>
</head>
<body><img src="${imageUrl}" alt="${title}"></body>
</html>`);
    previewWindow.document.close();
  }

  async function openSharePng(mode, button) {
    const previewWindow = window.open("", "_blank");
    if (!previewWindow) {
      alert("Permite las ventanas emergentes para abrir la imagen PNG en una página nueva.");
      return;
    }

    previewWindow.document.write("<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Generando · Sprite Vault</title><style>html,body{margin:0;min-height:100%;background:#05070d;color:#dce7ff;font:600 16px Arial,sans-serif;display:grid;place-items:center}</style></head><body>Generando imagen PNG…</body></html>");
    previewWindow.document.close();

    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Generando…";

    try {
      const result = await buildShareCanvas(mode);
      if (!result) {
        previewWindow.close();
        return;
      }

      const blob = await new Promise(resolve => result.canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("PNG blob creation failed");

      const imageUrl = URL.createObjectURL(blob);
      writePreviewPage(previewWindow, imageUrl, result.title, result.canvas.width);
      previewWindow.addEventListener("beforeunload", () => URL.revokeObjectURL(imageUrl), { once: true });
    } catch (error) {
      console.error("Sprite Vault PNG export failed:", error);
      if (!previewWindow.closed) previewWindow.close();
      alert("No se pudo crear la imagen PNG. Inténtalo otra vez.");
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  }
})();
