const STORAGE_KEY = "spriteVaultProgressV4";
const PROFILE_KEY = "spriteVaultProfileV1";

const THEME_VISUALS = {
  "Básico": { accent:"rgba(72,217,255,.72)", overlay:"linear-gradient(165deg,rgba(12,59,87,.40),rgba(11,18,33,.68))", overlayHover:"linear-gradient(165deg,rgba(12,59,87,.16),rgba(11,18,33,.22))", border:"rgba(72,217,255,.24)", shadow:"rgba(31,128,173,.26)" },
  "Dorado": { accent:"rgba(255,205,90,.86)", overlay:"linear-gradient(165deg,rgba(119,83,0,.48),rgba(38,24,4,.70))", overlayHover:"linear-gradient(165deg,rgba(119,83,0,.12),rgba(38,24,4,.18))", border:"rgba(255,205,90,.28)", shadow:"rgba(166,113,0,.28)" },
  "Gomita": { accent:"rgba(255,118,193,.82)", overlay:"linear-gradient(165deg,rgba(147,34,92,.40),rgba(41,11,45,.68))", overlayHover:"linear-gradient(165deg,rgba(147,34,92,.14),rgba(41,11,45,.20))", border:"rgba(255,118,193,.25)", shadow:"rgba(129,35,85,.28)" },
  "Galaxia": { accent:"rgba(132,116,255,.88)", overlay:"linear-gradient(165deg,rgba(62,38,143,.48),rgba(8,14,41,.74))", overlayHover:"linear-gradient(165deg,rgba(62,38,143,.12),rgba(8,14,41,.20))", border:"rgba(132,116,255,.28)", shadow:"rgba(71,52,154,.28)" },
  "Gema": { accent:"rgba(63,230,165,.84)", overlay:"linear-gradient(165deg,rgba(8,102,70,.40),rgba(8,27,26,.70))", overlayHover:"linear-gradient(165deg,rgba(8,102,70,.12),rgba(8,27,26,.20))", border:"rgba(63,230,165,.25)", shadow:"rgba(16,113,82,.28)" },
  "Holográfico": { accent:"rgba(104,236,255,.86)", overlay:"linear-gradient(165deg,rgba(90,48,189,.32),rgba(12,40,72,.62))", overlayHover:"linear-gradient(165deg,rgba(90,48,189,.10),rgba(12,40,72,.18))", border:"rgba(104,236,255,.26)", shadow:"rgba(58,145,175,.30)" }
};

const state = {
  search: "",
  status: "all",
  theme: "all",
  grouped: true,
  progress: loadProgress(),
  profile: loadProfile(),
  selectedSpriteId: null,
  publicProfile: null
};

const elements = Object.fromEntries([
  "spriteContainer","spriteCardTemplate","searchInput","themeSelect","groupToggle","statusFilters",
  "emptyState","resultCount","resultsTitle","collectionText","masteryText","collectionBar","masteryBar",
  "collectionPercent","masteryPercent","missingCount","shareButton","shareDialog","shareUrl",
  "copyShareButton","copyStatus","heroSummary","countAll","countOwned","countMissing","countMastered",
  "countUnmastered","progressRing","progressCircleValue","progressHeadline","progressSummary","resetFilters",
  "profileName","discordUsername","previewName","previewDiscord","previewOwned","previewMastered",
  "previewPercent","spriteDialog","closeSpriteDialog","detailVisual","detailImage","detailNewBadge",
  "detailTheme","detailName","detailOriginalName","detailRarity","detailFindRate","rarityExplanation",
  "detailOwnedButton","detailMasteryButton"
].map(id => [id, document.querySelector(`#${id}`)]));

elements.container = elements.spriteContainer;
elements.template = elements.spriteCardTemplate;
elements.search = elements.searchInput;
elements.theme = elements.themeSelect;
elements.group = elements.groupToggle;
elements.status = elements.statusFilters;
elements.empty = elements.emptyState;
elements.copyButton = elements.copyShareButton;

function defaultProgress() {
  return Object.fromEntries(SPRITES.map(sprite => [sprite.id, { owned:false, mastered:false, favorite:false }]));
}

function loadProgress() {
  const defaults = defaultProgress();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    return Object.fromEntries(Object.entries(defaults).map(([id,value]) => [id,{...value,...(saved[id]||{})}]));
  } catch { return defaults; }
}

