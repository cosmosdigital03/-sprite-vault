const STORAGE_KEY = "spriteVaultProgressV4";

const THEME_VISUALS = {
  "Básico": { accent:"rgba(72,217,255,.72)", overlay:"linear-gradient(165deg,rgba(12,59,87,.40),rgba(11,18,33,.68))", overlayHover:"linear-gradient(165deg,rgba(12,59,87,.16),rgba(11,18,33,.22))", border:"rgba(72,217,255,.24)", shadow:"rgba(31,128,173,.26)" },
  "Dorado": { accent:"rgba(255,205,90,.86)", overlay:"linear-gradient(165deg,rgba(119,83,0,.48),rgba(38,24,4,.70))", overlayHover:"linear-gradient(165deg,rgba(119,83,0,.12),rgba(38,24,4,.18))", border:"rgba(255,205,90,.28)", shadow:"rgba(166,113,0,.28)" },
  "Gomita": { accent:"rgba(255,118,193,.82)", overlay:"linear-gradient(165deg,rgba(147,34,92,.40),rgba(41,11,45,.68))", overlayHover:"linear-gradient(165deg,rgba(147,34,92,.14),rgba(41,11,45,.20))", border:"rgba(255,118,193,.25)", shadow:"rgba(129,35,85,.28)" },
  "Galaxia": { accent:"rgba(132,116,255,.88)", overlay:"linear-gradient(165deg,rgba(62,38,143,.48),rgba(8,14,41,.74))", overlayHover:"linear-gradient(165deg,rgba(62,38,143,.12),rgba(8,14,41,.20))", border:"rgba(132,116,255,.28)", shadow:"rgba(71,52,154,.28)" },
  "Gema": { accent:"rgba(63,230,165,.84)", overlay:"linear-gradient(165deg,rgba(8,102,70,.40),rgba(8,27,26,.70))", overlayHover:"linear-gradient(165deg,rgba(8,102,70,.12),rgba(8,27,26,.20))", border:"rgba(63,230,165,.25)", shadow:"rgba(16,113,82,.28)" },
  "Holográfico": { accent:"rgba(104,236,255,.86)", overlay:"linear-gradient(165deg,rgba(90,48,189,.32),rgba(12,40,72,.62))", overlayHover:"linear-gradient(165deg,rgba(90,48,189,.10),rgba(12,40,72,.18))", border:"rgba(104,236,255,.26)", shadow:"rgba(58,145,175,.30)" }

};

const RARITY_VISUALS = {
  "Raro": {
    color: "#46b8ff",
    soft: "rgba(70,184,255,.34)",
    label: "◆ Raro"
  },
  "Épico": {
    color: "#b06cff",
    soft: "rgba(176,108,255,.36)",
    label: "✦ Épico"
  },
  "Legendario": {
    color: "#ff9b45",
    soft: "rgba(255,155,69,.38)",
    label: "◆ Legendario"
  },
  "Mítico": {
    color: "#ffd45a",
    soft: "rgba(255,212,90,.4)",
    label: "✦ Mítico"
  },
  "Especial": {
    color: "#50ead0",
    soft: "rgba(80,234,208,.34)",
    label: "✧ Especial"
  }
};

let showcaseIndex = -1;
let showcaseTimer = null;

const state = {
  search: "",
  status: "all",
  theme: "all",
  grouped: true,
  progress: loadProgress(),
  selectedSpriteId: null,
  publicProfile: null,
  captureView: "all"
};

const elements = Object.fromEntries([
  "spriteContainer","spriteCardTemplate","searchInput","themeSelect","groupToggle","statusFilters",
  "emptyState","resultCount","resultsTitle","collectionText","masteryText","collectionBar","masteryBar",
  "collectionPercent","masteryPercent","missingCount","shareButton","heroSummary","countAll","countNew",
  "countOwned","countMissing","countMastered","countUnmastered","progressRing","progressCircleValue",
  "progressHeadline","progressSummary","resetFilters","capturePage","closeCapture","captureViewButtons",
  "captureGrid","captureSheet","captureTip","captureOwned","captureMissing","captureMastered","capturePercent","captureTitle",
  "captureResultCount","spriteDialog","closeSpriteDialog","mobileCloseSpriteDialog","detailVisual","detailImage","detailNewBadge",
  "detailTheme","detailName","detailOriginalName","detailRarity","detailFindRate","rarityExplanation",
  "detailOwnedButton","detailMasteryButton","spriteShowcase","showcaseImage","showcaseTheme",
  "showcaseName","showcaseRarity"
].map(id => [id, document.querySelector(`#${id}`)]));

elements.container = elements.spriteContainer;
elements.template = elements.spriteCardTemplate;
elements.search = elements.searchInput;
elements.theme = elements.themeSelect;
elements.group = elements.groupToggle;
elements.status = elements.statusFilters;
elements.empty = elements.emptyState;

function defaultProgress() {
  return Object.fromEntries(
    SPRITES.map(sprite => [sprite.id, { owned:false, mastered:false, favorite:false }])
  );
}

function loadProgress() {
  const defaults = defaultProgress();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    return Object.fromEntries(
      Object.entries(defaults).map(([id,value]) => [id,{...value,...(saved[id]||{})}])
    );
  } catch {
    return defaults;
  }
}

function saveProgress() {
  if (!state.publicProfile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  }
}

/* Keeps older public collection links working, even though new sharing uses screenshots. */
function hexToIds(hex) {
  const bits = [...hex]
    .map(char => parseInt(char,16).toString(2).padStart(4,"0"))
    .join("");

  return new Set(
    SPRITES.filter((_,index) => bits[index] === "1").map(sprite => sprite.id)
  );
}

function initializePublicProfile() {
  const params = new URLSearchParams(location.search);
  const ownedHex = params.get("o");
  if (!ownedHex) return;

  const masteredHex = params.get("m") || "";
  const ownedIds = hexToIds(ownedHex);
  const masteredIds = hexToIds(masteredHex);

  state.publicProfile = {
    name: params.get("p") || "Coleccionista del Vault",
    discord: params.get("d") || ""
  };

  state.progress = defaultProgress();

  for (const sprite of SPRITES) {
    state.progress[sprite.id].owned = ownedIds.has(sprite.id);
    state.progress[sprite.id].mastered = masteredIds.has(sprite.id);
  }

  document.body.classList.add("public-view");
  elements.heroSummary.textContent = `Colección pública de ${state.publicProfile.name}`;
}


