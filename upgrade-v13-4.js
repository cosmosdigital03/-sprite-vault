/* Sprite Vault V13.4 — Override Gold release treatment */
(() => {
  "use strict";

  const CURRENT_SEASON = "Override";
  const GOLD_THEME = "Dorado";
  const RELEASE_TEXT = "Disponible sábado 22 de agosto";
  const RELEASE_CODE = "// unlock: 22.08.2026";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function isLockedGold(sprite) {
    return Boolean(
      sprite &&
      (sprite.season || "Runners") === CURRENT_SEASON &&
      (sprite.theme === GOLD_THEME || /_gold$/i.test(sprite.id))
    );
  }

  function spriteById(id) {
    if (!id || typeof SPRITES === "undefined") return null;
    return SPRITES.find(sprite => sprite.id === id) || null;
  }

  function addCodeVeil(visual) {
    if (!visual || $(":scope > .sv-gold-code-veil", visual)) return;
    const veil = document.createElement("div");
    veil.className = "sv-gold-code-veil";
    veil.setAttribute("aria-hidden", "true");
    veil.innerHTML = [
      "0110 0010 1101",
      "// LOCKED_DROP",
      "1011 0100 0011",
      "22.08.2026"
    ].map(line => `<span>${line}</span>`).join("");
    visual.prepend(veil);
  }

  function makeReleaseBlock(className = "sv-gold-release") {
    const block = document.createElement("div");
    block.className = className;
    block.innerHTML = `
      <span class="sv-gold-release-icon" aria-hidden="true">🚫</span>
      <span class="sv-gold-release-copy">
        <strong>${RELEASE_TEXT}</strong>
        <small>${RELEASE_CODE}</small>
      </span>`;
    return block;
  }

  function decorateCard(card) {
    if (!card || card.dataset.svGoldRelease === "1") return;
    const sprite = spriteById(card.dataset.id);
    if (!isLockedGold(sprite)) return;

    card.dataset.svGoldRelease = "1";
    card.classList.add("sv-gold-locked");

    const visual = $(".sprite-visual", card);
    const info = $(".sprite-info", card);
    addCodeVeil(visual);

    if (visual && !$(".sv-gold-lock-chip", visual)) {
      const chip = document.createElement("div");
      chip.className = "sv-gold-lock-chip";
      chip.innerHTML = `<span aria-hidden="true">🚫</span><strong>GOLD BLOQUEADO</strong>`;
      visual.append(chip);
    }

    if (info && !$(".sv-gold-release", info)) {
      const actions = $(".sprite-actions", info);
      const release = makeReleaseBlock();
      if (actions) info.insertBefore(release, actions);
      else info.append(release);
    }

    card.title = `${sprite.name} · ${RELEASE_TEXT}`;
  }

  function decorateCards(root = document) {
    $$(".sprite-card", root).forEach(decorateCard);
  }

  function currentDetailSprite() {
    if (typeof state === "undefined" || !state.selectedSpriteId) return null;
    return spriteById(state.selectedSpriteId);
  }

  function decorateDetail() {
    const dialog = $("#spriteDialog");
    const content = $(".sprite-detail-content", dialog || document);
    const visual = $("#detailVisual");
    if (!content || !visual) return;

    const sprite = currentDetailSprite();
    const locked = isLockedGold(sprite);
    content.classList.toggle("sv-gold-detail-active", locked);
    visual.classList.toggle("sv-gold-detail-visual", locked);

    const existing = $(".sv-gold-detail-release", content);
    if (!locked) {
      existing?.remove();
      $(":scope > .sv-gold-code-veil", visual)?.remove();
      return;
    }

    addCodeVeil(visual);
    if (!existing) {
      const release = makeReleaseBlock("sv-gold-detail-release");
      const rarity = $(".detail-rarity-card", content);
      if (rarity) rarity.insertAdjacentElement("afterend", release);
      else content.append(release);
    }
  }

  function decorateCaptureTile(tile) {
    if (!tile || tile.dataset.svGoldRelease === "1") return;
    const image = $("img", tile);
    const sprite = image && typeof SPRITES !== "undefined"
      ? SPRITES.find(item => item.name === image.alt || item.originalName === image.alt)
      : null;

    if (!isLockedGold(sprite)) return;
    tile.dataset.svGoldRelease = "1";
    tile.classList.add("sv-gold-capture-locked");

    const visual = $(".sv-split-tile-visual", tile);
    if (visual && !$(".sv-gold-capture-chip", visual)) {
      const chip = document.createElement("span");
      chip.className = "sv-gold-capture-chip";
      chip.textContent = "🚫 22 AGO";
      visual.append(chip);
    }
  }

  function decorateCapture(root = document) {
    $$(".sv-split-tile", root).forEach(decorateCaptureTile);
  }

  function observeDynamicUI() {
    const spriteContainer = $("#spriteContainer");
    if (spriteContainer) {
      new MutationObserver(() => decorateCards(spriteContainer)).observe(spriteContainer, {
        childList: true,
        subtree: true
      });
    }

    const captureGrid = $("#captureGrid");
    if (captureGrid) {
      new MutationObserver(() => decorateCapture(captureGrid)).observe(captureGrid, {
        childList: true,
        subtree: true
      });
    }

    const dialog = $("#spriteDialog");
    if (dialog) {
      new MutationObserver(decorateDetail).observe(dialog, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["open"]
      });
    }
  }

  function init() {
    decorateCards();
    decorateCapture();
    decorateDetail();
    observeDynamicUI();

    window.addEventListener("spritevault:collectionchange", () => {
      requestAnimationFrame(() => {
        decorateCards();
        decorateCapture();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