function loadProfile() {
  try { return { name:"", discord:"", ...(JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}) }; }
  catch { return { name:"", discord:"" }; }
}

function saveProgress() {
  if (!state.publicProfile) localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function saveProfile() {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile));
}

function bitsToHex(predicate) {
  let bits = SPRITES.map(sprite => predicate(state.progress[sprite.id]) ? "1" : "0").join("");
  bits = bits.padEnd(Math.ceil(bits.length / 4) * 4, "0");
  return Array.from({length:bits.length/4}, (_,i) => parseInt(bits.slice(i*4,i*4+4),2).toString(16)).join("");
}

function hexToIds(hex) {
  const bits = [...hex].map(char => parseInt(char,16).toString(2).padStart(4,"0")).join("");
  return new Set(SPRITES.filter((_,i) => bits[i] === "1").map(sprite => sprite.id));
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
  state.profile = {...state.publicProfile};
  state.progress = defaultProgress();

  for (const sprite of SPRITES) {
    state.progress[sprite.id].owned = ownedIds.has(sprite.id);
    state.progress[sprite.id].mastered = masteredIds.has(sprite.id);
  }

  document.body.classList.add("public-view");
  elements.heroSummary.textContent = `Colección pública de ${state.publicProfile.name}`;
}

function populateThemes() {
  [...new Set(SPRITES.map(sprite => sprite.theme))].sort((a,b)=>a.localeCompare(b,"es")).forEach(theme => {
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
      (state.status === "owned" && item.owned) ||
      (state.status === "missing" && !item.owned) ||
      (state.status === "mastered" && item.mastered) ||
      (state.status === "unmastered" && item.owned && !item.mastered);
    return matchesText && matchesTheme && matchesStatus;
  });
}

function groupSprites(sprites) {
  return sprites.reduce((groups,sprite) => ((groups[sprite.theme] ||= []).push(sprite), groups), {});
}

function applyThemeVisuals(card, theme) {
  const visuals = THEME_VISUALS[theme] || THEME_VISUALS["Básico"];
  for (const [key,value] of Object.entries({
    "--theme-accent":visuals.accent, "--theme-overlay":visuals.overlay,
    "--theme-overlay-hover":visuals.overlayHover, "--theme-border":visuals.border,
    "--theme-shadow":visuals.shadow
  })) card.style.setProperty(key,value);
}

function render() {
  const sprites = filteredSprites();
  elements.container.innerHTML = "";
  elements.empty.hidden = sprites.length !== 0;
  elements.resultCount.textContent = `${sprites.length} ${sprites.length === 1 ? "resultado" : "resultados"}`;
  elements.resultsTitle.textContent = headingText();

  if (state.grouped) {
    Object.entries(groupSprites(sprites)).sort(([a],[b])=>a.localeCompare(b,"es")).forEach(([theme,list]) => {
      const section = document.createElement("section");
      section.className = "theme-section";
      const title = document.createElement("h3");
      title.className = "theme-header";
      const text = document.createElement("span"); text.textContent = theme;
      const count = document.createElement("small"); count.textContent = list.length;
      title.append(text,count);
      const grid = document.createElement("div"); grid.className = "sprite-grid";
      list.forEach(sprite => grid.append(createCard(sprite)));
      section.append(title,grid); elements.container.append(section);
    });
  } else {
    const grid = document.createElement("div"); grid.className = "sprite-grid";
    sprites.forEach(sprite => grid.append(createCard(sprite)));
    elements.container.append(grid);
  }
  updateStats();
}

function headingText() {
  const labels = {
    all:"Todos los Sprites", owned:"Sprites que tengo", missing:"Sprites que me faltan",
    mastered:"Sprites dominados", unmastered:"Sprites sin dominar"
  };
  return state.theme === "all" ? labels[state.status] : `${labels[state.status]} · ${state.theme}`;
}

