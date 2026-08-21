/* Sprite Vault V13 — easier navigation, Cheat Master Matrix visuals, real PNG capture */
(() => {
  "use strict";

  const MATRIX_TEXT = [
    "01001101", "11001010", "00110111", "10100101", "01101001", "10011010",
    "00101101", "11100010", "01011011", "10110100", "00011101", "11010110"
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  document.body.classList.add("sv-v13");

  function spriteForCard(card) {
    if (!card?.dataset?.id || typeof SPRITES === "undefined") return null;
    return SPRITES.find(sprite => sprite.id === card.dataset.id) || null;
  }

  function isCheatSprite(sprite) {
    return Boolean(sprite && (sprite.theme === "Cheat Master" || /_cheat$/i.test(sprite.id)));
  }

  function addMatrixRain(target) {
    if (!target || $(":scope > .matrix-rain", target)) return;
    const rain = document.createElement("div");
    rain.className = "matrix-rain";
    rain.setAttribute("aria-hidden", "true");

    MATRIX_TEXT.forEach((text, index) => {
      const stream = document.createElement("span");
      stream.textContent = `${text}${text.split("").reverse().join("")}${text}`;
      stream.style.setProperty("--matrix-speed", `${3.1 + (index % 5) * .62}s`);
      stream.style.setProperty("--matrix-delay", `${-0.38 * index}s`);
      rain.append(stream);
    });

    target.prepend(rain);
  }

  function decorateCheatCards(root = document) {
    $$(".sprite-card", root).forEach(card => {
      const sprite = spriteForCard(card);
      if (!isCheatSprite(sprite)) return;
      card.classList.add("cheat-master-card");
      addMatrixRain($(".sprite-visual", card));
    });
  }

  function decorateCheatDetail() {
    const visual = $("#detailVisual");
    const theme = $("#detailTheme")?.textContent?.trim();
    if (!visual) return;
    const isCheat = theme === "Cheat Master";
    visual.classList.toggle("cheat-master-detail", isCheat);
    if (isCheat) addMatrixRain(visual);
    else $(":scope > .matrix-rain", visual)?.remove();
  }

  function observeDynamicCards() {
    const container = $("#spriteContainer");
    if (container) {
      new MutationObserver(() => decorateCheatCards(container)).observe(container, {
        childList: true,
        subtree: true
      });
      decorateCheatCards(container);
    }

    const detailTheme = $("#detailTheme");
    if (detailTheme) {
      new MutationObserver(decorateCheatDetail).observe(detailTheme, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  function clickStatus(status) {
    const button = $(`#statusFilters button[data-status="${status}"]`);
    button?.click();
  }

  function selectTheme(theme) {
    const select = $("#themeSelect");
    if (!select) return;
    select.value = theme;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function resetToAll() {
    const reset = $("#resetFilters");
    if (reset) reset.click();
    else {
      clickStatus("all");
      selectTheme("all");
    }
  }

  function createCommandBar() {
    if ($(".vault-command-bar")) return;

    const progress = $(".progress-overview");
    const controls = $(".control-panel");
    if (!controls) return;

    const bar = document.createElement("section");
    bar.className = "vault-command-bar";
    bar.setAttribute("aria-label", "Accesos rápidos del Vault");
    bar.innerHTML = `
      <div class="vault-command-copy">
        <div class="vault-command-icon">&lt;/&gt;</div>
        <div>
          <strong>Accesos rápidos</strong>
          <span>Encuentra, filtra y comparte tu colección sin perderte entre menús.</span>
        </div>
      </div>
      <div class="vault-command-actions">
        <button type="button" data-quick="all">Todos</button>
        <button type="button" data-quick="new">Nuevos</button>
        <button type="button" data-quick="owned">Tengo</button>
        <button type="button" data-quick="missing">Me faltan</button>
        <button type="button" data-quick="cheat">&gt; Cheat</button>
        <button type="button" class="vault-filter-toggle" data-quick="filters">Filtros</button>
        <button type="button" class="vault-command-primary" data-quick="capture">Capturas</button>
      </div>`;

    if (progress) progress.insertAdjacentElement("afterend", bar);
    else controls.insertAdjacentElement("beforebegin", bar);
    bar.insertAdjacentElement("afterend", controls);

    bar.addEventListener("click", event => {
      const button = event.target.closest("button[data-quick]");
      if (!button) return;
      const action = button.dataset.quick;

      if (action === "all") resetToAll();
      if (action === "new") { selectTheme("all"); clickStatus("new"); }
      if (action === "owned") { selectTheme("all"); clickStatus("owned"); }
      if (action === "missing") { selectTheme("all"); clickStatus("missing"); }
      if (action === "cheat") { clickStatus("all"); selectTheme("Cheat Master"); }
      if (action === "capture") $("#shareButton")?.click();
      if (action === "filters") {
        controls.classList.toggle("sv-filters-open");
        button.textContent = controls.classList.contains("sv-filters-open") ? "Ocultar filtros" : "Filtros";
      }
    });
  }

  function moveSecondaryDiscordPanel() {
    const panel = $("#discordRolePanel");
    const container = $("#spriteContainer");
    const empty = $("#emptyState");
    if (!panel || !container) return;
    panel.classList.add("sv-secondary-panel");
    (empty || container).insertAdjacentElement("afterend", panel);
  }

  function addCaptureActionButtons() {
    const toolbar = $(".capture-toolbar");
    if (!toolbar || $(".sv-capture-actions", toolbar)) return;

    const actions = document.createElement("div");
    actions.className = "sv-capture-actions";
    actions.innerHTML = `
      <button class="sv-save-capture" type="button">Guardar PNG</button>
      <button class="sv-share-capture" type="button">Compartir imagen</button>`;
    toolbar.append(actions);

    $(".sv-save-capture", actions).addEventListener("click", event => exportCapture(false, event.currentTarget));
    $(".sv-share-capture", actions).addEventListener("click", event => exportCapture(true, event.currentTarget));
  }

  let html2canvasPromise = null;
  function ensureHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (html2canvasPromise) return html2canvasPromise;

    html2canvasPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      script.crossOrigin = "anonymous";
      script.onload = () => resolve(window.html2canvas);
      script.onerror = () => reject(new Error("No se pudo cargar el generador de capturas."));
      document.head.append(script);
    });
    return html2canvasPromise;
  }

  async function waitForImages(root) {
    const images = $$("img", root);
    await Promise.all(images.map(async image => {
      if (image.complete && image.naturalWidth) return;
      try {
        if (image.decode) await image.decode();
        else await new Promise(resolve => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      } catch (_) {}
    }));
  }

  function captureToast(message) {
    let toast = $(".sv-capture-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "sv-capture-toast";
      document.body.append(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(captureToast.timer);
    captureToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2500);
  }

  async function shareBlob(blob, filename) {
    const file = new File([blob], filename, { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Sprite Vault",
        text: "Mi colección de Sprites"
      });
      return true;
    }
    return false;
  }

  async function exportCapture(wantsShare, button) {
    const sheet = $("#captureSheet");
    if (!sheet) return;

    const oldText = button.textContent;
    button.disabled = true;
    button.textContent = "Preparando...";

    try {
      // On phones, compact matrix mode prevents browser canvas-height limits.
      if (window.matchMedia("(max-width: 760px)").matches && typeof state !== "undefined" && typeof renderCaptureView === "function") {
        state.captureView = "screenshot";
        $$("#captureViewButtons button[data-capture-view]").forEach(item => {
          item.classList.toggle("active", item.dataset.captureView === "screenshot");
        });
        renderCaptureView();
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }

      await document.fonts?.ready;
      await waitForImages(sheet);
      const renderer = await ensureHtml2Canvas();
      button.textContent = "Generando...";

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
      if (!blob) throw new Error("No se pudo crear el archivo PNG.");

      const stamp = new Date().toISOString().slice(0, 10);
      const filename = `sprite-vault-${stamp}.png`;

      if (wantsShare) {
        const shared = await shareBlob(blob, filename).catch(error => {
          if (error?.name !== "AbortError") console.warn(error);
          return error?.name === "AbortError" ? true : false;
        });
        if (!shared) {
          downloadBlob(blob, filename);
          captureToast("Tu navegador no admite compartir archivos; descargué el PNG.");
        }
      } else {
        downloadBlob(blob, filename);
        captureToast("PNG generado correctamente.");
      }
    } catch (error) {
      console.error("Sprite Vault capture error:", error);
      captureToast("No se pudo generar la imagen. Prueba otra vez con la vista Screenshot.");
    } finally {
      button.disabled = false;
      button.textContent = oldText;
    }
  }

  function enhanceCapturePalette() {
    if (typeof getCaptureExportPalette !== "function" || getCaptureExportPalette.__sv13) return;
    const previous = getCaptureExportPalette;
    const upgraded = function(sprite) {
      if (isCheatSprite(sprite)) {
        return {
          top: "#073017",
          bottom: "#020a05",
          border: "#55ff91",
          badge: "#0b572b",
          badgeText: "#9cffbd",
          special: false
        };
      }
      return previous(sprite);
    };
    upgraded.__sv13 = true;
    getCaptureExportPalette = upgraded;
  }

  function init() {
    createCommandBar();
    moveSecondaryDiscordPanel();
    addCaptureActionButtons();
    observeDynamicCards();
    decorateCheatCards();
    decorateCheatDetail();
    enhanceCapturePalette();

    window.addEventListener("spritevault:collectionchange", () => {
      requestAnimationFrame(() => decorateCheatCards());
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