function rarityVisual(rarity) {
  return RARITY_VISUALS[rarity] || RARITY_VISUALS["Especial"];
}

function randomShowcaseIndex() {
  if (SPRITES.length <= 1) return 0;

  let nextIndex = showcaseIndex;
  while (nextIndex === showcaseIndex) {
    nextIndex = Math.floor(Math.random() * SPRITES.length);
  }

  return nextIndex;
}

function setShowcaseSprite(sprite, immediate = false) {
  if (!sprite || !elements.spriteShowcase) return;

  const visual = rarityVisual(sprite.rarity);

  const applySprite = () => {
    elements.showcaseImage.src = sprite.image;
    elements.showcaseImage.alt = sprite.name;
    elements.showcaseTheme.textContent = sprite.theme;
    elements.showcaseName.textContent = sprite.name;
    elements.showcaseRarity.textContent = visual.label;

    elements.spriteShowcase.style.setProperty("--showcase-color", visual.color);
    elements.spriteShowcase.style.setProperty("--showcase-soft", visual.soft);

    requestAnimationFrame(() => {
      elements.spriteShowcase.classList.remove("is-switching");
    });
  };

  if (immediate) {
    applySprite();
    return;
  }

  elements.spriteShowcase.classList.add("is-switching");

  const preload = new Image();
  let transitionFinished = false;

  const finishTransition = () => {
    if (transitionFinished) return;
    transitionFinished = true;
    window.setTimeout(applySprite, 220);
  };

  preload.addEventListener("load", finishTransition, { once: true });
  preload.addEventListener("error", finishTransition, { once: true });
  preload.src = sprite.image;

  if (preload.complete) {
    finishTransition();
  }

  /* Fallback: never leave the showcase stuck if a browser delays image events. */
  window.setTimeout(finishTransition, 900);
}

function scheduleNextShowcase() {
  window.clearTimeout(showcaseTimer);

  const delay = 5000 + Math.floor(Math.random() * 5001);

  showcaseTimer = window.setTimeout(() => {
    showcaseIndex = randomShowcaseIndex();
    setShowcaseSprite(SPRITES[showcaseIndex]);
    scheduleNextShowcase();
  }, delay);
}

function initializeShowcase() {
  if (!elements.spriteShowcase || SPRITES.length === 0) return;

  showcaseIndex = randomShowcaseIndex();
  setShowcaseSprite(SPRITES[showcaseIndex], true);
  scheduleNextShowcase();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(showcaseTimer);
    } else {
      scheduleNextShowcase();
    }
  });
}

function populateThemes() {
  [...new Set(SPRITES.map(sprite => sprite.theme))]
    .sort((a,b) => a.localeCompare(b,"es"))
    .forEach(theme => {
      const option = document.createElement("option");
      option.value = theme;
      option.textContent = theme;
      elements.theme.append(option);
    });
}

function filteredSprites() {
  const query = state.search.trim().toLocaleLowerCase("es");

  return SPRITES.filter(sprite => {
    const item = state.progress[sprite.id];

    const matchesText = !query ||
      sprite.name.toLocaleLowerCase("es").includes(query) ||
      sprite.originalName.toLocaleLowerCase("en").includes(query) ||
      sprite.theme.toLocaleLowerCase("es").includes(query);

    const matchesTheme = state.theme === "all" || sprite.theme === state.theme;

    const matchesStatus =
      state.status === "all" ||
      (state.status === "new" && sprite.isNew) ||
      (state.status === "owned" && item.owned) ||
      (state.status === "missing" && !item.owned) ||
      (state.status === "mastered" && item.mastered) ||
      (state.status === "unmastered" && item.owned && !item.mastered);

    return matchesText && matchesTheme && matchesStatus;
  });
}

function groupSprites(sprites) {
  return sprites.reduce((groups,sprite) => {
    (groups[sprite.theme] ||= []).push(sprite);
    return groups;
  }, {});
}

function applyThemeVisuals(card, theme) {
  const visuals = THEME_VISUALS[theme] || THEME_VISUALS["Básico"];

  const properties = {
    "--theme-accent": visuals.accent,
    "--theme-overlay": visuals.overlay,
    "--theme-overlay-hover": visuals.overlayHover,
    "--theme-border": visuals.border,
    "--theme-shadow": visuals.shadow
  };

  for (const [key,value] of Object.entries(properties)) {
    card.style.setProperty(key,value);
  }
}

function render() {
  let sprites = filteredSprites();

  if (state.status === "new") {
    sprites = [...sprites].sort((a,b) => {
      const aMissing = !state.progress[a.id].owned;
      const bMissing = !state.progress[b.id].owned;
      if (aMissing !== bMissing) return aMissing ? -1 : 1;
      return a.name.localeCompare(b.name,"es");
    });
  }

  elements.container.innerHTML = "";
  elements.empty.hidden = sprites.length !== 0;
  elements.resultCount.textContent =
    `${sprites.length} ${sprites.length === 1 ? "resultado" : "resultados"}`;
  elements.resultsTitle.textContent = headingText();

  if (state.status === "new") {
    renderNewGroup(sprites);
  } else if (state.grouped) {
    Object.entries(groupSprites(sprites))
      .sort(([a],[b]) => a.localeCompare(b,"es"))
      .forEach(([theme,list]) => {
        const section = document.createElement("section");
        section.className = "theme-section";

        const title = document.createElement("h3");
        title.className = "theme-header";

        const text = document.createElement("span");
        text.textContent = theme;

        const count = document.createElement("small");
        count.textContent = list.length;

        title.append(text,count);

        const grid = document.createElement("div");
        grid.className = "sprite-grid";
        list.forEach(sprite => grid.append(createCard(sprite)));

        section.append(title,grid);
        elements.container.append(section);
      });
  } else {
    const grid = document.createElement("div");
    grid.className = "sprite-grid";
    sprites.forEach(sprite => grid.append(createCard(sprite)));
    elements.container.append(grid);
  }

  updateStats();
}

