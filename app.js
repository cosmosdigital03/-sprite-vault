const STORAGE_KEY = "spriteVaultProgressV1";

const state = {
  search: "",
  status: "all",
  theme: "all",
  grouped: true,
  progress: loadProgress()
};

const elements = {
  container: document.querySelector("#spriteContainer"),
  template: document.querySelector("#spriteCardTemplate"),
  search: document.querySelector("#searchInput"),
  theme: document.querySelector("#themeSelect"),
  group: document.querySelector("#groupToggle"),
  status: document.querySelector("#statusFilters"),
  empty: document.querySelector("#emptyState"),
  resultCount: document.querySelector("#resultCount"),
  resultsTitle: document.querySelector("#resultsTitle"),
  collectionText: document.querySelector("#collectionText"),
  masteryText: document.querySelector("#masteryText"),
  collectionBar: document.querySelector("#collectionBar"),
  masteryBar: document.querySelector("#masteryBar"),
  collectionPercent: document.querySelector("#collectionPercent"),
  masteryPercent: document.querySelector("#masteryPercent"),
  missingCount: document.querySelector("#missingCount"),
  shareButton: document.querySelector("#shareButton"),
  shareDialog: document.querySelector("#shareDialog"),
  shareUrl: document.querySelector("#shareUrl"),
  copyButton: document.querySelector("#copyShareButton"),
  copyStatus: document.querySelector("#copyStatus")
};

function defaultProgress() {
  return Object.fromEntries(SPRITES.map(sprite => [
    sprite.id,
    { owned: false, mastered: false, favorite: false }
  ]));
}

function loadProgress() {
  const defaults = defaultProgress();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    return Object.fromEntries(
      Object.entries(defaults).map(([id, value]) => [id, { ...value, ...(saved[id] || {}) }])
    );
  } catch {
    return defaults;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function initializeFromSharedUrl() {
  const params = new URLSearchParams(window.location.search);
  const shared = params.get("c");
  if (!shared) return;
  try {
    const decoded = JSON.parse(atob(shared));
    for (const sprite of SPRITES) {
      if (decoded[sprite.id]) {
        state.progress[sprite.id] = {
          ...state.progress[sprite.id],
          owned: Boolean(decoded[sprite.id].o),
          mastered: Boolean(decoded[sprite.id].m)
        };
      }
    }
  } catch {
    console.warn("No se pudo abrir la colección compartida.");
  }
}

function populateThemes() {
  [...new Set(SPRITES.map(sprite => sprite.theme))]
    .sort((a, b) => a.localeCompare(b, "es"))
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
      sprite.theme.toLocaleLowerCase("es").includes(query);

    const matchesTheme = state.theme === "all" || sprite.theme === state.theme;
    const matchesStatus =
      state.status === "all" ||
      (state.status === "owned" && item.owned) ||
      (state.status === "missing" && !item.owned) ||
      (state.status === "mastered" && item.mastered);

    return matchesText && matchesTheme && matchesStatus;
  });
}

