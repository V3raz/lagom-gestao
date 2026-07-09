import {
  fetchPedidosAtivos, createPedido, fetchItensPedido,
  addItemPedido, removeItemPedido, updateDesconto, finalizarPedido, cancelarPedido
} from "../db/vendas.js";
import { fetchRoupas } from "../db/estoque.js";
import { fetchClientes } from "../db/clientes.js";
import { abrirScanner } from "../scanner.js";
import { brl, escapeAttr, escapeHtml, expandProductsWithVariants, productMatchesSearch, showToast } from "../utils.js";

// ── Estado ────────────────────────────────────────────────────
let pedidos       = [];
let pedidoAtivo   = null;   // objeto pedido selecionado
let itensAtivo    = [];     // itens do pedido ativo
let catalogRoupas = [];     // catálogo de roupas (para bipar/buscar)
let pendingItem   = null;   // item aguardando confirmação de adição
let lastAutoAddCode = "";
let isAddingItem = false;
let currentProductSearch = "";

// ── Template ──────────────────────────────────────────────────
export function renderView() {
  return `
    <div class="view-vendas">
      <!-- Painel esquerdo: lista de pedidos -->
      <div class="panel-left">
        <h2 class="panel-title">Pedidos Pendentes</h2>
        <button id="btnNovoPedido" class="btn btn-primary btn-full">+ Novo Pedido</button>
        <div id="pedidosList" class="pedidos-list">
          <div class="loading"><div class="spinner"></div></div>
        </div>
      </div>

      <!-- Painel direito: detalhes do pedido ativo -->
      <div class="panel-right" id="panelRight">
        <div class="no-pedido">
          <span>Selecione ou crie um pedido</span>
        </div>
      </div>

      <!-- Modal: Novo Pedido -->
      <div id="modalNovoPedido" class="modal-overlay" hidden>
        <div class="modal modal-sm">
          <div class="modal-header">
            <h2>Novo Pedido</h2>
            <button class="modal-close" data-close="modalNovoPedido">&times;</button>
          </div>
          <div class="modal-form">
            <div class="form-group">
              <label>Tipo de Venda</label>
              <select id="novoPedidoTipo">
                <option value="balcao">Venda Balcão</option>
                <option value="expresso">Venda Expressa</option>
                <option value="cliente">Cliente Cadastrado</option>
              </select>
            </div>
            <div class="form-group" id="clienteSelectWrap" hidden>
              <label>Cliente</label>
              <input type="text" id="novoPedidoClienteSearch" placeholder="Buscar cliente...">
              <div id="clienteSuggestions" class="suggestions"></div>
              <input type="hidden" id="novoPedidoClienteId">
            </div>
            <div class="modal-actions">
              <button class="btn btn-secondary" data-close="modalNovoPedido">Cancelar</button>
              <button id="btnCriarPedido" class="btn btn-primary">Criar Pedido</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Confirmar Adição de Item -->
      <div id="modalConfirmItem" class="modal-overlay" hidden>
        <div class="modal modal-sm">
          <div class="modal-header"><h2>Confirmar Adição</h2></div>
          <div class="modal-form">
            <p id="confirmItemText" class="confirm-text"></p>
            <div class="modal-actions">
              <button id="btnCancelarItem" class="btn btn-secondary">Cancelar</button>
              <button id="btnConfirmarItem" class="btn btn-primary">✓ Sim, Adicionar</button>
            </div>
          </div>
        </div>
      </div>

    </div>`;
}