function renderNewGroup(sprites) {
  const newTotal = SPRITES.filter(sprite => sprite.isNew).length;
  const newMissing = SPRITES.filter(
    sprite => sprite.isNew && !state.progress[sprite.id].owned
  ).length;

  const section = document.createElement("section");
  section.className = "theme-section new-sprites-section";

  const summary = document.createElement("div");
  summary.className = "new-group-summary";
  summary.innerHTML = `
    <div>
      <span class="eyebrow">SPRITES RECIENTES</span>
      <h3>Nuevos</h3>
      <p>Los que te faltan aparecen primero y están marcados en rojo.</p>
    </div>
    <div class="new-group-count">
      <strong>${newMissing}</strong>
      <span>te faltan de ${newTotal}</span>
    </div>
  `;

  const grid = document.createElement("div");
  grid.className = "sprite-grid new-sprite-grid";
  sprites.forEach(sprite => grid.append(createCard(sprite)));

  section.append(summary,grid);
  elements.container.append(section);
}

function headingText() {
  const labels = {
    all: "Todos los Sprites",
    owned: "Sprites que tengo",
    missing: "Sprites que me faltan",
    mastered: "Sprites dominados",
    unmastered: "Sprites sin dominar"
  };

  if (state.status === "new") {
    const newTotal = SPRITES.filter(sprite => sprite.isNew).length;
    const newMissing = SPRITES.filter(
      sprite => sprite.isNew && !state.progress[sprite.id].owned
    ).length;
    return `Nuevos · te faltan ${newMissing} de ${newTotal}`;
  }

  return state.theme === "all"
    ? labels[state.status]
    : `${labels[state.status]} · ${state.theme}`;
}

function createCard(sprite) {
  const fragment = elements.template.content.cloneNode(true);
  const card = fragment.querySelector(".sprite-card");
  const item = state.progress[sprite.id];

  card.dataset.id = sprite.id;
  card.classList.toggle("is-owned",item.owned);
  card.classList.toggle("is-missing",!item.owned);

  if (state.status === "new") {
    card.classList.add("new-filter-card");
    card.classList.toggle("new-missing-highlight",!item.owned);
  }

  applyThemeVisuals(card,sprite.theme);

  const image = fragment.querySelector(".sprite-image");
  image.src = sprite.image;
  image.alt = sprite.name;
  image.addEventListener("error",() => image.classList.add("image-error"));

  fragment.querySelector(".sprite-rarity").textContent = sprite.rarity;
  fragment.querySelector(".sprite-theme").textContent = sprite.theme;
  fragment.querySelector(".sprite-name").textContent = sprite.name;
  fragment.querySelector(".sprite-original-name").textContent = sprite.originalName;
  fragment.querySelector(".sprite-find-rate").textContent = sprite.findRate;
  fragment.querySelector(".new-badge").hidden = !sprite.isNew;

  const newStatusLabel = fragment.querySelector(".new-status-label");
  newStatusLabel.hidden = state.status !== "new";
  newStatusLabel.textContent = item.owned ? "LO TIENES" : "TE FALTA";
  newStatusLabel.classList.toggle("owned",item.owned);
  newStatusLabel.classList.toggle("missing",!item.owned);

  const visual = fragment.querySelector(".sprite-visual");
  visual.tabIndex = 0;
  visual.setAttribute("role","button");
  visual.setAttribute("aria-label",`Ver detalles de ${sprite.name}`);
  visual.addEventListener("click",() => openSpriteDetail(sprite.id));
  visual.addEventListener("keydown",event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openSpriteDetail(sprite.id);
    }
  });

  const favorite = fragment.querySelector(".favorite-button");
  favorite.textContent = item.favorite ? "★" : "☆";
  favorite.classList.toggle("active",item.favorite);
  favorite.addEventListener("click",event => {
    event.stopPropagation();
    item.favorite = !item.favorite;
    saveProgress();
    render();
  });

  const collection = fragment.querySelector(".collection-button");
  collection.textContent = item.owned ? "✓ Lo tengo" : "+ Agregar";
  collection.classList.toggle("active",item.owned);
  collection.disabled = Boolean(state.publicProfile);
  collection.addEventListener("click",() => toggleOwned(sprite.id));

  const mastery = fragment.querySelector(".mastery-button");
  mastery.textContent = item.mastered ? "♛ Dominado" : "Dominar";
  mastery.classList.toggle("active",item.mastered);
  mastery.disabled = !item.owned || Boolean(state.publicProfile);
  mastery.addEventListener("click",() => toggleMastered(sprite.id));

  return fragment;
}

function toggleOwned(id) {
  if (state.publicProfile) return;

  const item = state.progress[id];
  item.owned = !item.owned;

  if (!item.owned) {
    item.mastered = false;
  }

  saveProgress();
  render();
  refreshDetail();

  if (!elements.capturePage.hidden) {
    renderCaptureView();
  }
}

function toggleMastered(id) {
  if (state.publicProfile) return;

  const item = state.progress[id];
  if (!item.owned) return;

  item.mastered = !item.mastered;
  saveProgress();
  render();
  refreshDetail();

  if (!elements.capturePage.hidden) {
    renderCaptureView();
  }
}