function createCard(sprite) {
  const fragment = elements.template.content.cloneNode(true);
  const card = fragment.querySelector(".sprite-card");
  const item = state.progress[sprite.id];
  card.dataset.id = sprite.id;
  card.classList.toggle("is-owned", item.owned);
  applyThemeVisuals(card,sprite.theme);

  const image = fragment.querySelector(".sprite-image");
  image.src = sprite.image; image.alt = sprite.name;
  image.addEventListener("error",()=>image.classList.add("image-error"));

  fragment.querySelector(".sprite-rarity").textContent = sprite.rarity;
  fragment.querySelector(".sprite-theme").textContent = sprite.theme;
  fragment.querySelector(".sprite-name").textContent = sprite.name;
  fragment.querySelector(".sprite-original-name").textContent = sprite.originalName;
  fragment.querySelector(".new-badge").hidden = !sprite.isNew;

  const visual = fragment.querySelector(".sprite-visual");
  visual.tabIndex = 0;
  visual.setAttribute("role","button");
  visual.setAttribute("aria-label",`Ver detalles de ${sprite.name}`);
  visual.addEventListener("click",()=>openSpriteDetail(sprite.id));
  visual.addEventListener("keydown",event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openSpriteDetail(sprite.id); }
  });

  const favorite = fragment.querySelector(".favorite-button");
  favorite.textContent = item.favorite ? "★" : "☆";
  favorite.classList.toggle("active",item.favorite);
  favorite.addEventListener("click",event => {
    event.stopPropagation(); item.favorite = !item.favorite; saveProgress(); render();
  });

  const collection = fragment.querySelector(".collection-button");
  collection.textContent = item.owned ? "✓ Lo tengo" : "+ Agregar";
  collection.classList.toggle("active",item.owned);
  collection.disabled = Boolean(state.publicProfile);
  collection.addEventListener("click",()=>toggleOwned(sprite.id));

  const mastery = fragment.querySelector(".mastery-button");
  mastery.textContent = item.mastered ? "★ Dominado" : "Dominar";
  mastery.classList.toggle("active",item.mastered);
  mastery.disabled = !item.owned || Boolean(state.publicProfile);
  mastery.addEventListener("click",()=>toggleMastered(sprite.id));
  return fragment;
}

function toggleOwned(id) {
  if (state.publicProfile) return;
  const item = state.progress[id];
  item.owned = !item.owned;
  if (!item.owned) item.mastered = false;
  saveProgress(); render(); refreshDetail();
}

function toggleMastered(id) {
  if (state.publicProfile) return;
  const item = state.progress[id];
  if (!item.owned) return;
  item.mastered = !item.mastered;
  saveProgress(); render(); refreshDetail();
}

function updateStats() {
  const total = SPRITES.length;
  const owned = SPRITES.filter(s=>state.progress[s.id].owned).length;
  const mastered = SPRITES.filter(s=>state.progress[s.id].mastered).length;
  const unmastered = SPRITES.filter(s=>state.progress[s.id].owned && !state.progress[s.id].mastered).length;
  const missing = total-owned;
  const collectionPct = total ? Math.round(owned/total*100) : 0;
  const masteryPct = total ? Math.round(mastered/total*100) : 0;

  elements.collectionText.textContent = `${owned} / ${total}`;
  elements.masteryText.textContent = `${mastered} / ${total}`;
  elements.collectionBar.style.width = `${collectionPct}%`;
  elements.masteryBar.style.width = `${masteryPct}%`;
  elements.collectionPercent.textContent = `${collectionPct}% completado`;
  elements.masteryPercent.textContent = `${masteryPct}% dominado`;
  elements.missingCount.textContent = `${missing} ${missing===1?"Sprite":"Sprites"}`;

  if (!state.publicProfile) elements.heroSummary.textContent = `${total} Sprites · Español · Guardado automático`;
  elements.countAll.textContent = total;
  elements.countOwned.textContent = owned;
  elements.countMissing.textContent = missing;
  elements.countMastered.textContent = mastered;
  elements.countUnmastered.textContent = unmastered;

  elements.progressRing.style.setProperty("--progress", collectionPct);
  elements.progressCircleValue.textContent = `${collectionPct}%`;
  elements.progressHeadline.textContent =
    collectionPct === 100 ? "¡Vault completado!" :
    collectionPct >= 75 ? "Ya casi completas el Vault" :
    collectionPct >= 40 ? "Tu colección está creciendo" :
    owned > 0 ? "Buen comienzo" : "Comienza tu colección";
  elements.progressSummary.textContent = `${owned} de ${total} Sprites agregados.`;

  updateSharePreview();
}

function rarityMessage(value) {
  if (!value || value === "No disponible") return "Todavía no hay una estimación pública disponible.";
  const number = Number(value.replace("%",""));
  if (number === 0) return "La fuente muestra 0%, normalmente porque no hay suficientes registros o la variante es extremadamente reciente.";
  if (number < .00001) return "Extremadamente raro: la estimación es menor a una posibilidad entre millones.";
  if (number < .001) return "Ultra raro: aparece en una fracción diminuta de los registros.";
  if (number < .05) return "Muy raro: se encuentra en menos de 1 de cada 2,000 registros.";
  if (number < .5) return "Raro: aparece en menos de 1 de cada 200 registros.";
  if (number < 3) return "Poco común dentro del conjunto de Sprites.";
  return "Comparativamente más frecuente que las variantes especiales.";
}