// ── Init ──────────────────────────────────────────────────────
export async function initView() {
  await Promise.all([loadPedidos(), loadCatalog()]);
  await selectPedidoReabertoSeNecessario();

  document.getElementById("btnNovoPedido").addEventListener("click", () => {
    document.getElementById("novoPedidoTipo").value = "balcao";
    document.getElementById("clienteSelectWrap").hidden = true;
    document.getElementById("novoPedidoClienteId").value = "";
    document.getElementById("modalNovoPedido").hidden = false;
  });

  document.getElementById("novoPedidoTipo").addEventListener("change", e => {
    document.getElementById("clienteSelectWrap").hidden = e.target.value !== "cliente";
  });

  // Busca de cliente para novo pedido
  let cliTimer;
  document.getElementById("novoPedidoClienteSearch").addEventListener("input", async (e) => {
    clearTimeout(cliTimer);
    cliTimer = setTimeout(async () => {
      const clientes = await fetchClientes(e.target.value);
      const sug = document.getElementById("clienteSuggestions");
      sug.innerHTML = clientes.slice(0, 5).map(c =>
        `<div class="suggestion-item" data-id="${escapeAttr(c.id)}" data-nome="${escapeAttr(c.nome)}">${escapeHtml(c.nome)} — ${escapeHtml(c.telefone || "sem tel.")}</div>`
      ).join("");
    }, 300);
  });

  document.getElementById("clienteSuggestions").addEventListener("click", e => {
    const item = e.target.closest(".suggestion-item");
    if (!item) return;
    document.getElementById("novoPedidoClienteSearch").value = item.dataset.nome;
    document.getElementById("novoPedidoClienteId").value = item.dataset.id;
    document.getElementById("clienteSuggestions").innerHTML = "";
  });

  document.getElementById("btnCriarPedido").addEventListener("click", handleCriarPedido);
  document.getElementById("btnConfirmarItem").addEventListener("click", handleConfirmarItem);
  document.getElementById("btnCancelarItem").addEventListener("click", () => {
    pendingItem = null;
    lastAutoAddCode = "";
    document.getElementById("modalConfirmItem").hidden = true;
  });

  // Fechar modals
  document.querySelectorAll("[data-close]").forEach(btn =>
    btn.addEventListener("click", () => { document.getElementById(btn.dataset.close).hidden = true; })
  );
  ["modalNovoPedido", "modalConfirmItem"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", e => {
      if (e.target.id === id) document.getElementById(id).hidden = true;
    });
  });
}

async function selectPedidoReabertoSeNecessario() {
  const pedidoId = sessionStorage.getItem("lagom_editar_pedido_id");
  if (!pedidoId) return;
  sessionStorage.removeItem("lagom_editar_pedido_id");
  if (pedidos.some(p => p.id === pedidoId)) {
    await selectPedido(pedidoId);
  }
}

// ── Funções ───────────────────────────────────────────────────