function updateStats() {
  const total = SPRITES.length;
  const owned = SPRITES.filter(sprite => state.progress[sprite.id].owned).length;
  const mastered = SPRITES.filter(sprite => state.progress[sprite.id].mastered).length;
  const unmastered = SPRITES.filter(
    sprite => state.progress[sprite.id].owned && !state.progress[sprite.id].mastered
  ).length;
  const missing = total-owned;
  const newTotal = SPRITES.filter(sprite => sprite.isNew).length;
  const collectionPct = total ? Math.round(owned/total*100) : 0;
  const masteryPct = total ? Math.round(mastered/total*100) : 0;

  elements.collectionText.textContent = `${owned} / ${total}`;
  elements.masteryText.textContent = `${mastered} / ${total}`;
  elements.collectionBar.style.width = `${collectionPct}%`;
  elements.masteryBar.style.width = `${masteryPct}%`;
  elements.collectionPercent.textContent = `${collectionPct}% completado`;
  elements.masteryPercent.textContent = `${masteryPct}% dominado`;
  elements.missingCount.textContent =
    `${missing} ${missing===1 ? "Sprite" : "Sprites"}`;

  if (!state.publicProfile) {
    elements.heroSummary.textContent =
      `${total} Sprites · Español · Guardado automático`;
  }

  elements.countAll.textContent = total;
  elements.countNew.textContent = newTotal;
  elements.countOwned.textContent = owned;
  elements.countMissing.textContent = missing;
  elements.countMastered.textContent = mastered;
  elements.countUnmastered.textContent = unmastered;

  elements.progressRing.style.setProperty("--progress",collectionPct);
  elements.progressCircleValue.textContent = `${collectionPct}%`;

  elements.progressHeadline.textContent =
    collectionPct === 100 ? "¡Vault completado!" :
    collectionPct >= 75 ? "Ya casi completas el Vault" :
    collectionPct >= 40 ? "Tu colección está creciendo" :
    owned > 0 ? "Buen comienzo" :
    "Comienza tu colección";

  elements.progressSummary.textContent =
    `${owned} de ${total} Sprites agregados.`;

  window.dispatchEvent(new CustomEvent("spritevault:collectionchange", {
    detail: { owned, mastered, missing, total, collectionPct }
  }));
}

function rarityMessage(value) {
  if (!value || value === "No disponible") {
    return "Todavía no hay una estimación pública disponible.";
  }

  const number = Number(value.replace("%",""));

  if (number === 0) {
    return "La estadística actual muestra 0%, normalmente porque todavía hay muy pocos registros.";
  }
  if (number < .00001) {
    return "Extremadamente raro: la estimación es menor a una posibilidad entre millones.";
  }
  if (number < .001) {
    return "Ultra raro: aparece en una fracción diminuta de los registros.";
  }
  if (number < .05) {
    return "Muy raro: se encuentra en menos de 1 de cada 2,000 registros.";
  }
  if (number < .5) {
    return "Raro: aparece en menos de 1 de cada 200 registros.";
  }
  if (number < 3) {
    return "Poco común dentro del conjunto de Sprites.";
  }

  return "Comparativamente más frecuente que las variantes especiales.";
}

let spriteDialogHistoryActive = false;

function openSpriteDetail(id) {
  state.selectedSpriteId = id;
  refreshDetail();

  if (!elements.spriteDialog.open) {
    elements.spriteDialog.showModal();
    document.body.classList.add("sprite-dialog-open");

    history.pushState(
      { ...(history.state || {}), spriteVaultDialog: true },
      "",
      location.href
    );
    spriteDialogHistoryActive = true;
  }
}

function closeSpriteDetail({ fromHistory = false } = {}) {
  if (elements.spriteDialog.open) elements.spriteDialog.close();
  document.body.classList.remove("sprite-dialog-open");
  state.selectedSpriteId = null;

  if (!fromHistory && spriteDialogHistoryActive && history.state?.spriteVaultDialog) {
    spriteDialogHistoryActive = false;
    history.back();
    return;
  }

  spriteDialogHistoryActive = false;
}

function refreshDetail() {
  if (!state.selectedSpriteId) return;

  const sprite = SPRITES.find(item => item.id === state.selectedSpriteId);
  if (!sprite) return;

  const item = state.progress[sprite.id];

  applyThemeVisuals(elements.detailVisual,sprite.theme);
  elements.detailImage.src = sprite.image;
  elements.detailImage.alt = sprite.name;
  elements.detailNewBadge.hidden = !sprite.isNew;
  elements.detailTheme.textContent = sprite.theme;
  elements.detailName.textContent = sprite.name;
  elements.detailOriginalName.textContent = sprite.originalName;
  elements.detailRarity.textContent = sprite.rarity;
  elements.detailFindRate.textContent = sprite.findRate;
  elements.rarityExplanation.textContent = rarityMessage(sprite.findRate);

  elements.detailOwnedButton.textContent =
    item.owned ? "✓ Lo tengo" : "+ Agregar a mi colección";
  elements.detailOwnedButton.classList.toggle("active",item.owned);
  elements.detailOwnedButton.disabled = Boolean(state.publicProfile);

  elements.detailMasteryButton.textContent =
    item.mastered ? "♛ Dominado" : "Marcar como dominado";
  elements.detailMasteryButton.classList.toggle("active",item.mastered);
  elements.detailMasteryButton.disabled =
    !item.owned || Boolean(state.publicProfile);
}

function resetFilters() {
  state.search = "";
  state.status = "all";
  state.theme = "all";
  state.grouped = true;

  elements.search.value = "";
  elements.theme.value = "all";
  elements.group.checked = true;

  elements.status.querySelectorAll("button").forEach(button => {
    button.classList.toggle("active",button.dataset.status === "all");
  });

  render();
}

function openCaptureView() {
  state.captureView = "all";
  elements.capturePage.hidden = false;
  document.body.classList.add("capture-mode");

  elements.captureViewButtons.querySelectorAll("button").forEach(button => {
    button.classList.toggle("active",button.dataset.captureView === "all");
  });

  renderCaptureView();
  window.scrollTo({top:0,behavior:"auto"});
}

function closeCaptureView() {
  elements.capturePage.classList.remove("is-screenshot-mode");
  document.body.classList.remove("capture-mode");
  elements.capturePage.hidden = true;
  window.scrollTo({top:0,behavior:"auto"});
}

const CAPTURE_VARIANT_ORDER = [
  { theme: "Básico", label: "Normal" },
  { theme: "Dorado", label: "Dorado" },
  { theme: "Gomita", label: "Gomita" },
  { theme: "Galaxia", label: "Galaxia" },
  { theme: "Holográfico", label: "Holo" }
];

function getCaptureBaseKey(sprite) {
  return sprite.id.replace(/_(basic|gold|candy|galaxy|holofoil|gem|cube)$/i, "");
}

function getCaptureBaseLabel(group) {
  const basic = group.find(sprite => sprite.theme === "Básico") || group[0];
  return basic.name
    .replace(/\s+(Dorada|Dorado|Gomita|Galáctica|Galáctico|Holográfica|Holográfico)$/i, "")
    .trim();
}

