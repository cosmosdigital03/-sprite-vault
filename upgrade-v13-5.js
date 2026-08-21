/* Sprite Vault V13.5 — direct-canvas Override trade card + subtle system UI */
(() => {
  "use strict";

  const CURRENT_SEASON = "Override";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  let previewUrl = null;

  const VARIANTS = [
    { theme: "Básico", label: "NORMAL", accent: "#55dfff", top: "#12344a", bottom: "#07131f" },
    { theme: "Dorado", label: "GOLD", accent: "#ffd45a", top: "#514111", bottom: "#191306" },
    { theme: "Cheat Master", label: "CHEAT", accent: "#61ff9b", top: "#0d3c22", bottom: "#04140b" }
  ];

  function overrideSprites() {
    return typeof SPRITES === "undefined"
      ? []
      : SPRITES.filter(sprite => (sprite.season || "Runners") === CURRENT_SEASON);
  }

  function baseKey(sprite) {
    return sprite.id.replace(/_(basic|gold|cheat)$/i, "");
  }

  function baseLabel(group) {
    const basic = group.find(sprite => sprite.theme === "Básico") || group[0];
    return (basic?.name || "Sprite")
      .replace(/^Gold\s+/i, "")
      .replace(/^Cheat Master\s+/i, "")
      .trim();
  }

  function groupedOverrideSprites() {
    const groups = new Map();
    for (const sprite of overrideSprites()) {
      const key = baseKey(sprite);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(sprite);
    }
    return [...groups.values()];
  }

  function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function fitText(ctx, text, maxWidth, start, min = 10, weight = 800, family = "Inter, Arial, sans-serif") {
    let size = start;
    do {
      ctx.font = `${weight} ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 1;
    } while (size > min);
    return size;
  }

  function loadImage(src) {
    return new Promise(resolve => {
      const image = new Image();
      if (/^https?:\/\//i.test(src)) {
        image.crossOrigin = "anonymous";
        image.referrerPolicy = "no-referrer";
      }
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });
  }

  function drawNoEntry(ctx, cx, cy, radius = 10) {
    ctx.save();
    ctx.strokeStyle = "#ff5d73";
    ctx.lineWidth = Math.max(2, radius * .22);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - radius * .62, cy - radius * .62);
    ctx.lineTo(cx + radius * .62, cy + radius * .62);
    ctx.stroke();
    ctx.restore();
  }

  function drawGridBackground(ctx, width, height) {
    ctx.fillStyle = "#05080d";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.strokeStyle = "rgba(80,255,153,.045)";
    ctx.lineWidth = 1;
    const step = 36;
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    ctx.fillStyle = "rgba(92,255,160,.055)";
    ctx.font = "700 9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    const snippets = ["0101", "SV::OVERRIDE", "1010", "INDEX_OK", "0011", "VAULT_SYNC"];
    for (let i = 0; i < 42; i++) {
      const x = 24 + ((i * 173) % Math.max(40, width - 100));
      const y = 90 + ((i * 97) % Math.max(120, height - 140));
      ctx.fillText(snippets[i % snippets.length], x, y);
    }
    ctx.restore();
  }

  function drawHeader(ctx, width, stats) {
    const accent = "#c9ff34";
    ctx.fillStyle = "rgba(10,14,21,.96)";
    ctx.fillRect(0, 0, width, 114);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, width, 4);

    ctx.fillStyle = accent;
    ctx.font = "900 27px Oswald, Arial Narrow, sans-serif";
    ctx.fillText("SPRITE VAULT // OVERRIDE TRADE CARD", 26, 39);

    ctx.fillStyle = "#8ca0ad";
    ctx.font = "700 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.fillText("vault://season/override   status: live_index   layout: collection_matrix", 28, 61);

    const labels = [
      ["COLECCIÓN", `${stats.owned}/${stats.total}`, "#61ff9b"],
      ["DOMINIO", `${stats.mastered}/${stats.total}`, "#55dfff"]
    ];

    let x = width - 28;
    ctx.textAlign = "right";
    for (let i = labels.length - 1; i >= 0; i--) {
      const [label, value, color] = labels[i];
      ctx.fillStyle = color;
      ctx.font = "900 17px Oswald, Arial Narrow, sans-serif";
      ctx.fillText(value, x, 36);
      ctx.fillStyle = "#7d8e99";
      ctx.font = "800 8px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillText(label, x, 51);
      x -= 98;
    }
    ctx.textAlign = "left";

    ctx.strokeStyle = "rgba(201,255,52,.72)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 82);
    ctx.lineTo(width - 24, 82);
    ctx.stroke();

    const labelW = 180;
    const gutter = 12;
    const cardW = Math.floor((width - 48 - labelW - gutter * 3) / 3);
    const startX = 24 + labelW + gutter;

    ctx.fillStyle = "#78909c";
    ctx.font = "900 9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.fillText("SPRITE", 28, 104);

    VARIANTS.forEach((variant, index) => {
      const xCol = startX + index * (cardW + gutter);
      ctx.fillStyle = variant.accent;
      ctx.fillText(variant.label, xCol + 4, 104);
    });
  }

  function drawCell(ctx, sprite, image, progress, variant, x, y, w, h) {
    const owned = Boolean(progress?.owned);
    const mastered = Boolean(progress?.mastered);
    const goldLocked = sprite.theme === "Dorado";

    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, variant.top);
    grad.addColorStop(1, variant.bottom);
    ctx.fillStyle = grad;
    roundRect(ctx, x, y, w, h, 10);
    ctx.fill();

    ctx.save();
    roundRect(ctx, x, y, w, h, 10);
    ctx.clip();

    // Subtle code texture, stronger for Cheat Master only.
    ctx.fillStyle = sprite.theme === "Cheat Master"
      ? "rgba(97,255,155,.14)"
      : "rgba(255,255,255,.035)";
    ctx.font = "700 7px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    const code = sprite.theme === "Cheat Master" ? "0101 1010 0011" : "SV // INDEX";
    ctx.fillText(code, x + 8, y + 12);
    if (sprite.theme === "Cheat Master") ctx.fillText("1010 0110 1101", x + w - 84, y + 25);

    const imageAreaH = h - 30;
    if (image && image.naturalWidth) {
      const maxW = w * .78;
      const maxH = imageAreaH * .78;
      const ratio = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight);
      const dw = image.naturalWidth * ratio;
      const dh = image.naturalHeight * ratio;
      ctx.globalAlpha = owned ? 1 : .42;
      ctx.drawImage(image, x + (w - dw) / 2, y + 17 + (imageAreaH - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    }

    if (!owned) {
      ctx.fillStyle = "rgba(1,4,8,.34)";
      ctx.fillRect(x, y, w, imageAreaH);
    }

    ctx.fillStyle = "rgba(4,8,14,.93)";
    ctx.fillRect(x, y + h - 30, w, 30);

    const displayName = sprite.name
      .replace(/^Gold\s+/i, "")
      .replace(/^Cheat Master\s+/i, "")
      .toUpperCase();
    ctx.fillStyle = owned ? "#f5fbff" : "#87939c";
    fitText(ctx, displayName, w - 16, 12, 7, 900, "Oswald, Arial Narrow, sans-serif");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayName, x + w / 2, y + h - 15);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    // Status chip.
    const chipY = y + 7;
    if (goldLocked) {
      drawNoEntry(ctx, x + 16, chipY + 8, 7);
      ctx.fillStyle = "#ffd7a0";
      ctx.font = "900 8px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillText("22 AGO", x + 29, chipY + 11);
    } else {
      ctx.fillStyle = owned ? "#61ff9b" : "#ff5d73";
      ctx.font = "900 8px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillText(owned ? "TENGO" : "FALTA", x + 8, chipY + 10);
    }

    if (mastered) {
      ctx.fillStyle = "#ffd45a";
      ctx.font = "900 16px Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("★", x + w - 8, y + 18);
      ctx.textAlign = "left";
    }

    ctx.restore();

    ctx.strokeStyle = owned ? variant.accent : "rgba(255,93,115,.46)";
    ctx.lineWidth = owned ? 1.5 : 1;
    roundRect(ctx, x + .5, y + .5, w - 1, h - 1, 10);
    ctx.stroke();
  }

  async function buildTradeCardCanvas() {
    const groups = groupedOverrideSprites();
    const sprites = overrideSprites();
    const progress = typeof state !== "undefined" ? state.progress : {};
    const owned = sprites.filter(sprite => progress?.[sprite.id]?.owned).length;
    const mastered = sprites.filter(sprite => progress?.[sprite.id]?.mastered).length;

    const width = 1200;
    const headerH = 114;
    const rowH = 142;
    const rowGap = 10;
    const footerH = 58;
    const top = 126;
    const height = top + groups.length * (rowH + rowGap) + footerH + 18;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: false });

    drawGridBackground(ctx, width, height);
    drawHeader(ctx, width, { owned, mastered, total: sprites.length });

    const labelW = 180;
    const gutter = 12;
    const cardW = Math.floor((width - 48 - labelW - gutter * 3) / 3);
    const startX = 24 + labelW + gutter;

    const allImages = await Promise.all(
      groups.flatMap(group => VARIANTS.map(variant => {
        const sprite = group.find(item => item.theme === variant.theme);
        return sprite ? loadImage(sprite.image) : Promise.resolve(null);
      }))
    );

    let imageIndex = 0;
    groups.forEach((group, row) => {
      const y = top + row * (rowH + rowGap);
      const label = baseLabel(group);

      ctx.fillStyle = "rgba(8,12,18,.86)";
      roundRect(ctx, 24, y, labelW, rowH, 10);
      ctx.fill();
      ctx.strokeStyle = "rgba(104,231,255,.13)";
      ctx.lineWidth = 1;
      roundRect(ctx, 24.5, y + .5, labelW - 1, rowH - 1, 10);
      ctx.stroke();

      ctx.fillStyle = "#f5fbff";
      fitText(ctx, label.toUpperCase(), labelW - 24, 18, 11, 900, "Oswald, Arial Narrow, sans-serif");
      ctx.fillText(label.toUpperCase(), 36, y + 38);
      ctx.fillStyle = "#5ef29e";
      ctx.font = "800 8px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillText(`ID://${baseKey(group[0]).toUpperCase()}`, 36, y + 57);
      ctx.fillStyle = "rgba(98,255,157,.055)";
      ctx.font = "700 8px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.fillText("010101  INDEX", 36, y + rowH - 17);

      VARIANTS.forEach((variant, col) => {
        const sprite = group.find(item => item.theme === variant.theme);
        const image = allImages[imageIndex++];
        const x = startX + col * (cardW + gutter);
        if (sprite) {
          drawCell(ctx, sprite, image, progress?.[sprite.id], variant, x, y, cardW, rowH);
        } else {
          ctx.strokeStyle = "rgba(255,255,255,.08)";
          ctx.setLineDash([4, 5]);
          roundRect(ctx, x + .5, y + .5, cardW - 1, rowH - 1, 10);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = "rgba(255,255,255,.18)";
          ctx.font = "800 10px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.fillText("NO DATA", x + cardW / 2, y + rowH / 2);
          ctx.textAlign = "left";
        }
      });
    });

    const footerY = height - footerH;
    ctx.fillStyle = "rgba(7,10,15,.96)";
    ctx.fillRect(0, footerY, width, footerH);
    ctx.strokeStyle = "rgba(97,255,155,.25)";
    ctx.beginPath(); ctx.moveTo(24, footerY); ctx.lineTo(width - 24, footerY); ctx.stroke();
    ctx.fillStyle = "#70858f";
    ctx.font = "800 9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.fillText("SPRITE VAULT // override.collection.matrix", 28, footerY + 25);
    ctx.textAlign = "right";
    ctx.fillStyle = "#61ff9b";
    ctx.fillText("discord.gg/ZrneTN3DRr", width - 28, footerY + 25);
    ctx.textAlign = "left";

    return canvas;
  }

  function ensurePreviewPage() {
    let page = $("#svTradeCardPreview");
    if (page) return page;

    page = document.createElement("section");
    page.id = "svTradeCardPreview";
    page.className = "sv-trade-preview";
    page.hidden = true;
    page.innerHTML = `
      <header class="sv-trade-preview-toolbar">
        <button class="sv-trade-preview-back" type="button">← Volver</button>
        <div>
          <strong>Override Trade Card</strong>
          <span>PNG generado directamente · mantén presionada la imagen para guardarla en móvil</span>
        </div>
        <span class="sv-trade-preview-status"><i></i> PNG READY</span>
      </header>
      <main class="sv-trade-preview-body">
        <div class="sv-trade-preview-loading">Compilando trade card…</div>
        <img class="sv-trade-preview-image" alt="Sprite Vault Override Trade Card" hidden />
      </main>`;

    document.body.append(page);
    $(".sv-trade-preview-back", page).addEventListener("click", closePreviewPage);
    return page;
  }

  function openPreviewPage() {
    const page = ensurePreviewPage();
    const image = $(".sv-trade-preview-image", page);
    const loading = $(".sv-trade-preview-loading", page);
    loading.textContent = "Compilando trade card…";
    loading.hidden = false;
    image.hidden = true;
    image.removeAttribute("src");
    page.hidden = false;
    document.body.classList.add("sv-trade-preview-open");
    page.scrollTop = 0;
  }

  function closePreviewPage() {
    const page = $("#svTradeCardPreview");
    if (!page) return;
    page.hidden = true;
    document.body.classList.remove("sv-trade-preview-open");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }
  }

  async function generateTradeCard(button) {
    openPreviewPage();
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Generando…";

    try {
      await document.fonts?.ready;
      const canvas = await buildTradeCardCanvas();
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png", 1));
      if (!blob) throw new Error("PNG generation failed");

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = URL.createObjectURL(blob);
      const page = ensurePreviewPage();
      const image = $(".sv-trade-preview-image", page);
      image.onload = () => {
        $(".sv-trade-preview-loading", page).hidden = true;
        image.hidden = false;
        page.scrollTop = 0;
      };
      image.src = previewUrl;
    } catch (error) {
      console.error("Sprite Vault V13.5 trade card error:", error);
      const page = ensurePreviewPage();
      const loading = $(".sv-trade-preview-loading", page);
      loading.hidden = false;
      loading.textContent = "No se pudo generar el PNG. Toca Capturar imagen para intentarlo otra vez.";
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  }

  function replaceCaptureButton() {
    const oldButton = $(".sv-generate-capture");
    if (!oldButton || oldButton.dataset.svTradeCard === "1") return;

    const button = oldButton.cloneNode(true);
    button.dataset.svTradeCard = "1";
    button.textContent = "Capturar imagen";
    oldButton.replaceWith(button);
    button.addEventListener("click", () => generateTradeCard(button));
  }

  function addSystemStatus() {
    if ($(".sv-system-status")) return;
    const brand = $(".brand");
    if (!brand) return;
    const status = document.createElement("span");
    status.className = "sv-system-status";
    status.innerHTML = "<i></i><span>SYSTEM ONLINE</span>";
    brand.insertAdjacentElement("afterend", status);
  }

  function applySystemClass() {
    document.body.classList.add("sv-system-ui");
  }

  function init() {
    applySystemClass();
    addSystemStatus();
    replaceCaptureButton();

    // Capture toolbar is created dynamically in some flows.
    const capturePage = $("#capturePage");
    if (capturePage) {
      new MutationObserver(replaceCaptureButton).observe(capturePage, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