async function loadPedidos() {
  try {
    pedidos = await fetchPedidosAtivos();
    renderPedidosList();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function loadCatalog() {
  try {
    catalogRoupas = await fetchRoupas();
  } catch (_) {}
}

function renderPedidosList() {
  const el = document.getElementById("pedidosList");
  if (!el) return;
  if (!pedidos.length) {
    el.innerHTML = `<p class="empty-state" style="padding:1rem">Nenhum pedido ativo.</p>`;
    return;
  }
  el.innerHTML = pedidos.map(p => {
    const isAtivo = pedidoAtivo?.id === p.id;
    const label   = p.tipo === "balcao"   ? "Venda Balcão"
                  : p.tipo === "expresso" ? "Venda Expressa"
                  : p.clientes?.nome || "Cliente";
    const nItens  = getPedidoItemCount(p);
    const tempo   = timeSince(p.created_at);
    return `
      <div class="pedido-item ${isAtivo ? "pedido-item--ativo" : ""}" data-pid="${escapeAttr(p.id)}">
        <div class="pedido-item-icon">📋</div>
        <div class="pedido-item-info">
          <span class="pedido-item-title">Pedido ${isAtivo ? "ATIVO " : ""}#${escapeHtml(p.numero)} - ${escapeHtml(label)}</span>
          <span class="pedido-item-meta">Aberto: ${escapeHtml(tempo)} &nbsp;·&nbsp; ${escapeHtml(nItens)} item(s)</span>
          <span class="pedido-item-valor">${brl(p.total)}</span>
        </div>
      </div>`;
  }).join("");

  el.querySelectorAll(".pedido-item").forEach(el =>
    el.addEventListener("click", () => selectPedido(el.dataset.pid))
  );
}

async function selectPedido(id) {
  pedidoAtivo = pedidos.find(p => p.id === id) ?? null;
  if (!pedidoAtivo) return;
  renderPedidosList(); // re-render para marcar ativo
  itensAtivo = await fetchItensPedido(id);
  renderPanelRight();
}

function renderPanelRight() {
  const panel = document.getElementById("panelRight");
  if (!panel) return;
  if (!pedidoAtivo) {
    panel.innerHTML = `<div class="no-pedido"><span>Selecione ou crie um pedido</span></div>`;
    return;
  }

  const subtotal = itensAtivo.reduce((s, i) => s + i.preco_unitario * i.quantidade, 0);
  const itemCount = getActiveItemCount();
  const descPct  = pedidoAtivo.desconto_pct ?? 0;
  const descVal  = subtotal * (descPct / 100);
  const total    = subtotal - descVal;

  panel.innerHTML = `
    <div class="pedido-detail">
      <h2 class="panel-title">Detalhes do Pedido Ativo #${pedidoAtivo.numero}</h2>

      <div class="sales-products-panel">
        <div class="sales-input-stack">
          <div class="bipar-wrap">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="3" height="16"/><rect x="6" y="4" width="1.5" height="16"/>
              <rect x="10" y="4" width="3" height="16"/><rect x="15.5" y="4" width="1.5" height="16"/>
              <rect x="19" y="4" width="3" height="16"/>
            </svg>
            <input type="text" id="biparInput" class="bipar-input" placeholder="Bipar código ou SKU e apertar Enter">
            <button type="button" id="btnScanVendas" class="btn-camera" title="Escanear com câmera">📷</button>
          </div>
          <div class="product-search-wrap">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input type="text" id="productSearchInput" class="bipar-input" placeholder="Pesquisar produto por nome, cor, tamanho ou marca" value="${escapeAttr(currentProductSearch)}">
            ${currentProductSearch ? `<button type="button" id="btnClearProductSearch" class="btn-clear-search" title="Limpar pesquisa">✕</button>` : ""}
          </div>
        </div>

        <div id="catalogGrid" class="catalog-grid">
          ${buildCatalogResultsForQuery(currentProductSearch)}
        </div>
      </div>

      <!-- Itens do pedido + totais -->
      <div class="pedido-sidebar">
        <div class="pedido-sidebar-head">
          <div>
            <span class="pedido-sidebar-label">Itens no pedido</span>
            <strong>${escapeHtml(itemCount)} ${itemCount === 1 ? "item" : "itens"}</strong>
          </div>
          <span class="pedido-sidebar-total">${brl(total)}</span>
        </div>
        <div id="itensList" class="itens-list">
          ${itensAtivo.length
            ? itensAtivo.map(buildItemRow).join("")
            : `<p class="empty-state">Nenhum item adicionado.</p>`}
        </div>
        <div class="totais">
          <div class="totais-row"><span>Subtotal:</span><span>${brl(subtotal)}</span></div>
          <div class="totais-row">
            <span>Desconto (%):</span>
            <div class="desconto-wrap">
              <input type="number" id="descontoInput" class="desconto-input" min="0" max="100" step="1" value="${descPct}">
              <button id="btnAplicarDesc" class="btn btn-sm btn-primary">Aplicar</button>
            </div>
          </div>
          <div class="totais-row"><span>Valor do Desconto:</span><span>${brl(descVal)}</span></div>
          <div class="totais-row totais-total"><span>Total a Pagar:</span><span>${brl(total)}</span></div>
        </div>
        <div class="pagamento-btns">
          <button class="btn-pag" data-pag="pix">Pix</button>
          <button class="btn-pag" data-pag="cartao">Cartão</button>
          <button class="btn-pag" data-pag="dinheiro">Dinheiro</button>
          <button class="btn-pag" data-pag="anotado">Anotado</button>
        </div>
        <button id="btnFinalizar" class="btn-finalizar">✓ Finalizar Venda</button>
        <button id="btnCancelarPedido" class="btn btn-secondary btn-full" style="margin-top:0.5rem">✕ Cancelar Pedido</button>
      </div>
    </div>`;

  let searchTimer;
  document.getElementById("productSearchInput").addEventListener("input", e => {
    currentProductSearch = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => handleProductSearchInput(currentProductSearch), 150);
  });

  document.getElementById("btnClearProductSearch")?.addEventListener("click", () => {
    currentProductSearch = "";
    renderPanelRight();
    document.getElementById("productSearchInput")?.focus();
  });

  document.getElementById("biparInput").addEventListener("keydown", async e => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    clearTimeout(searchTimer);
    await tryAddExactCode(e.target.value, { direct: true });
  });

  // Scanner câmera no campo bipar (Feature 3)
  document.getElementById("btnScanVendas").addEventListener("click", () => {
    abrirScanner(async codigo => {
      const input = document.getElementById("biparInput");
      if (!input) return;
      input.value = codigo;
      const added = await tryAddExactCode(codigo, { direct: true });
      if (!added) {
        showToast(`Código: ${codigo} — selecione o produto.`);
      }
    });
  });

  // Clique em card do catálogo
  document.getElementById("catalogGrid").addEventListener("click", e => {
    const card = e.target.closest(".ccard[data-rid]");
    if (!card || card.classList.contains("ccard--esgotado")) return;
    const roupa = catalogRoupas.find(r => r.id === card.dataset.rid);
    if (roupa) requestAddItem(roupa);
  });

  // Remover item
  document.getElementById("itensList").addEventListener("click", async e => {
    const btn = e.target.closest(".btn-rm-item");
    if (!btn) return;
    try {
      await removeItemPedido(btn.dataset.iid, btn.dataset.rid, parseInt(btn.dataset.qty, 10));
      itensAtivo = itensAtivo.filter(i => i.id !== btn.dataset.iid);
      await refreshPedidoTotal();
      syncActivePedidoSummary();
      renderPedidosList();
      renderPanelRight();
      showToast("Item removido.");
    } catch (err) { showToast(err.message, "error"); }
  });

  // Desconto
  document.getElementById("btnAplicarDesc").addEventListener("click", async () => {
    let pct = parseFloat(document.getElementById("descontoInput").value) || 0;
    pct = Math.min(100, Math.max(0, pct)); // desconto só entre 0 e 100%
    try {
      pedidoAtivo = await updateDesconto(pedidoAtivo.id, pct);
      renderPanelRight();
    } catch (err) { showToast(err.message, "error"); }
  });

  // Pagamento
  document.querySelectorAll(".btn-pag").forEach(btn =>
    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-pag").forEach(b => b.classList.remove("btn-pag--ativo"));
      btn.classList.add("btn-pag--ativo");
      btn._pagamento = btn.dataset.pag;
    })
  );

  // Finalizar
  document.getElementById("btnFinalizar").addEventListener("click", handleFinalizar);

  // Cancelar pedido
  document.getElementById("btnCancelarPedido").addEventListener("click", handleCancelarPedido);
}

