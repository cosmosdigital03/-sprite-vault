// Sprite Vault — season navigation for Runners (previous) and Override (current).
(() => {
  const SEASON_STORAGE_KEY = "spriteVaultSeasonV1";
  const CURRENT_SEASON = "Override";
  const PREVIOUS_SEASON = "Runners";

  if (typeof SPRITES === "undefined" || typeof state === "undefined") return;

  const savedSeason = localStorage.getItem(SEASON_STORAGE_KEY);
  state.season = [CURRENT_SEASON, PREVIOUS_SEASON, "all"].includes(savedSeason)
    ? savedSeason
    : CURRENT_SEASON;

  // Give Cheat Master variants their own visual identity while retaining the Vault style.
  if (typeof THEME_VISUALS !== "undefined") {
    THEME_VISUALS["Cheat Master"] = {
      accent: "rgba(255,87,205,.92)",
      overlay: "linear-gradient(165deg,rgba(87,26,104,.52),rgba(16,9,33,.78))",
      overlayHover: "linear-gradient(165deg,rgba(120,38,140,.18),rgba(31,13,54,.26))",
      border: "rgba(255,112,220,.34)",
      shadow: "rgba(134,40,153,.34)"
    };
  }

  const baseFilteredSprites = filteredSprites;
  filteredSprites = function filteredSpritesBySeason() {
    return baseFilteredSprites().filter(sprite =>
      state.season === "all" || (sprite.season || PREVIOUS_SEASON) === state.season
    );
  };

  const baseHeadingText = headingText;
  headingText = function headingTextBySeason() {
    const base = baseHeadingText();
    if (state.season === CURRENT_SEASON) return `${base} · Override`;
    if (state.season === PREVIOUS_SEASON) return `${base} · Runners`;
    return base;
  };

  const baseCreateCard = createCard;
  createCard = function createSeasonCard(sprite) {
    const fragment = baseCreateCard(sprite);
    const visual = fragment.querySelector(".sprite-visual");

    if (visual) {
      const badge = document.createElement("span");
      const season = sprite.season || PREVIOUS_SEASON;
      badge.className = `season-badge season-${season.toLowerCase()}`;
      badge.textContent = season === CURRENT_SEASON ? "OVERRIDE" : "RUNNERS";
      visual.append(badge);
    }

    return fragment;
  };

  const seasonFilters = document.getElementById("seasonFilters");

  function refreshSeasonButtons() {
    seasonFilters?.querySelectorAll("[data-season]").forEach(button => {
      button.classList.toggle("active", button.dataset.season === state.season);
      button.setAttribute("aria-pressed", String(button.dataset.season === state.season));
    });
  }

  seasonFilters?.addEventListener("click", event => {
    const button = event.target.closest("button[data-season]");
    if (!button) return;

    state.season = button.dataset.season;
    localStorage.setItem(SEASON_STORAGE_KEY, state.season);
    refreshSeasonButtons();
    render();
  });

  // The existing reset clears status/theme/search. This also clears the season filter.
  document.getElementById("resetFilters")?.addEventListener("click", () => {
    state.season = "all";
    localStorage.setItem(SEASON_STORAGE_KEY, state.season);
    refreshSeasonButtons();
    queueMicrotask(render);
  });

  const styles = document.createElement("style");
  styles.textContent = `
    .season-filter-group {
      flex: 1 1 100%;
      padding: 14px;
      border: 1px solid rgba(112,232,255,.12);
      border-radius: 18px;
      background: linear-gradient(135deg,rgba(15,24,42,.78),rgba(12,13,25,.65));
    }

    .season-segmented {
      display: grid;
      grid-template-columns: repeat(3,minmax(0,1fr));
      gap: 8px;
      width: min(100%,760px);
    }

    .season-segmented button {
      min-height: 44px;
      border-radius: 12px;
    }

    .season-segmented button[data-season="Override"].active {
      border-color: rgba(69,224,255,.68);
      box-shadow: 0 0 0 1px rgba(69,224,255,.16),0 0 24px rgba(45,205,255,.12);
    }

    .season-segmented button[data-season="Runners"].active {
      border-color: rgba(173,117,255,.58);
      box-shadow: 0 0 0 1px rgba(173,117,255,.12),0 0 24px rgba(126,78,219,.11);
    }

    .season-badge {
      position: absolute;
      left: 9px;
      bottom: 9px;
      z-index: 6;
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      padding: 3px 7px;
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 999px;
      background: rgba(5,8,17,.78);
      color: rgba(255,255,255,.9);
      font: 800 9px/1 Inter,sans-serif;
      letter-spacing: .08em;
      backdrop-filter: blur(7px);
      pointer-events: none;
    }

    .season-badge.season-override {
      color: #82efff;
      border-color: rgba(82,224,255,.36);
    }

    .season-badge.season-runners {
      color: #c9adff;
      border-color: rgba(169,125,255,.3);
    }

    @media (max-width: 620px) {
      .season-segmented { grid-template-columns: 1fr; }
      .season-segmented button { min-height: 42px; }
    }
  `;
  document.head.append(styles);

  refreshSeasonButtons();
  render();
})();
