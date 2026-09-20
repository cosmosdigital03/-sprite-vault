/* Sprite Vault — legacy Gold lock/release treatment removed */
(() => {
  "use strict";

  function cleanupLegacyGoldLock() {
    document.querySelectorAll(
      ".sv-gold-code-veil, .sv-gold-lock-chip, .sv-gold-release, .sv-gold-detail-release, .sv-gold-capture-chip"
    ).forEach(element => element.remove());

    document.querySelectorAll(
      ".sv-gold-locked, .sv-gold-detail-active, .sv-gold-detail-visual, .sv-gold-capture-locked"
    ).forEach(element => {
      element.classList.remove(
        "sv-gold-locked",
        "sv-gold-detail-active",
        "sv-gold-detail-visual",
        "sv-gold-capture-locked"
      );
    });

    document.querySelectorAll("[data-sv-gold-release]").forEach(element => {
      delete element.dataset.svGoldRelease;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cleanupLegacyGoldLock, { once: true });
  } else {
    cleanupLegacyGoldLock();
  }

  requestAnimationFrame(cleanupLegacyGoldLock);
  setTimeout(cleanupLegacyGoldLock, 250);
  setTimeout(cleanupLegacyGoldLock, 1000);
})();
