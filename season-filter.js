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

  // Give the Override-only finishes their own visual identity.
  // Explicit unreleased flags are never changed here.
  if (typeof THEME_VISUALS !== "undefined") {
    THEME_VISUALS["Cheat Master"] = {
      accent: "rgba(255,87,205,.92)",
      overlay: "linear-gradient(165deg,rgba(87,26,104,.52),rgba(16,9,33,.78))",
      overlayHover: "linear-gradient(165deg,rgba(120,38,140,.18),rgba(31,13,54,.26))",
      border: "rgba(255,112,220,.34)",
      shadow: "rgba(134,40,153,.34)"
    };
    THEME_VISUALS["Loot Hacker"] = {
      accent: "rgba(91,255,178,.92)",
      overlay: "linear-gradient(165deg,rgba(20,102,72,.52),rgba(6,30,29,.78))",
      overlayHover: "linear-gradient(165deg,rgba(34,139,96,.18),rgba(10,48,43,.26))",
      border: "rgba(91,255,178,.34)",
      shadow: "rgba(35,148,99,.32)"
    };
    THEME_VISUALS["Bounty Hunter"] = {
      accent: "rgba(255,178,72,.94)",
      overlay: "linear-gradient(165deg,rgba(116,65,17,.54),rgba(36,20,8,.8))",
      overlayHover: "linear-gradient(165deg,rgba(153,86,22,.2),rgba(55,29,10,.28))",
      border: "rgba(255,178,72,.36)",
      shadow: "rgba(166,92,25,.34)"
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

      if (sprite.unreleased === true) {
        const upcoming = document.createElement("span");
        upcoming.className = "unreleased-badge";
        upcoming.textContent = "NO LANZADO";
        visual.append(upcoming);
      }
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

    .unreleased-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 7;
      padding: 5px 8px;
      border: 1px solid rgba(255,190,93,.48);
      border-radius: 999px;
      background: rgba(25,15,5,.88);
      color: #ffd28a;
      font: 900 9px/1 Inter,sans-serif;
      letter-spacing: .08em;
      backdrop-filter: blur(7px);
      pointer-events: none;
    }

    .sprite-card.is-unreleased .sprite-image {
      filter: saturate(.58) brightness(.76);
    }

    .sprite-card.is-unreleased {
      border-color: rgba(255,190,93,.18);
    }

    .sprite-card.is-unreleased .collection-button,
    .sprite-card.is-unreleased .mastery-button {
      opacity: .55;
      cursor: not-allowed;
    }

    .new-status-label.unreleased {
      background: rgba(63,37,10,.9);
      border-color: rgba(255,190,93,.38);
      color: #ffd28a;
    }

    @media (max-width: 620px) {
      .season-segmented { grid-template-columns: 1fr; }
      .season-segmented button { min-height: 42px; }
    }
  `;
  document.head.append(styles);

  refreshSeasonButtons();
  render();

  // Preserve the old Compartir lista/capture screen. Only override the final
  // PNG preview so it opens in a second tab/page and leaves the tracker open.
  if (!document.querySelector("script[data-sprite-vault-share-newtab]")) {
    const shareScript = document.createElement("script");
    shareScript.src = "share-newtab.js?v=13.1";
    shareScript.dataset.spriteVaultShareNewtab = "true";
    document.body.append(shareScript);
  }
})();
