/* Sprite Vault V13.3 — season switch + split Override capture + generated image preview */
(() => {
  "use strict";

  const CURRENT = "Override";
  const PREVIOUS = "Runners";
  const SEASON_KEY = "spriteVaultSeasonV1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  let captureRendererPromise = null;
  let generatedPreviewUrl = null;

  function setSeason(season, reset = false) {
    if (typeof state === "undefined" || typeof render !== "function") return;
    state.season = season === PREVIOUS ? PREVIOUS : CURRENT;
    localStorage.setItem(SEASON_KEY, state.season);

    if (reset) {
      state.search = "";
      state.status = "all";
      state.theme = "all";
      const search = $("#searchInput");
      const theme = $("#themeSelect");
      if (search) search.value = "";
      if (theme) theme.value = "all";
      $$("#statusFilters button[data-status]").forEach(button => {
        button.classList.toggle("active", button.dataset.status === "all");
      });
    }

    $$("#seasonFilters [data-season]").forEach(button => {
      button.classList.toggle("active", button.dataset.season === state.season);
    });

    updateSeasonButton();
    render();
  }

  function updateSeasonButton() {
    const button = $(".vault-season-switch");
    if (!button || typeof state === "undefined") return;
    const runners = state.season === PREVIOUS;
    button.textContent = runners ? "Versión Override" : "Versión Runners";
    button.title = runners ? "Volver a Override" : "Ver la temporada anterior Runners";
  }

  function patchCommandBar() {
    const actions = $(".vault-command-actions");
    if (!actions) return;

    actions.querySelector("[data-quick='cheat']")?.remove();

    if (!actions.querySelector(".vault-season-switch")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "vault-season-switch";
      button.addEventListener("click", event => {
        event.stopPropagation();
        const next = state.season === PREVIOUS ? CURRENT : PREVIOUS;
        setSeason(next, true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      const capture = actions.querySelector("[data-quick='capture']");
      actions.insertBefore(button, capture || null);
    }

    updateSeasonButton();
  }

  function overrideSprites() {
    return SPRITES.filter(sprite => (sprite.season || PREVIOUS) === CURRENT);
  }

  function makeTile(sprite) {
    const progress = state.progress[sprite.id] || {};
    const tile = document.createElement("article");
    tile.className = [
      "sv-split-tile",
      progress.owned ? "owned" : "missing",
      progress.mastered ? "mastered" : "",
      sprite.theme === "Cheat Master" || /_cheat$/i.test(sprite.id) ? "cheat" : ""
    ].filter(Boolean).join(" ");

    if (typeof applyThemeVisuals === "function") applyThemeVisuals(tile, sprite.theme);

    const visual = document.createElement("div");
    visual.className = "sv-split-tile-visual";
    const image = document.createElement("img");
    if (/^https?:\/\//i.test(sprite.image)) {
      image.crossOrigin = "anonymous";
      image.referrerPolicy = "no-referrer";
    }
    image.src = sprite.image;
    image.alt = sprite.name;
    image.loading = "eager";
    image.decoding = "async";
    visual.append(image);

    if (progress.mastered) {
      const crown = document.createElement("span");
      crown.className = "sv-split-mastered";
      crown.textContent = "♛";
      visual.append(crown);
    }

    const name = document.createElement("strong");
    name.textContent = sprite.name.replace(/^Cheat Master\s+/i, "");
    name.title = sprite.name;
    tile.append(visual, name);
    return tile;
  }

  function makeColumn(title, sprites, kind) {
    const column = document.createElement("section");
    column.className = `sv-split-column ${kind}`;

    const header = document.createElement("header");
    header.innerHTML = `<div><span>OVERRIDE</span><strong>${title}</strong></div><b>${sprites.length}</b>`;

    const grid = document.createElement("div");
    grid.className = "sv-split-grid";

    if (sprites.length) {
      sprites.forEach(sprite => grid.append(makeTile(sprite)));
    } else {
      const empty = document.createElement("p");
      empty.className = "sv-split-empty";
      empty.textContent = kind === "owned"
        ? "Todavía no has marcado Sprites de Override."
        : "¡Tienes todos los Sprites de Override!";
      grid.append(empty);
    }

    column.append(header, grid);
    return column;
  }

  function renderSplitCapture() {
    const sprites = overrideSprites();
    const owned = sprites.filter(sprite => state.progress[sprite.id]?.owned);
    const missing = sprites.filter(sprite => !state.progress[sprite.id]?.owned);
    const mastered = sprites.filter(sprite => state.progress[sprite.id]?.mastered).length;
    const percent = sprites.length ? Math.round(owned.length / sprites.length * 100) : 0;

    elements.captureOwned.textContent = owned.length;
    elements.captureMissing.textContent = missing.length;
    elements.captureMastered.textContent = mastered;
    elements.capturePercent.textContent = `${percent}%`;
    elements.captureTitle.textContent = "Override · Mi colección";
    elements.captureResultCount.textContent = `${sprites.length} Sprites`;

    elements.capturePage.classList.remove("is-screenshot-mode");
    elements.captureSheet.classList.remove("is-screenshot");
    elements.captureGrid.className = "capture-grid sv-split-capture";
    elements.captureGrid.innerHTML = "";

    const split = document.createElement("div");
    split.className = "sv-split-wrap";
    split.append(
      makeColumn("Los tengo", owned, "owned"),
      makeColumn("No tengo", missing, "missing")
    );
    elements.captureGrid.append(split);

    if (elements.captureTip) {
      elements.captureTip.textContent = "Solo Override · Los tengo y No tengo aparecen juntos en la misma captura.";
    }
  }

  function ensureCaptureRenderer() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (captureRendererPromise) return captureRendererPromise;

    captureRendererPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      script.crossOrigin = "anonymous";
      script.onload = () => resolve(window.html2canvas);
      script.onerror = () => reject(new Error("No se pudo cargar el generador de imagen."));
      document.head.append(script);
    });
    return captureRendererPromise;
  }

  async function waitForCaptureImages(root) {
    const images = $$("img", root);
    await Promise.all(images.map(image => new Promise(resolve => {
      if (image.complete) {
        resolve();
        return;
      }
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    })));
  }

  function ensureGeneratedPreview() {
    let preview = $("#svGeneratedCapturePage");
    if (preview) return preview;

    preview = document.createElement("section");
    preview.id = "svGeneratedCapturePage";
    preview.className = "sv-generated-capture-page";
    preview.hidden = true;
    preview.innerHTML = `
      <header class="sv-generated-capture-toolbar">
        <button type="button" class="sv-generated-back">← Volver</button>
        <div>
          <strong>Captura Override</strong>
          <span>Imagen creada desde tu colección actual</span>
        </div>
      </header>
      <main class="sv-generated-capture-body">
        <div class="sv-generated-loading">Generando imagen…</div>
        <img class="sv-generated-image" alt="Captura de colección Override" hidden>
      </main>`;

    document.body.append(preview);
    $(".sv-generated-back", preview).addEventListener("click", closeGeneratedPreview);
    return preview;
  }

  function openGeneratedPreview() {
    const preview = ensureGeneratedPreview();
    const image = $(".sv-generated-image", preview);
    $(".sv-generated-loading", preview).hidden = false;
    image.hidden = true;
    image.removeAttribute("src");
    preview.hidden = false;
    document.body.classList.add("sv-generated-capture-open");
    preview.scrollTop = 0;
  }

  function closeGeneratedPreview() {
    const preview = $("#svGeneratedCapturePage");
    if (!preview) return;
    preview.hidden = true;
    document.body.classList.remove("sv-generated-capture-open");
    if (generatedPreviewUrl) {
      URL.revokeObjectURL(generatedPreviewUrl);
      generatedPreviewUrl = null;
    }
    const image = $(".sv-generated-image", preview);
    image.removeAttribute("src");
    image.hidden = true;
  }

  async function generateCaptureImage(button) {
    const sheet = $("#captureSheet");
    if (!sheet) return;

    renderSplitCapture();
    openGeneratedPreview();

    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Generando…";

    try {
      await document.fonts?.ready;
      await waitForCaptureImages(sheet);
      const renderer = await ensureCaptureRenderer();
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const width = Math.ceil(sheet.scrollWidth);
      const height = Math.ceil(sheet.scrollHeight);
      const deviceScale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      const scale = height * deviceScale > 15000 ? Math.max(1, 15000 / height) : deviceScale;

      const canvas = await renderer(sheet, {
        backgroundColor: "#080b14",
        scale,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width,
        height,
        windowWidth: Math.max(document.documentElement.clientWidth, width),
        windowHeight: Math.max(document.documentElement.clientHeight, height),
        scrollX: 0,
        scrollY: 0
      });

      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png", 1));
      if (!blob) throw new Error("No se pudo crear la imagen PNG.");

      if (generatedPreviewUrl) URL.revokeObjectURL(generatedPreviewUrl);
      generatedPreviewUrl = URL.createObjectURL(blob);

      const preview = ensureGeneratedPreview();
      const image = $(".sv-generated-image", preview);
      image.onload = () => {
        $(".sv-generated-loading", preview).hidden = true;
        image.hidden = false;
        preview.scrollTop = 0;
      };
      image.src = generatedPreviewUrl;
    } catch (error) {
      console.error("Sprite Vault generated capture error:", error);
      const preview = ensureGeneratedPreview();
      const loading = $(".sv-generated-loading", preview);
      loading.hidden = false;
      loading.textContent = "No se pudo crear la imagen. Inténtalo nuevamente.";
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  }

  function patchCapture() {
    $(".sv-capture-actions")?.remove();
    const buttons = $("#captureViewButtons");
    if (buttons) buttons.hidden = true;

    const copy = $(".capture-toolbar-copy");
    if (copy) {
      copy.innerHTML = "<strong>Captura Override</strong><span>Los tengo y No tengo, juntos y divididos en la misma vista.</span>";
    }

    const toolbar = $(".capture-toolbar");
    if (toolbar && !$(".sv-generate-capture", toolbar)) {
      const captureButton = document.createElement("button");
      captureButton.type = "button";
      captureButton.className = "sv-generate-capture";
      captureButton.textContent = "Capturar imagen";
      captureButton.addEventListener("click", () => generateCaptureImage(captureButton));
      toolbar.append(captureButton);
    }

    if (typeof renderCaptureView === "function") {
      renderCaptureView = renderSplitCapture;
    }
  }

  function preserveSeasonOnReset() {
    const reset = $("#resetFilters");
    if (!reset) return;
    reset.addEventListener("click", () => {
      const season = state.season === PREVIOUS ? PREVIOUS : CURRENT;
      window.setTimeout(() => {
        if (state.season !== season) setSeason(season);
      }, 0);
    }, true);
  }

  function init() {
    if (typeof state === "undefined" || typeof render !== "function") return;

    // Main tracker opens on Override. Ownership/mastery storage is never reset.
    state.season = CURRENT;
    localStorage.setItem(SEASON_KEY, CURRENT);

    patchCommandBar();
    patchCapture();
    preserveSeasonOnReset();
    render();
    updateSeasonButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
