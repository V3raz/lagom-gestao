// ============================================================
// LAGOM GESTÃO — Scanner de Código de Barras
// Usa html5-qrcode: funciona em iOS Safari, Android, Chrome,
// Samsung Internet — qualquer browser com câmera.
// ============================================================

/**
 * Abre overlay de câmera e detecta códigos de barras/QR.
 * @param {(codigo: string) => void} onResult  Callback com o código detectado.
 */
export async function abrirScanner(onResult) {
  // Monta overlay
  const overlay = document.createElement("div");
  overlay.className = "scanner-overlay";
  overlay.innerHTML = `
    <div class="scanner-box">
      <div class="scanner-header">
        <span class="scanner-titulo">Escanear Código</span>
        <button class="scanner-fechar btn-icon" title="Fechar">&times;</button>
      </div>
      <div id="qr-reader" style="width:100%;max-width:380px;margin:0 auto"></div>
      <p class="scanner-status" id="qr-status">Iniciando câmera...</p>
    </div>`;
  document.body.appendChild(overlay);

  let html5QrCode = null;
  let encerrado = false;

  function encerrar() {
    if (encerrado) return;
    encerrado = true;
    if (html5QrCode) {
      html5QrCode.stop()
        .catch(() => {})
        .finally(() => { html5QrCode.clear(); overlay.remove(); });
    } else {
      overlay.remove();
    }
  }

  overlay.querySelector(".scanner-fechar").addEventListener("click", encerrar);
  overlay.addEventListener("click", e => { if (e.target === overlay) encerrar(); });

  // Verifica se a biblioteca carregou (está no index.html via CDN)
  if (typeof Html5Qrcode === "undefined") {
    document.getElementById("qr-status").textContent =
      "Erro: recarregue a página e tente novamente.";
    return;
  }

  try {
    html5QrCode = new Html5Qrcode("qr-reader");

    await html5QrCode.start(
      { facingMode: "environment" },           // câmera traseira
      { fps: 10, qrbox: { width: 240, height: 140 } },
      (codigo) => { encerrar(); onResult(codigo); },  // sucesso
      () => {}                                        // ignora erros de frame
    );

    document.getElementById("qr-status").textContent =
      "Aponte a câmera para o código de barras...";

  } catch (err) {
    // Fallback manual se câmera for negada ou indisponível
    _mostrarFallback(overlay, onResult);
  }
}

// ── Fallback: input manual ────────────────────────────────────────────────────
function _mostrarFallback(overlay, onResult) {
  overlay.querySelector(".scanner-box").innerHTML = `
    <div class="scanner-header">
      <span class="scanner-titulo">Código de Barras</span>
      <button class="scanner-fechar btn-icon" title="Fechar">&times;</button>
    </div>
    <div style="padding:1.25rem">
      <p style="font-size:0.85rem;color:var(--text-sec);margin-bottom:1rem;line-height:1.5">
        Câmera indisponível ou permissão negada.<br>Digite o código manualmente:
      </p>
      <input type="text" id="scannerFallbackInput"
        placeholder="Ex: 7891234567890" autofocus
        style="width:100%;padding:0.55rem 0.75rem;border:1px solid var(--border);
               border-radius:var(--radius-sm);font-size:0.9rem;
               background:var(--bg);color:var(--text)">
      <div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:0.75rem">
        <button class="btn btn-secondary scanner-fechar">Cancelar</button>
        <button class="btn btn-primary" id="scannerFallbackOk">Confirmar</button>
      </div>
    </div>`;

  overlay.querySelectorAll(".scanner-fechar").forEach(b =>
    b.addEventListener("click", () => overlay.remove())
  );
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });

  const input = overlay.querySelector("#scannerFallbackInput");
  overlay.querySelector("#scannerFallbackOk").addEventListener("click", () => {
    const v = input.value.trim();
    if (!v) return;
    overlay.remove();
    onResult(v);
  });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") overlay.querySelector("#scannerFallbackOk").click();
  });
}
