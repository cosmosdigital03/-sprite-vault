const LOBBY_HACK_STORAGE_KEY = "spriteVaultLobbyHackStatusV1";
const LOBBY_HACK_FILTER_KEY = "spriteVaultLobbyHackFilterV1";

const lobbyHackState = {
  used: loadUsedLobbyHacks(),
  filter: loadLobbyHackFilter()
};

function loadUsedLobbyHacks() {
  try {
    const value = JSON.parse(localStorage.getItem(LOBBY_HACK_STORAGE_KEY));
    return new Set(Array.isArray(value) ? value : []);
  } catch {
    return new Set();
  }
}

function saveUsedLobbyHacks() {
  localStorage.setItem(LOBBY_HACK_STORAGE_KEY, JSON.stringify([...lobbyHackState.used]));
}

function loadLobbyHackFilter() {
  const value = localStorage.getItem(LOBBY_HACK_FILTER_KEY);
  return ["all", "unused", "used"].includes(value) ? value : "unused";
}

function setLobbyHackFilter(filter) {
  lobbyHackState.filter = filter;
  localStorage.setItem(LOBBY_HACK_FILTER_KEY, filter);
  renderLobbyHacks();
}

function toggleLobbyHack(code) {
  if (lobbyHackState.used.has(code)) lobbyHackState.used.delete(code);
  else lobbyHackState.used.add(code);
  saveUsedLobbyHacks();
  renderLobbyHacks();
}

function setAllLobbyHacks(used) {
  lobbyHackState.used = used
    ? new Set(LOBBY_HACKS.map(item => item.code))
    : new Set();
  saveUsedLobbyHacks();
  renderLobbyHacks();
}

function fallbackCopyLobbyHack(text) {
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  try { document.execCommand("copy"); } catch {}
  input.remove();
}

async function copyLobbyHack(text, button) {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else fallbackCopyLobbyHack(text);
  } catch {
    fallbackCopyLobbyHack(text);
  }

  const original = button.textContent;
  button.textContent = "Copiado ✓";
  button.classList.add("is-copied");
  window.setTimeout(() => {
    button.textContent = original;
    button.classList.remove("is-copied");
  }, 1200);
}

function createLobbyHackRow(item) {
  const used = lobbyHackState.used.has(item.code);
  const row = document.createElement("article");
  row.className = `hack-row ${used ? "is-used" : "is-unused"}`;

  const main = document.createElement("div");
  main.className = "hack-main";

  const codeButton = document.createElement("button");
  codeButton.type = "button";
  codeButton.className = "hack-code";
  codeButton.textContent = item.code;
  codeButton.title = "Toca para copiar";
  codeButton.addEventListener("click", () => copyLobbyHack(item.code, codeButton));

  const reward = document.createElement("div");
  reward.className = "hack-reward";
  const rewardStrong = document.createElement("strong");
  rewardStrong.textContent = item.reward;
  const source = document.createElement("small");
  source.textContent = `Fuente: ${item.source}`;
  reward.append(rewardStrong, source);
  main.append(codeButton, reward);

  const actions = document.createElement("div");
  actions.className = "hack-actions";

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "hack-action hack-copy";
  copyButton.textContent = "Copiar";
  copyButton.addEventListener("click", () => copyLobbyHack(item.code, copyButton));

  const usedButton = document.createElement("button");
  usedButton.type = "button";
  usedButton.className = `hack-action hack-state ${used ? "used" : "unused"}`;
  usedButton.textContent = used ? "✓ Usado" : "No usado";
  usedButton.setAttribute("aria-pressed", String(used));
  usedButton.addEventListener("click", () => toggleLobbyHack(item.code));

  actions.append(copyButton, usedButton);
  row.append(main, actions);
  return row;
}

function renderLobbyHacks() {
  const list = document.getElementById("hackList");
  const filters = document.getElementById("hackFilters");
  if (!list) return;

  const total = LOBBY_HACKS.length;
  const usedCount = LOBBY_HACKS.filter(item => lobbyHackState.used.has(item.code)).length;
  const unusedCount = total - usedCount;

  document.getElementById("hackUsedCount").textContent = usedCount;
  document.getElementById("hackUnusedCount").textContent = unusedCount;
  document.getElementById("hackTotalCount").textContent = total;
  document.getElementById("hackProgressText").textContent = `${usedCount} usados de ${total}`;

  const progress = total ? Math.round((usedCount / total) * 100) : 0;
  document.getElementById("hackProgressFill").style.width = `${progress}%`;

  filters?.querySelectorAll("button[data-filter]").forEach(button => {
    const active = button.dataset.filter === lobbyHackState.filter;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const allCount = document.getElementById("filterAllCount");
  const unusedBadge = document.getElementById("filterUnusedCount");
  const usedBadge = document.getElementById("filterUsedCount");
  if (allCount) allCount.textContent = total;
  if (unusedBadge) unusedBadge.textContent = unusedCount;
  if (usedBadge) usedBadge.textContent = usedCount;

  const visible = LOBBY_HACKS.filter(item => {
    const used = lobbyHackState.used.has(item.code);
    if (lobbyHackState.filter === "used") return used;
    if (lobbyHackState.filter === "unused") return !used;
    return true;
  });

  list.innerHTML = "";

  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "hack-empty";
    empty.innerHTML = lobbyHackState.filter === "unused"
      ? "<strong>¡Ya usaste todos los códigos!</strong><span>Puedes verlos otra vez en la pestaña Usados.</span>"
      : "<strong>No hay códigos aquí.</strong>";
    list.append(empty);
    return;
  }

  for (const category of LOBBY_HACK_CATEGORIES) {
    const items = visible.filter(item => item.category === category.id);
    if (!items.length) continue;

    const section = document.createElement("section");
    section.className = "hack-category";

    const heading = document.createElement("header");
    heading.className = "hack-category-heading";
    const title = document.createElement("h2");
    title.textContent = category.label;
    const count = document.createElement("span");
    count.textContent = `${items.length}`;
    heading.append(title, count);

    const rows = document.createElement("div");
    rows.className = "hack-rows";
    items.forEach(item => rows.append(createLobbyHackRow(item)));

    section.append(heading, rows);
    list.append(section);
  }
}

document.getElementById("hackFilters")?.addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (button) setLobbyHackFilter(button.dataset.filter);
});

document.getElementById("markAllUsed")?.addEventListener("click", () => setAllLobbyHacks(true));
document.getElementById("markAllUnused")?.addEventListener("click", () => setAllLobbyHacks(false));

renderLobbyHacks();