function buildCatalogResults(roupas, message = "") {
  if (!roupas.length) {
    return `<p class="empty-state catalog-empty">Nenhum produto encontrado.</p>`;
  }
  const header = message
    ? `<div class="catalog-results-note">${escapeHtml(message)}</div>`
    : "";
  return `${header}${roupas.map(r => buildCatalogCard(r)).join("")}`;
}

function getActiveItemCount() {
  return itensAtivo.reduce((sum, item) => sum + (Number(item.quantidade) || 0), 0);
}

function getPedidoItemCount(pedido) {
  return (pedido.itens_pedido ?? []).reduce((sum, item) => sum + (Number(item.quantidade) || 0), 0);
}

function syncActivePedidoSummary() {
  if (!pedidoAtivo) return;
  const idx = pedidos.findIndex(p => p.id === pedidoAtivo.id);
  if (idx === -1) return;
  pedidos[idx] = {
    ...pedidos[idx],
    total: pedidoAtivo.total,
    itens_pedido: itensAtivo.map(item => ({ id: item.id, quantidade: item.quantidade })),
  };
}

function buildCatalogResultsForQuery(query) {
  const q = String(query ?? "").trim();
  if (!q) return buildCatalogResults(catalogRoupas.slice(0, 20));
  const directMatches = catalogRoupas.filter(r => productMatchesSearch(r, q));
  const withVariants = expandProductsWithVariants(directMatches, catalogRoupas);
  const variantCount = withVariants.length - directMatches.length;
  const message = variantCount > 0
    ? `${directMatches.length} resultado(s) direto(s) + ${variantCount} variacoes do mesmo modelo.`
    : "";
  return buildCatalogResults(withVariants, message);
}