function renderCaptureView() {
  const total = SPRITES.length;
  const owned = SPRITES.filter(sprite => state.progress[sprite.id].owned).length;
  const missing = total-owned;
  const mastered = SPRITES.filter(sprite => state.progress[sprite.id].mastered).length;
  const pct = total ? Math.round(owned/total*100) : 0;

  const sprites = state.captureView === "missing"
    ? SPRITES.filter(sprite => !state.progress[sprite.id].owned)
    : [...SPRITES];

  elements.captureOwned.textContent = owned;
  elements.captureMissing.textContent = missing;
  elements.captureMastered.textContent = mastered;
  elements.capturePercent.textContent = `${pct}%`;
  elements.captureTitle.textContent = state.captureView === "missing"
    ? "Los que me faltan"
    : state.captureView === "screenshot"
      ? "Captura compacta"
      : "Todos juntos";
  elements.captureResultCount.textContent =
    `${sprites.length} ${sprites.length === 1 ? "Sprite" : "Sprites"}`;

  const isScreenshot = state.captureView === "screenshot";
  elements.capturePage.classList.toggle("is-screenshot-mode", isScreenshot);
  elements.captureSheet.classList.toggle("is-screenshot", isScreenshot);
  elements.captureGrid.classList.toggle("is-matrix", isScreenshot);
  elements.captureGrid.innerHTML = "";
  elements.captureTip.textContent = isScreenshot
    ? "Diseñada para una sola captura con desplazamiento: cada fila es un tipo y cada columna una variante."
    : "En teléfono, usa una captura con desplazamiento para guardar la lista completa.";

  if (isScreenshot) {
    renderCaptureMatrix();
    return;
  }

  for (const sprite of sprites) {
    elements.captureGrid.append(createCaptureSprite(sprite));
  }
}

