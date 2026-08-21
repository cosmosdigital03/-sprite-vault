/* Sprite Vault V13 capture reliability hotfix
   Ensure externally hosted Override/Cheat images are CORS-safe before drawing to canvas. */
(() => {
  "use strict";

  if (typeof loadCaptureImage !== "function" || loadCaptureImage.__sv13CorsSafe) return;

  const corsSafeLoader = function(source) {
    return new Promise(resolve => {
      const image = new Image();

      // Must be assigned before src. raw.githubusercontent.com currently permits CORS,
      // so this keeps the canvas origin-clean when Override sprites are exported.
      if (/^https?:\/\//i.test(source)) {
        image.crossOrigin = "anonymous";
        image.referrerPolicy = "no-referrer";
      }

      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = source;
    });
  };

  corsSafeLoader.__sv13CorsSafe = true;
  loadCaptureImage = corsSafeLoader;
})();