function render() {
  const sprites = filteredSprites();
  elements.container.innerHTML = "";
  elements.empty.hidden = sprites.length !== 0;
  elements.resultCount.textContent = `${sprites.length} ${sprites.length === 1 ? "resultado" : "resultados"}`;
  elements.resultsTitle.textContent = headingText();

  if (state.grouped) {
    const groups = Object.groupBy(sprites, sprite => sprite.theme);
    Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b, "es"))
      .forEach(([theme, groupSprites]) => {
        const section = document.createElement("section");
        section.className = "theme-section";
        const title = document.createElement("h3");
        title.className = "theme-header";
        title.innerHTML = `${theme} <small>${groupSprites.length}</small>`;
        const grid = document.createElement("div");
        grid.className = "sprite-grid";
        groupSprites.forEach(sprite => grid.append(createCard(sprite)));
        section.append(title, grid);
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

function headingText() {
  const labels = {
    all: "Todos los Sprites",
    owned: "Sprites que tengo",
    missing: "Sprites que me faltan",
    mastered: "Sprites dominados"
  };
  return state.theme === "all" ? labels[state.status] : `${labels[state.status]} · ${state.theme}`;
}

function createCard(sprite) {
  const fragment = elements.template.content.cloneNode(true);
  const card = fragment.querySelector(".sprite-card");
  const item = state.progress[sprite.id];
  card.dataset.id = sprite.id;
  card.style.setProperty("--sprite-accent", sprite.accent);
  card.classList.toggle("is-owned", item.owned);

  fragment.querySelector(".sprite-glyph").textContent = sprite.glyph;
  fragment.querySelector(".sprite-rarity").textContent = sprite.rarity;
  fragment.querySelector(".sprite-theme").textContent = sprite.theme;
  fragment.querySelector(".sprite-name").textContent = sprite.name;
  fragment.querySelector(".sprite-description").textContent = sprite.description;

  const favorite = fragment.querySelector(".favorite-button");
  favorite.textContent = item.favorite ? "★" : "☆";
  favorite.classList.toggle("active", item.favorite);
  favorite.addEventListener("click", () => {
    item.favorite = !item.favorite;
    saveProgress();
    render();
  });

  const collection = fragment.querySelector(".collection-button");
  collection.textContent = item.owned ? "✓ Lo tengo" : "+ Agregar";
  collection.classList.toggle("active", item.owned);
  collection.addEventListener("click", () => {
    item.owned = !item.owned;
    if (!item.owned) item.mastered = false;
    saveProgress();
    render();
  });

  const mastery = fragment.querySelector(".mastery-button");
  mastery.textContent = item.mastered ? "★ Dominado" : "Dominar";
  mastery.classList.toggle("active", item.mastered);
  mastery.disabled = !item.owned;
  mastery.addEventListener("click", () => {
    if (!item.owned) return;
    item.mastered = !item.mastered;
    saveProgress();
    render();
  });

  return fragment;
}

function updateStats() {
  const total = SPRITES.length;
  const owned = SPRITES.filter(sprite => state.progress[sprite.id].owned).length;
  const mastered = SPRITES.filter(sprite => state.progress[sprite.id].mastered).length;
  const collectionPct = total ? Math.round((owned / total) * 100) : 0;
  const masteryPct = total ? Math.round((mastered / total) * 100) : 0;

  elements.collectionText.textContent = `${owned} / ${total}`;
  elements.masteryText.textContent = `${mastered} / ${total}`;
  elements.collectionBar.style.width = `${collectionPct}%`;
  elements.masteryBar.style.width = `${masteryPct}%`;
  elements.collectionPercent.textContent = `${collectionPct}% completado`;
  elements.masteryPercent.textContent = `${masteryPct}% dominado`;
  elements.missingCount.textContent = `${total - owned} ${total - owned === 1 ? "Sprite" : "Sprites"}`;
}

function createShareUrl() {
  const compact = {};
  for (const sprite of SPRITES) {
    const item = state.progress[sprite.id];
    if (item.owned || item.mastered) compact[sprite.id] = { o: item.owned ? 1 : 0, m: item.mastered ? 1 : 0 };
  }
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("c", btoa(JSON.stringify(compact)));
  return url.toString();
}

elements.search.addEventListener("input", event => {
  state.search = event.target.value;
  render();
});

elements.theme.addEventListener("change", event => {
  state.theme = event.target.value;
  render();
});

elements.group.addEventListener("change", event => {
  state.grouped = event.target.checked;
  render();
});

elements.status.addEventListener("click", event => {
  const button = event.target.closest("button[data-status]");
  if (!button) return;
  state.status = button.dataset.status;
  elements.status.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
  render();
});

elements.shareButton.addEventListener("click", () => {
  elements.shareUrl.value = createShareUrl();
  elements.copyStatus.textContent = "";
  elements.shareDialog.showModal();
});

elements.copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(elements.shareUrl.value);
    elements.copyStatus.textContent = "Enlace copiado.";
  } catch {
    elements.shareUrl.select();
    document.execCommand("copy");
    elements.copyStatus.textContent = "Enlace copiado.";
  }
});

populateThemes();
initializeFromSharedUrl();
render();
