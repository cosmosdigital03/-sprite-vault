/* Sprite Vault — Fortnite.gg image compatibility for Override capture view */
(() => {
  "use strict";

  const SELECTOR = ".sv-split-tile img";

  function isFortniteGgImage(image) {
    if (!image) return false;
    const src = image.getAttribute("src") || image.src || "";
    try {
      return new URL(src, location.href).hostname === "fortnite.gg";
    } catch {
      return src.includes("fortnite.gg/");
    }
  }

  function reloadWithoutCors(image) {
    if (!isFortniteGgImage(image) || image.dataset.svFortniteGgFix === "1") return;

    const src = image.getAttribute("src") || image.src;
    if (!src) return;

    image.dataset.svFortniteGgFix = "1";

    // The main tracker can display these images normally. The split capture
    // view was forcing anonymous CORS, which makes Fortnite.gg images fail.
    image.removeAttribute("crossorigin");
    image.removeAttribute("referrerpolicy");

    // Restart the request after removing the CORS mode.
    image.removeAttribute("src");
    requestAnimationFrame(() => {
      image.src = src;
    });
  }

  function fixImages(root = document) {
    if (root.matches?.(SELECTOR)) reloadWithoutCors(root);
    root.querySelectorAll?.(SELECTOR).forEach(reloadWithoutCors);
  }

  const originalRenderCaptureView = window.renderCaptureView;
  if (typeof originalRenderCaptureView === "function" && !originalRenderCaptureView.__svFortniteGgFix) {
    const wrappedRenderCaptureView = function(...args) {
      const result = originalRenderCaptureView.apply(this, args);
      requestAnimationFrame(() => fixImages(document));
      return result;
    };
    wrappedRenderCaptureView.__svFortniteGgFix = true;
    window.renderCaptureView = wrappedRenderCaptureView;
  }

  const target = document.getElementById("captureGrid") || document.body;
  new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) fixImages(node);
      }
    }
  }).observe(target, { childList: true, subtree: true });

  fixImages(document);
})();
