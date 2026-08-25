// Sprite Vault — legacy share flow + PNG preview in a separate tab.
// Keeps the original Compartir lista capture page intact and only changes
// generated PNG previews so the tracker/capture page never closes.
(() => {
  if (typeof buildCaptureExportCanvas !== "function" || typeof writeCapturePreviewPage !== "function") return;

  async function openGeneratedCaptureInNewTab(mode, button) {
    const previewTitle = mode === "missing"
      ? "Captura me faltan sprite"
      : mode === "unmastered"
        ? "Captura no dominado"
        : "Sprite Vault";

    // Open immediately from the user click so browsers do not block the tab.
    const previewWindow = window.open("", "_blank");
    if (!previewWindow) {
      alert("Permite las ventanas emergentes para abrir la captura completa.");
      return;
    }

    previewWindow.document.open();
    previewWindow.document.write(`<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5,user-scalable=yes">
  <meta name="theme-color" content="#05070d">
  <title>${previewTitle} | Sprite Vault</title>
  <style>
    html,body{margin:0;min-height:100%;background:#05070d;color:#fff;font-family:Arial,sans-serif}
    body{display:flex;align-items:center;justify-content:center;padding:24px}
    .loading{opacity:.72;text-align:center}
  </style>
</head>
<body><div class="loading">Generando PNG…</div></body>
</html>`);
    previewWindow.document.close();

    const originalText = button?.textContent || "";
    if (button) {
      button.disabled = true;
      button.textContent = "Generando...";
    }

    try {
      const result = await buildCaptureExportCanvas(mode);
      if (!result) {
        if (!previewWindow.closed) previewWindow.close();
        return;
      }

      const blob = await new Promise(resolve => result.canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("The capture image could not be created.");

      const imageUrl = URL.createObjectURL(blob);
      writeCapturePreviewPage(
        previewWindow,
        imageUrl,
        result.title,
        result.canvas.width
      );

      // Keep the URL alive while the new tab displays it. Revoke it after the
      // preview tab closes, without affecting the original tracker page.
      previewWindow.addEventListener("beforeunload", () => {
        window.setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
      }, { once: true });
    } catch (error) {
      console.error(error);
      if (!previewWindow.closed) previewWindow.close();
      alert("No se pudo generar la captura.");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  }

  // app.js calls this global function from the existing capture buttons.
  window.openGeneratedCapture = openGeneratedCaptureInNewTab;
  try {
    openGeneratedCapture = openGeneratedCaptureInNewTab;
  } catch (_) {
    // window assignment above is sufficient in normal classic-script loading.
  }
})();
