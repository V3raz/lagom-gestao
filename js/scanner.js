// ============================================================
// LAGOM GESTÃO — Scanner de Código de Barras (Feature 3)
// Usa BarcodeDetector API nativa (Chrome/Edge mobile).
// Fallback gracioso se API não disponível.
// ============================================================

/**
 * Abre overlay de câmera e detecta códigos de barras.
 * @param {(codigo: string) => void} onResult  Callback com o código detectado.
 */
export async function abrirScanner(onResult) {
  // ── Fallback: API não suportada ──────────────────────────
  if (!("BarcodeDetector" in window)) {
    _mostrarFallback(onResult);
    return;
  }

  // ── Monta overlay ────────────────────────────────────────
  const overlay = _criarOverlay();
  document.body.appendChild(overlay);

  const video    = overlay.querySelector(".scanner-video");
  const statusEl = overlay.querySelector(".scanner-status");

  let stream = null;
  let animId = null;
  let encerrado = false;

  function encerrar() {
    if (encerrado) return;
    encerrado = true;
    cancelAnimationFrame(animId);
    stream?.getTracks().forEach(t => t.stop());
    overlay.remove();
  }

  overlay.querySelector(".scanner-fechar").addEventListener("click", encerrar);
  overlay.addEventListener("click", e => { if (e.target === overlay) encerrar(); });

  // ── Câmera ───────────────────────────────────────────────
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    statusEl.textContent = "Câmera indisponível: " + err.message;
    return;
  }

  // ── Detector ─────────────────────────────────────────────
  const detector = new BarcodeDetector({
    formats: [
      "ean_13", "ean_8", "code_128", "code_39",
      "upc_a", "upc_e", "qr_code", "data_matrix",
    ],
  });

  statusEl.textContent = "Aponte a câmera para o código de barras...";

  async function scan() {
    if (encerrado) return;
    try {
      const barcodes = await detector.detect(video);
      if (barcodes.length > 0) {
        const codigo = barcodes[0].rawValue;
        encerrar();
        onResult(codigo);
        return;
      }
    } catch (_) { /* ignora frames com erro */ }
    animId = requestAnimationFrame(scan);
  }

  animId = requestAnimationFrame(scan);
}

// ── Helpers ───────────────────────────────────────────────────

function _criarOverlay() {
  const el = document.createElement("div");
  el.className = "scanner-overlay";
  el.innerHTML = `
    <div class="scanner-box">
      <div class="scanner-header">
        <span class="scanner-titulo">Escanear Código</span>
        <button class="scanner-fechar btn-icon" title="Fechar">&times;</button>
      </div>
      <div class="scanner-viewport">
        <video class="scanner-video" muted playsinline autoplay></video>
        <div class="scanner-linha"></div>
      </div>
      <p class="scanner-status">Iniciando câmera...</p>
    </div>`;
  return el;
}

function _mostrarFallback(onResult) {
  const el = document.createElement("div");
  el.className = "scanner-overlay";
  el.innerHTML = `
    <div class="scanner-box">
      <div class="scanner-header">
        <span class="scanner-titulo">Código de Barras</span>
        <button class="scanner-fechar btn-icon" title="Fechar">&times;</button>
      </div>
      <div style="padding:1.25rem">
        <p style="font-size:0.85rem;color:var(--text-sec);margin-bottom:1rem;line-height:1.5">
          O seu navegador não suporta a detecção automática de códigos de barras
          (requer Chrome/Edge atualizado). Digite o código manualmente:
        </p>
        <div class="form-group">
          <input type="text" id="scannerFallbackInput" class="form-group input"
            placeholder="Ex: 7891234567890" autofocus
            style="width:100%;padding:0.55rem 0.75rem;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:0.9rem;background:var(--bg);color:var(--text)">
        </div>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:0.75rem">
          <button class="btn btn-secondary scanner-fechar">Cancelar</button>
          <button class="btn btn-primary" id="scannerFallbackOk">Confirmar</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(el);

  el.querySelectorAll(".scanner-fechar").forEach(b => b.addEventListener("click", () => el.remove()));
  el.addEventListener("click", e => { if (e.target === el) el.remove(); });

  el.querySelector("#scannerFallbackOk").addEventListener("click", () => {
    const v = el.querySelector("#scannerFallbackInput").value.trim();
    if (!v) return;
    el.remove();
    onResult(v);
  });

  el.querySelector("#scannerFallbackInput").addEventListener("keydown", e => {
    if (e.key === "Enter") el.querySelector("#scannerFallbackOk").click();
  });
}