function buildCatalogCard(r) {
  const esgotado = r.quantidade <= 0;
  const img = r.imagem_url
    ? `<img src="${escapeAttr(r.imagem_url)}" alt="${escapeAttr(r.nome)}" class="ccard-img" loading="lazy" onerror="this.style.display='none'">`
    : `<div class="ccard-img ccard-img--empty">👗</div>`;
  return `
    <div class="ccard ${esgotado ? "ccard--esgotado" : ""}" data-rid="${escapeAttr(r.id)}">
      ${img}
      ${esgotado ? `<span class="unavail-badge unavail-badge--sm">Esgotada</span>` : ""}
      <div class="ccard-body">
        <span class="ccard-sku">${escapeHtml(r.barcode || r.sku)}</span>
        <span class="ccard-name">${escapeHtml(r.nome)}</span>
        <span class="ccard-meta">TAM: ${escapeHtml(r.tamanho)} | COR: ${escapeHtml(r.cor)} - QTD: ${escapeHtml(r.quantidade)}</span>
        <span class="ccard-price">${brl(r.preco)}</span>
      </div>
    </div>`;
}

function buildItemRow(item) {
  const r = item.roupas;
  return `
    <div class="item-row">
      ${r.imagem_url ? `<img src="${escapeAttr(r.imagem_url)}" class="item-thumb" alt="${escapeAttr(r.nome)}">` : `<div class="item-thumb item-thumb--empty">👗</div>`}
      <div class="item-info">
        <span class="item-name">${escapeHtml(r.nome)}</span>
        <span class="item-meta">TAM: ${escapeHtml(r.tamanho)} | COR: ${escapeHtml(r.cor)}</span>
      </div>
      <div class="item-qty-price">
        <span class="item-qty">${item.quantidade}x</span>
        <span class="item-price">${brl(item.preco_unitario)}</span>
      </div>
      <button class="btn-rm-item" data-iid="${escapeAttr(item.id)}" data-rid="${escapeAttr(item.roupa_id)}" data-qty="${escapeAttr(item.quantidade)}" title="Remover">✕</button>
    </div>`;
}

function filterCatalog(query) {
  currentProductSearch = String(query ?? "");
  document.getElementById("catalogGrid").innerHTML = buildCatalogResultsForQuery(currentProductSearch);
}

function handleProductSearchInput(query) {
  filterCatalog(query);
}

function findExactProductByCode(code) {
  const q = String(code ?? "").trim().toLowerCase();
  if (!q) return null;
  const exactMatches = catalogRoupas.filter(r =>
    String(r.barcode ?? "").toLowerCase() === q ||
    String(r.sku ?? "").toLowerCase() === q
  );
  return exactMatches.length === 1 ? exactMatches[0] : null;
}

async function tryAddExactCode(code, { direct = false } = {}) {
  const q = String(code ?? "").trim();
  if (!q || pendingItem || isAddingItem) return false;
  const product = findExactProductByCode(q);
  if (!product) return false;
  if (!direct && q.length < 6) return false;
  if (!direct && lastAutoAddCode === q) return false;
  lastAutoAddCode = q;
  if (direct) return addProductToActiveOrder(product, { clearScan: true, focusTarget: "scan" });
  requestAddItem(product);
  return true;
}

function requestAddItem(roupa) {
  if ((roupa.quantidade ?? 0) <= 0) {
    showToast("Produto sem estoque disponível.", "error");
    return;
  }
  pendingItem = roupa;
  document.getElementById("confirmItemText").textContent =
    `${roupa.nome} (Tam: ${roupa.tamanho} | Cor: ${roupa.cor}) — ${brl(roupa.preco)}`;
  document.getElementById("modalConfirmItem").hidden = false;
}

async function handleConfirmarItem() {
  if (!pendingItem || !pedidoAtivo) return;
  document.getElementById("modalConfirmItem").hidden = true;
  const product = pendingItem;
  pendingItem = null;
  await addProductToActiveOrder(product, { clearScan: false, focusTarget: "search" });
}

