import { fetchAnotacoes, insertAnotacao, updateAnotacao, deleteAnotacao } from "../db/anotacoes.js";
import { dataBR, showToast } from "../utils.js";

// ── Template ──────────────────────────────────────────────────
export function renderView() {
  return `
    <div class="view-caderninho">
      <div class="view-header">
        <h1 class="view-title">Caderninho</h1>
        <button id="btnNovaAnotacao" class="btn btn-primary">+ Nova Anotação</button>
      </div>
      <div id="anotacoesList" class="anotacoes-list">
        <div class="loading"><div class="spinner"></div></div>
      </div>

      <div id="modalAnotacao" class="modal-overlay" hidden>
        <div class="modal">
          <div class="modal-header">
            <h2 id="modalAnotacaoTitulo">Nova Anotação</h2>
            <button class="modal-close" data-close="modalAnotacao">&times;</button>
          </div>
          <form id="formAnotacao" class="modal-form">
            <div class="form-group">
              <label>Título</label>
              <input type="text" id="anotacaoTitulo" placeholder="Ex: Pedido especial Fulana..." required>
            </div>
            <div class="form-group">
              <label>Anotação</label>
              <textarea id="anotacaoTexto" rows="6" placeholder="Digite aqui..." style="resize:vertical;width:100%;padding:0.6rem;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:0.9rem;background:var(--bg);color:var(--text)"></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" data-close="modalAnotacao">Cancelar</button>
              <button type="submit" class="btn btn-primary">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;
}

// ── Init ──────────────────────────────────────────────────────
export async function initView() {
  await loadAnotacoes();

  document.getElementById("btnNovaAnotacao").addEventListener("click", () => {
    const form = document.getElementById("formAnotacao");
    form.reset();
    delete form.dataset.editingId;
    document.getElementById("modalAnotacaoTitulo").textContent = "Nova Anotação";
    document.getElementById("modalAnotacao").hidden = false;
    document.getElementById("anotacaoTitulo").focus();
  });

  document.getElementById("formAnotacao").addEventListener("submit", handleSalvar);

  document.querySelectorAll("[data-close]").forEach(btn =>
    btn.addEventListener("click", () => { document.getElementById(btn.dataset.close).hidden = true; })
  );
  document.getElementById("modalAnotacao").addEventListener("click", e => {
    if (e.target.id === "modalAnotacao") document.getElementById("modalAnotacao").hidden = true;
  });
}

// ── Funções internas ──────────────────────────────────────────

async function loadAnotacoes() {
  const el = document.getElementById("anotacoesList");
  el.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;
  try {
    const lista = await fetchAnotacoes();

    if (!lista.length) {
      el.innerHTML = `<p class="empty-state">Nenhuma anotação ainda. Clique em "+ Nova Anotação".</p>`;
      return;
    }

    el.innerHTML = lista.map(a => `
      <div class="anotacao-card" data-aid="${a.id}">
        <div class="anotacao-header">
          <span class="anotacao-titulo">${a.titulo}</span>
          <span class="anotacao-data">${dataBR(a.created_at)}</span>
        </div>
        <p class="anotacao-texto">${a.conteudo ?? ""}</p>
        <div class="anotacao-actions">
          <button class="btn-edit-anotacao btn btn-secondary btn-sm"
                  data-aid="${a.id}"
                  data-titulo="${a.titulo}"
                  data-texto="${(a.conteudo ?? '').replace(/"/g, '&quot;')}"
                  title="Editar">Editar</button>
          <button class="btn-rm-anotacao btn btn-sm" style="color:var(--danger)" data-aid="${a.id}" title="Excluir">Excluir</button>
        </div>
      </div>`).join("");

    el.querySelectorAll(".btn-rm-anotacao").forEach(btn =>
      btn.addEventListener("click", async () => {
        if (!confirm("Excluir esta anotação?")) return;
        try {
          await deleteAnotacao(btn.dataset.aid);
          btn.closest(".anotacao-card").remove();
          showToast("Anotação removida.");
          if (!el.querySelector(".anotacao-card")) {
            el.innerHTML = `<p class="empty-state">Nenhuma anotação ainda. Clique em "+ Nova Anotação".</p>`;
          }
        } catch (err) {
          showToast(err.message, "error");
        }
      })
    );

    el.querySelectorAll(".btn-edit-anotacao").forEach(btn =>
      btn.addEventListener("click", () => {
        const form = document.getElementById("formAnotacao");
        document.getElementById("modalAnotacaoTitulo").textContent = "Editar Anotação";
        document.getElementById("anotacaoTitulo").value = btn.dataset.titulo;
        document.getElementById("anotacaoTexto").value = btn.dataset.texto;
        form.dataset.editingId = btn.dataset.aid;
        document.getElementById("modalAnotacao").hidden = false;
      })
    );

  } catch (err) {
    console.error(err);
    el.innerHTML = `<p class="empty-state">Erro ao carregar anotações.</p>`;
    showToast(err.message, "error");
  }
}

async function handleSalvar(e) {
  e.preventDefault();
  const form   = document.getElementById("formAnotacao");
  const titulo = document.getElementById("anotacaoTitulo").value.trim();
  const texto  = document.getElementById("anotacaoTexto").value.trim();
  const id     = form.dataset.editingId;

  try {
    if (id) {
      await updateAnotacao(id, { titulo, conteudo: texto });
      showToast("Anotação atualizada.");
    } else {
      await insertAnotacao({ titulo, conteudo: texto });
      showToast("Anotação salva.");
    }
    document.getElementById("modalAnotacao").hidden = true;
    delete form.dataset.editingId;
    await loadAnotacoes();
  } catch (err) {
    showToast(err.message, "error");
  }
}
