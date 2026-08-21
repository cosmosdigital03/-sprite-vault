/* Sprite Vault V13.2 — requested cleanup: season button + split Override capture */
(() => {
  "use strict";

  const CURRENT = "Override";
  const PREVIOUS = "Runners";
  const SEASON_KEY = "spriteVaultSeasonV1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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

  function patchCapture() {
    $(".sv-capture-actions")?.remove();
    const buttons = $("#captureViewButtons");
    if (buttons) buttons.hidden = true;

    const copy = $(".capture-toolbar-copy");
    if (copy) {
      copy.innerHTML = "<strong>Captura Override</strong><span>Los tengo y No tengo, juntos y divididos en la misma vista.</span>";
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

    // Always open the main tracker on the current season. Saved ownership/mastery is untouched.
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