function openSpriteDetail(id) {
  state.selectedSpriteId = id;
  refreshDetail();
  elements.spriteDialog.showModal();
}

function refreshDetail() {
  if (!state.selectedSpriteId) return;
  const sprite = SPRITES.find(s=>s.id===state.selectedSpriteId);
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
  elements.detailOwnedButton.textContent = item.owned ? "✓ Lo tengo" : "+ Agregar a mi colección";
  elements.detailOwnedButton.classList.toggle("active",item.owned);
  elements.detailOwnedButton.disabled = Boolean(state.publicProfile);
  elements.detailMasteryButton.textContent = item.mastered ? "★ Dominado" : "Marcar como dominado";
  elements.detailMasteryButton.classList.toggle("active",item.mastered);
  elements.detailMasteryButton.disabled = !item.owned || Boolean(state.publicProfile);
}

function resetFilters() {
  state.search = ""; state.status = "all"; state.theme = "all"; state.grouped = true;
  elements.search.value = ""; elements.theme.value = "all"; elements.group.checked = true;
  elements.status.querySelectorAll("button").forEach(btn=>btn.classList.toggle("active",btn.dataset.status==="all"));
  render();
}

function createShareUrl() {
  const url = new URL(location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("o",bitsToHex(item=>item.owned));
  url.searchParams.set("m",bitsToHex(item=>item.mastered));
  if (state.profile.name.trim()) url.searchParams.set("p",state.profile.name.trim());
  if (state.profile.discord.trim()) url.searchParams.set("d",state.profile.discord.trim().replace(/^@/,""));
  return url.toString();
}

function updateSharePreview() {
  const total = SPRITES.length;
  const owned = SPRITES.filter(s=>state.progress[s.id].owned).length;
  const mastered = SPRITES.filter(s=>state.progress[s.id].mastered).length;
  const pct = Math.round(owned/total*100);
  elements.previewName.textContent = state.profile.name.trim() || "John";
  const discord = state.profile.discord.trim().replace(/^@/,"");
  elements.previewDiscord.textContent = discord ? `@${discord}` : "@vault034";
  elements.previewOwned.textContent = owned;
  elements.previewMastered.textContent = mastered;
  elements.previewPercent.textContent = `${pct}%`;
  elements.shareUrl.value = createShareUrl();
}

elements.search.addEventListener("input",e=>{state.search=e.target.value;render();});
elements.theme.addEventListener("change",e=>{state.theme=e.target.value;render();});
elements.group.addEventListener("change",e=>{state.grouped=e.target.checked;render();});
elements.status.addEventListener("click",e=>{
  const button=e.target.closest("button[data-status]"); if(!button)return;
  state.status=button.dataset.status;
  elements.status.querySelectorAll("button").forEach(item=>item.classList.toggle("active",item===button));
  render();
});
elements.resetFilters.addEventListener("click",resetFilters);

elements.shareButton.addEventListener("click",()=>{
  elements.profileName.value=state.profile.name;
  elements.discordUsername.value=state.profile.discord;
  elements.copyStatus.textContent="";
  updateSharePreview();
  elements.shareDialog.showModal();
});
for (const input of [elements.profileName,elements.discordUsername]) {
  input.addEventListener("input",()=>{
    state.profile.name=elements.profileName.value;
    state.profile.discord=elements.discordUsername.value;
    saveProfile(); updateSharePreview();
  });
}
elements.copyButton.addEventListener("click",async()=>{
  try { await navigator.clipboard.writeText(elements.shareUrl.value); }
  catch { elements.shareUrl.select(); document.execCommand("copy"); }
  elements.copyStatus.textContent="Enlace público copiado.";
});

elements.closeSpriteDialog.addEventListener("click",()=>elements.spriteDialog.close());
elements.detailOwnedButton.addEventListener("click",()=>toggleOwned(state.selectedSpriteId));
elements.detailMasteryButton.addEventListener("click",()=>toggleMastered(state.selectedSpriteId));

populateThemes();
initializePublicProfile();
render();