function renderCaptureMatrix() {
  const groups = new Map();

  for (const sprite of SPRITES) {
    const key = getCaptureBaseKey(sprite);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(sprite);
  }

  const availableThemes = [...new Set(SPRITES.map(sprite => sprite.theme))];
  const variants = [
    ...CAPTURE_VARIANT_ORDER.filter(item => availableThemes.includes(item.theme)),
    ...availableThemes
      .filter(theme => !CAPTURE_VARIANT_ORDER.some(item => item.theme === theme))
      .map(theme => ({ theme, label: theme }))
  ];

  const matrix = document.createElement("div");
  matrix.className = "capture-matrix";
  matrix.style.setProperty("--capture-variant-count", variants.length);

  const header = document.createElement("div");
  header.className = "capture-matrix-row capture-matrix-header";

  const typeHeader = document.createElement("span");
  typeHeader.className = "capture-type-heading";
  typeHeader.textContent = "Tipo";
  header.append(typeHeader);

  for (const variant of variants) {
    const label = document.createElement("span");
    label.className = `capture-variant-heading capture-variant-${variant.theme.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
    label.textContent = variant.label;
    header.append(label);
  }

  matrix.append(header);

  for (const group of groups.values()) {
    const row = document.createElement("div");
    row.className = "capture-matrix-row";

    const ownedCount = group.filter(sprite => state.progress[sprite.id].owned).length;
    const label = document.createElement("div");
    label.className = "capture-type-label";
    label.innerHTML = `<strong>${getCaptureBaseLabel(group)}</strong><span>${ownedCount}/${group.length}</span>`;
    row.append(label);

    for (const variant of variants) {
      const sprite = group.find(item => item.theme === variant.theme);
      const cell = document.createElement("div");
      cell.className = "capture-matrix-cell";

      if (sprite) {
        cell.append(createCaptureMatrixSprite(sprite));
      } else {
        const empty = document.createElement("span");
        empty.className = "capture-matrix-empty";
        empty.textContent = "—";
        cell.append(empty);
      }

      row.append(cell);
    }

    matrix.append(row);
  }

  elements.captureGrid.append(matrix);
}

function createCaptureMatrixSprite(sprite) {
  const item = state.progress[sprite.id];
  const tile = document.createElement("div");

  tile.className = [
    "capture-matrix-sprite",
    item.owned ? "is-owned" : "is-missing",
    item.mastered ? "is-mastered" : "",
    sprite.isNew ? "is-new" : ""
  ].filter(Boolean).join(" ");

  applyThemeVisuals(tile, sprite.theme);
  tile.title = `${sprite.originalName} · ${sprite.theme} · ${item.owned ? "Lo tengo" : "Me falta"}`;
  tile.setAttribute("aria-label", tile.title);

  const image = document.createElement("img");
  image.src = sprite.image;
  image.alt = sprite.originalName;
  image.loading = "eager";
  tile.append(image);

  if (item.mastered) {
    const star = document.createElement("span");
    star.className = "capture-matrix-mastered";
    star.textContent = "♛";
    tile.append(star);
  }

  if (sprite.isNew) {
    const badge = document.createElement("span");
    badge.className = "capture-matrix-new";
    badge.textContent = "N";
    tile.append(badge);
  }

  return tile;
}

function createCaptureSprite(sprite) {
  const item = state.progress[sprite.id];
  const tile = document.createElement("article");

  tile.className = [
    "capture-sprite",
    item.owned ? "is-owned" : "is-missing",
    item.mastered ? "is-mastered" : "",
    sprite.isNew ? "is-new" : ""
  ].filter(Boolean).join(" ");

  applyThemeVisuals(tile,sprite.theme);

  const imageWrap = document.createElement("div");
  imageWrap.className = "capture-sprite-image";

  const image = document.createElement("img");
  image.src = sprite.image;
  image.alt = sprite.name;
  image.loading = "eager";

  imageWrap.append(image);

  if (sprite.isNew) {
    const newBadge = document.createElement("span");
    newBadge.className = "capture-new-badge";
    newBadge.textContent = "Nuevo";
    imageWrap.append(newBadge);
  }

  if (item.mastered) {
    const masteredBadge = document.createElement("span");
    masteredBadge.className = "capture-mastered-badge";
    masteredBadge.textContent = "♛";
    imageWrap.append(masteredBadge);
  }

  const name = document.createElement("strong");
  name.textContent = sprite.name;
  name.title = sprite.name;

  tile.append(imageWrap,name);
  return tile;
}

elements.search.addEventListener("input",event => {
  state.search = event.target.value;
  render();
});

elements.theme.addEventListener("change",event => {
  state.theme = event.target.value;
  render();
});

elements.group.addEventListener("change",event => {
  state.grouped = event.target.checked;
  render();
});

elements.status.addEventListener("click",event => {
  const button = event.target.closest("button[data-status]");
  if (!button) return;

  state.status = button.dataset.status;

  elements.status.querySelectorAll("button").forEach(item => {
    item.classList.toggle("active",item === button);
  });

  render();
});

elements.resetFilters.addEventListener("click",resetFilters);
elements.shareButton.addEventListener("click",openCaptureView);
elements.closeCapture.addEventListener("click",closeCaptureView);


// ==========================================
// V11.1: ADAPTIVE CAPTURE IMAGE GENERATOR
// Based on the reference site's canvas export layout.
// ==========================================
const CAPTURE_EXPORT_THEME_ORDER = [
  "Básico",
  "Dorado",
  "Gomita",
  "Galaxia",
  "Holográfico"
];

function loadCaptureImage(source) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = source;
  });
}

function sortCaptureExportSprites(sprites) {
  const originalOrder = new Map(SPRITES.map((sprite,index) => [sprite.id,index]));

  return [...sprites].sort((a,b) => {
    const themeA = CAPTURE_EXPORT_THEME_ORDER.indexOf(a.theme);
    const themeB = CAPTURE_EXPORT_THEME_ORDER.indexOf(b.theme);
    const safeA = themeA === -1 ? 999 : themeA;
    const safeB = themeB === -1 ? 999 : themeB;

    if (safeA !== safeB) return safeA-safeB;
    return (originalOrder.get(a.id) || 0)-(originalOrder.get(b.id) || 0);
  });
}

function getCaptureExportPalette(sprite) {
  const palettes = {
    Raro: {
      top: "#104273",
      bottom: "#081a35",
      border: "#1d75bd",
      badge: "#004a8e",
      badgeText: "#71f4ff"
    },
    Épico: {
      top: "#4d1566",
      bottom: "#1e052c",
      border: "#a341ca",
      badge: "#511d7f",
      badgeText: "#f598ff"
    },
    Legendario: {
      top: "#743e0a",
      bottom: "#301702",
      border: "#cd7a25",
      badge: "#8e4122",
      badgeText: "#fbc568"
    },
    Mítico: {
      top: "#70531c",
      bottom: "#2e2107",
      border: "#d1a63f",
      badge: "#80622a",
      badgeText: "#fff1a9"
    }
  };

  if (sprite.rarity !== "Especial") {
    return palettes[sprite.rarity] || palettes.Raro;
  }

  const special = {
    Básico: ["#1c3345", "#09131e", "#5bc9f0"],
    Dorado: ["#61460b", "#241a02", "#e8b946"],
    Gomita: ["#6b183f", "#260514", "#df5ca1"],
    Galaxia: ["#261552", "#080314", "#7a65dc"],
    Holográfico: ["#204454", "#09171f", "#67dbe9"]
  };
  const values = special[sprite.theme] || special.Básico;

  return {
    top: values[0],
    bottom: values[1],
    border: values[2],
    badge: values[2],
    badgeText: "#061119",
    special: true
  };
}

function fitCanvasText(ctx,text,maxWidth,startSize,minSize=8) {
  let size = startSize;
  ctx.font = `700 ${size}px "Oswald", "Arial Narrow", sans-serif`;
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= .5;
    ctx.font = `700 ${size}px "Oswald", "Arial Narrow", sans-serif`;
  }
  return size;
}

function drawCaptureExportCard(ctx,sprite,image,x,y,cardW,cardH,mode) {
  const imageAreaH = cardH-38;
  const palette = getCaptureExportPalette(sprite);

  ctx.fillStyle = "#0f141d";
  ctx.fillRect(x,y,cardW,cardH);

  const background = ctx.createLinearGradient(x,y,x,y+imageAreaH);
  background.addColorStop(0,palette.top);
  background.addColorStop(1,palette.bottom);
  ctx.fillStyle = background;
  ctx.fillRect(x,y,cardW,imageAreaH);

  if (palette.special) {
    const rainbow = ctx.createLinearGradient(x,y,x+cardW,y+imageAreaH);
    rainbow.addColorStop(0,"rgba(81,247,204,.16)");
    rainbow.addColorStop(.5,"rgba(227,116,238,.23)");
    rainbow.addColorStop(1,"rgba(181,246,158,.15)");
    ctx.fillStyle = rainbow;
    ctx.fillRect(x,y,cardW,imageAreaH);
  }

  const shine = ctx.createLinearGradient(x,y,x,y+imageAreaH);
  shine.addColorStop(0,"rgba(255,255,255,.17)");
  shine.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.fillRect(x,y,cardW,imageAreaH);

  if (image && image.naturalWidth > 0) {
    const maxSize = cardW*.84;
    const ratio = Math.min(maxSize/image.naturalWidth,maxSize/image.naturalHeight);
    const drawW = image.naturalWidth*ratio;
    const drawH = image.naturalHeight*ratio;
    ctx.drawImage(
      image,
      x+(cardW-drawW)/2,
      y+(imageAreaH-drawH)/2+2,
      drawW,
      drawH
    );
  }

  if (mode === "unmastered") {
    ctx.save();
    ctx.fillStyle = "#00efff";
    ctx.font = '900 12px "Oswald", "Arial Narrow", sans-serif';
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.shadowColor = "rgba(0,0,0,.9)";
    ctx.shadowBlur = 4;
    ctx.fillText("NO DOMINADO",x+7,y+7);
    ctx.restore();
  }

  if (sprite.isNew) {
    ctx.save();
    ctx.fillStyle = "#50d9ff";
    ctx.fillRect(x+cardW-34,y+6,28,20);
    ctx.fillStyle = "#03131a";
    ctx.font = '900 10px "Oswald", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("NUEVO",x+cardW-20,y+16);
    ctx.restore();
  }

  const badgeW = 82;
  ctx.fillStyle = palette.badge;
  ctx.beginPath();
  ctx.moveTo(x,y+imageAreaH-20);
  ctx.lineTo(x+badgeW-12,y+imageAreaH-20);
  ctx.lineTo(x+badgeW,y+imageAreaH);
  ctx.lineTo(x,y+imageAreaH);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = palette.badgeText;
  ctx.font = '900 12px "Oswald", "Arial Narrow", sans-serif';
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText((sprite.rarity || "Raro").toUpperCase(),x+6,y+imageAreaH-10);

  ctx.fillStyle = "rgba(15,20,29,.95)";
  ctx.fillRect(x,y+imageAreaH,cardW,38);

  const name = sprite.name.toUpperCase();
  ctx.fillStyle = "#ffffff";
  fitCanvasText(ctx,name,cardW-10,17,7);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name,x+cardW/2,y+imageAreaH+19);

  ctx.fillStyle = palette.border;
  ctx.fillRect(x,y+cardH-4,cardW,4);
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 3;
  ctx.strokeRect(x+1.5,y+1.5,cardW-3,cardH-3);
}

async function buildCaptureExportCanvas(mode) {
  const targetSprites = sortCaptureExportSprites(
    mode === "missing"
      ? SPRITES.filter(sprite => !state.progress[sprite.id].owned)
      : SPRITES.filter(sprite => state.progress[sprite.id].owned && !state.progress[sprite.id].mastered)
  );

  if (targetSprites.length === 0) {
    alert(mode === "missing"
      ? "No te falta ningún Sprite."
      : "No tienes Sprites pendientes por dominar.");
    return null;
  }

  await document.fonts.ready;
  try {
    await document.fonts.load('900 32px "Oswald"');
  } catch (error) {
    console.warn("Oswald font was not available for the capture.",error);
  }

  const cardW = 160;
  const cardH = 200;
  const padding = 15;
  const border = 8;
  const headerH = 72;
  const footerH = 55;
  const maxCols = 6;
  const cols = Math.min(maxCols,targetSprites.length);
  const rows = Math.ceil(targetSprites.length/cols);
  const innerWidth = cols*(cardW+padding)+padding;

  const canvas = document.createElement("canvas");
  canvas.width = innerWidth+border*2;
  canvas.height = border+headerH+padding+rows*(cardH+padding)+footerH+border;
  const ctx = canvas.getContext("2d");

  const accent = mode === "missing" ? "#ef4444" : "#00f0ff";
  const fullTitle = mode === "missing"
    ? "CAPTURA ME FALTAN SPRITE"
    : "CAPTURA NO DOMINADO";
  const title = cols <= 2
    ? (mode === "missing" ? "ME FALTAN" : "NO DOMINADO")
    : fullTitle;

  ctx.fillStyle = accent;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#0b0d13";
  ctx.fillRect(border,border,canvas.width-border*2,canvas.height-border*2);
  ctx.fillStyle = "#181c25";
  ctx.fillRect(border,border,canvas.width-border*2,headerH);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(border,border+headerH);
  ctx.lineTo(canvas.width-border,border+headerH);
  ctx.stroke();

  const [logo,...spriteImages] = await Promise.all([
    loadCaptureImage("images/sprite-vault-logo.png"),
    ...targetSprites.map(sprite => loadCaptureImage(sprite.image))
  ]);

  let titleX = border+padding;
  if (logo) {
    const logoSize = 42;
    ctx.drawImage(logo,titleX,border+(headerH-logoSize)/2,logoSize,logoSize);
    titleX += logoSize+12;
  }

  ctx.fillStyle = accent;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  fitCanvasText(ctx,`SPRITE VAULT: ${title}`,canvas.width-titleX-border-padding,32,14);
  ctx.font = ctx.font.replace(/^700 /,'900 ');
  ctx.fillText(`SPRITE VAULT: ${title}`,titleX,border+headerH/2);

  targetSprites.forEach((sprite,index) => {
    const column = index%cols;
    const row = Math.floor(index/cols);
    const x = border+padding+column*(cardW+padding);
    const y = border+headerH+padding+row*(cardH+padding);
    drawCaptureExportCard(ctx,sprite,spriteImages[index],x,y,cardW,cardH,mode);
  });

  const footerY = canvas.height-footerH-border;
  ctx.fillStyle = "#0e1117";
  ctx.fillRect(border,footerY,canvas.width-border*2,footerH);
  ctx.fillStyle = "#ffffff";
  const footerText = "discord.gg/7AAnVUPZc";
  fitCanvasText(ctx,footerText,canvas.width-border*2-30,24,10);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(footerText,canvas.width/2,footerY+footerH/2);

  return { canvas, title };
}

function writeCapturePreviewPage(previewWindow,imageUrl,title,imageWidth) {
  previewWindow.document.open();
  previewWindow.document.write(`<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5,user-scalable=yes">
  <meta name="theme-color" content="#05070d">
  <title>${title} | Sprite Vault</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; background: #05070d; }
    body { display: flex; justify-content: center; align-items: flex-start; overflow-x: hidden; }
    img { display: block; width: min(100%, ${imageWidth}px); height: auto; margin: 0 auto; }
  </style>
</head>
<body><img src="${imageUrl}" alt="${title}"></body>
</html>`);
  previewWindow.document.close();
}


let mobileCaptureObjectUrl = null;

function ensureMobileCapturePreview() {
  let preview = document.getElementById("mobileCapturePreview");
  if (preview) return preview;

  preview = document.createElement("section");
  preview.id = "mobileCapturePreview";
  preview.className = "mobile-capture-preview";
  preview.hidden = true;
  preview.innerHTML = `
    <header class="mobile-capture-preview-toolbar">
      <button class="mobile-capture-preview-back" type="button">← Volver</button>
      <strong class="mobile-capture-preview-title">Generando captura...</strong>
    </header>
    <div class="mobile-capture-preview-body">
      <div class="mobile-capture-preview-loading">Generando captura...</div>
      <img class="mobile-capture-preview-image" alt="" hidden>
    </div>`;

  document.body.append(preview);
  preview.querySelector(".mobile-capture-preview-back").addEventListener("click", closeMobileCapturePreview);
  return preview;
}

function openMobileCapturePreview(title) {
  const preview = ensureMobileCapturePreview();
  const image = preview.querySelector(".mobile-capture-preview-image");
  const loading = preview.querySelector(".mobile-capture-preview-loading");

  if (mobileCaptureObjectUrl) {
    URL.revokeObjectURL(mobileCaptureObjectUrl);
    mobileCaptureObjectUrl = null;
  }

  preview.querySelector(".mobile-capture-preview-title").textContent = title;
  loading.textContent = "Generando captura...";
  loading.hidden = false;
  image.hidden = true;
  image.removeAttribute("src");
  image.alt = title;
  preview.hidden = false;
  document.body.classList.add("mobile-capture-open");
  preview.scrollTop = 0;
}

function showMobileCaptureResult(blob,title) {
  const preview = ensureMobileCapturePreview();
  const image = preview.querySelector(".mobile-capture-preview-image");
  const loading = preview.querySelector(".mobile-capture-preview-loading");

  if (mobileCaptureObjectUrl) URL.revokeObjectURL(mobileCaptureObjectUrl);
  mobileCaptureObjectUrl = URL.createObjectURL(blob);

  preview.querySelector(".mobile-capture-preview-title").textContent = title;
  image.onload = () => {
    loading.hidden = true;
    image.hidden = false;
    preview.scrollTop = 0;
  };
  image.onerror = () => {
    loading.textContent = "No se pudo mostrar la captura.";
  };
  image.src = mobileCaptureObjectUrl;
}

function closeMobileCapturePreview() {
  const preview = document.getElementById("mobileCapturePreview");
  if (!preview) return;

  preview.hidden = true;
  document.body.classList.remove("mobile-capture-open");

  if (mobileCaptureObjectUrl) {
    URL.revokeObjectURL(mobileCaptureObjectUrl);
    mobileCaptureObjectUrl = null;
  }

  const image = preview.querySelector(".mobile-capture-preview-image");
  image.removeAttribute("src");
  image.hidden = true;
}

function isMobileCaptureDevice() {
  return window.matchMedia("(max-width: 700px)").matches ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

async function openGeneratedCapture(mode,button) {
  const useMobilePreview = isMobileCaptureDevice();
  const previewTitle = mode === "missing"
    ? "Captura me faltan sprite"
    : "Captura no dominado";
  let previewWindow = null;

  if (useMobilePreview) {
    openMobileCapturePreview(previewTitle);
  } else {
    previewWindow = window.open("","_blank");
    if (!previewWindow) {
      alert("Permite las ventanas emergentes para abrir la captura completa.");
      return;
    }

    previewWindow.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;min-height:100%;display:grid;place-items:center;background:#05070d;color:#fff;font:700 16px Arial,sans-serif}</style><title>Generando captura...</title></head><body>Generando captura...</body></html>`);
    previewWindow.document.close();
  }

  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Generando...";

  try {
    const result = await buildCaptureExportCanvas(mode);
    if (!result) {
      if (useMobilePreview) closeMobileCapturePreview();
      else previewWindow.close();
      return;
    }

    const blob = await new Promise(resolve => result.canvas.toBlob(resolve,"image/png"));
    if (!blob) throw new Error("The capture image could not be created.");

    if (useMobilePreview) {
      showMobileCaptureResult(blob,result.title);
    } else {
      const imageUrl = URL.createObjectURL(blob);
      writeCapturePreviewPage(
        previewWindow,
        imageUrl,
        result.title,
        result.canvas.width
      );

      previewWindow.addEventListener("beforeunload",() => URL.revokeObjectURL(imageUrl),{ once:true });
    }
  } catch (error) {
    console.error(error);
    if (useMobilePreview) closeMobileCapturePreview();
    else if (previewWindow && !previewWindow.closed) previewWindow.close();
    alert("No se pudo generar la captura.");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

elements.captureViewButtons.addEventListener("click",event => {
  const generateButton = event.target.closest("button[data-capture-generate]");
  if (generateButton) {
    openGeneratedCapture(generateButton.dataset.captureGenerate,generateButton);
    return;
  }

  const button = event.target.closest("button[data-capture-view]");
  if (!button) return;

  state.captureView = button.dataset.captureView;

  elements.captureViewButtons.querySelectorAll("button[data-capture-view]").forEach(item => {
    item.classList.toggle("active",item === button);
  });

  renderCaptureView();
});

elements.closeSpriteDialog.addEventListener("click",() => closeSpriteDetail());
elements.mobileCloseSpriteDialog.addEventListener("click",() => closeSpriteDetail());

elements.spriteDialog.addEventListener("cancel",event => {
  event.preventDefault();
  closeSpriteDetail();
});

elements.spriteDialog.addEventListener("click",event => {
  if (event.target === elements.spriteDialog) closeSpriteDetail();
});

window.addEventListener("popstate",() => {
  if (elements.spriteDialog.open) closeSpriteDetail({ fromHistory: true });
});

elements.detailOwnedButton.addEventListener("click",() => {
  toggleOwned(state.selectedSpriteId);
});

elements.detailMasteryButton.addEventListener("click",() => {
  toggleMastered(state.selectedSpriteId);
});


window.SpriteVaultCollection = {
  getSnapshot() {
    const ownedSpriteIds = SPRITES
      .filter(sprite => state.progress[sprite.id].owned)
      .map(sprite => sprite.id);
    const masteredSpriteIds = SPRITES
      .filter(sprite => state.progress[sprite.id].mastered)
      .map(sprite => sprite.id);

    const ownedSpecialKeys = [...new Set(
      SPRITES
        .filter(sprite => state.progress[sprite.id].owned)
        .flatMap(sprite => {
          const keys = [];
          if (sprite.theme === "Galaxia") keys.push("galaxy");
          if (sprite.theme === "Gomita") keys.push("gummy");
          if (sprite.theme === "Dorado") keys.push("gold");
          if (sprite.theme === "Holográfico") keys.push("holofoil");
          if (sprite.theme === "Cubo" || /^cube_/i.test(sprite.id) || /_cube(?:_|$)/i.test(sprite.id)) keys.push("cubes");
          return keys;
        })
    )];

    return {
      ownedSpriteIds,
      masteredSpriteIds,
      ownedSpecialKeys,
      owned: ownedSpriteIds.length,
      mastered: masteredSpriteIds.length,
      total: SPRITES.length,
      isPublicView: Boolean(state.publicProfile)
    };
  }
};

populateThemes();
initializePublicProfile();
render();
initializeShowcase();