async function addProductToActiveOrder(product, { clearScan = true, focusTarget = "scan" } = {}) {
  if (!product || !pedidoAtivo || isAddingItem) return false;
  if ((product.quantidade ?? 0) <= 0) {
    showToast("Produto sem estoque disponível.", "error");
    return false;
  }

  isAddingItem = true;
  const addedItemName = product.nome;
  try {
    const item = await addItemPedido(pedidoAtivo.id, product);
    const idx = itensAtivo.findIndex(i => i.id === item.id);
    if (idx !== -1) itensAtivo[idx] = item;
    else itensAtivo.push(item);

    catalogRoupas = await fetchRoupas();
    itensAtivo = await fetchItensPedido(pedidoAtivo.id);
    await refreshPedidoTotal();
    syncActivePedidoSummary();
    renderPedidosList();
    renderPanelRight();
    const scanInput = document.getElementById("biparInput");
    const searchInput = document.getElementById("productSearchInput");
    if (clearScan && scanInput) scanInput.value = "";
    const focusInput = focusTarget === "search" ? searchInput : scanInput;
    if (focusInput) {
      focusInput.focus();
      if (focusTarget === "scan") focusInput.select();
    }
    showToast(`${addedItemName} adicionado.`);
    return true;
  } catch (err) {
    showToast(err.message, "error");
    return false;
  } finally {
    pendingItem = null;
    lastAutoAddCode = "";
    isAddingItem = false;
  }
}

async function refreshPedidoTotal() {
  const subtotal = itensAtivo.reduce((s, i) => s + i.preco_unitario * i.quantidade, 0);
  const descPct  = pedidoAtivo?.desconto_pct ?? 0;
  const total    = subtotal * (1 - descPct / 100);
  // Atualiza no banco (simplificado — total calculado no frontend)
  pedidoAtivo = { ...pedidoAtivo, total };
}

async function handleFinalizar() {
  const pagBtn = document.querySelector(".btn-pag--ativo");
  if (!pagBtn) { showToast("Selecione a forma de pagamento.", "error"); return; }
  if (!itensAtivo.length) { showToast("Pedido sem itens.", "error"); return; }
  // "Anotado" exige cliente cadastrada — senão a dívida não é registrada em lugar nenhum
  if (pagBtn.dataset.pag === "anotado" && !pedidoAtivo.cliente_id) {
    showToast("Venda 'Anotado' só funciona com cliente cadastrada. Crie o pedido como 'Cliente Cadastrado'.", "error");
    return;
  }

  const subtotal = itensAtivo.reduce((s, i) => s + i.preco_unitario * i.quantidade, 0);
  const descPct  = pedidoAtivo.desconto_pct ?? 0;
  const total    = subtotal * (1 - descPct / 100);

  const btn = document.getElementById("btnFinalizar");
  btn.disabled = true; btn.textContent = "Finalizando...";
  try {
    await finalizarPedido(pedidoAtivo.id, {
      formaPagamento: pagBtn.dataset.pag,
      total,
      clienteId: pedidoAtivo.cliente_id,
    });
    pedidos = pedidos.filter(p => p.id !== pedidoAtivo.id);
    pedidoAtivo = null;
    itensAtivo  = [];
    renderPedidosList();
    renderPanelRight();
    showToast(`Venda finalizada! Total: ${brl(total)}`);
  } catch (err) {
    showToast(err.message, "error");
    const b = document.getElementById("btnFinalizar");
    if (b) { b.disabled = false; b.textContent = "✓ Finalizar Venda"; }
  }
}

async function handleCancelarPedido() {
  if (!confirm("Cancelar este pedido? Os itens serão devolvidos ao estoque.")) return;
  try {
    await cancelarPedido(pedidoAtivo.id);
    pedidos = pedidos.filter(p => p.id !== pedidoAtivo.id);
    pedidoAtivo = null;
    itensAtivo  = [];
    catalogRoupas = await fetchRoupas(); // recarrega estoque
    renderPedidosList();
    renderPanelRight();
    showToast("Pedido cancelado.");
  } catch (err) { showToast(err.message, "error"); }
}

async function handleCriarPedido() {
  const tipo      = document.getElementById("novoPedidoTipo").value;
  const clienteId = document.getElementById("novoPedidoClienteId").value || null;
  if (tipo === "cliente" && !clienteId) {
    showToast("Selecione um cliente.", "error"); return;
  }
  try {
    const novo = await createPedido({ tipo, clienteId });
    novo.itens_pedido = [];
    pedidos.unshift(novo);
    document.getElementById("modalNovoPedido").hidden = true;
    await selectPedido(novo.id);
    showToast(`Pedido #${novo.numero} criado.`);
  } catch (err) { showToast(err.message, "error"); }
}

// Tempo decorrido
function timeSince(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const min  = Math.floor(diff / 60000);
  if (min < 60) return `${min}min`;
  return `${Math.floor(min / 60)}h ${min % 60}min`;
}
