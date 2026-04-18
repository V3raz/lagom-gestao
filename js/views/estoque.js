import { fetchRoupas, reporEstoque, deleteRoupa, insertRoupa } from "../db/estoque.js";
import { fetchMarcas, insertMarca, deleteMarca } from "../db/marcas.js";
import { fetchCategorias, insertCategoria, deleteCategoria } from "../db/categorias.js";
import { abrirScanner } from "../scanner.js";
import { brl, gerarSKU, showToast, fileToDataUrl } from "../utils.js";

// ── Estado ────────────────────────────────────────────────────
let allProducts   = [];
let allMarcas     = [];
let allCategorias = [];
let _gerenciarBound = false;

// ── Template da view ──────────────────────────────────────────
export function renderView() {
  return `
    <div class="view-estoque">

      <!-- Cabeçalho da view -->
      <div class="view-header">
        <h1 class="view-title">Estoque Disponível <span class="sun-icon">✦</span></h1>
        <div class="view-controls">
          <div class="search-wrap">
            <svg class="search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="8.5" cy="8.5" r="5.5"/><path d="M17 17l-4-4"/>
            </svg>
            <input type="text" id="estoqueSearch" class="search-input" placeholder="SKU / Nome">
          </div>
          <select id="filterTam" class="filter-select"><option value="">Tamanho</option>
            <option>PP</option><option>P</option><option>M</option><option>G</option>
            <option>GG</option><option>XGG</option><option>34</option><option>36</option>
            <option>38</option><option>40</option><option>42</option><option>44</option><option>46</option>
          </select>
          <select id="filterCor" class="filter-select"><option value="">Cor</option>
            <option>Preto</option><option>Branco</option><option>Azul</option><option>Vermelho</option>
            <option>Verde</option><option>Rosa</option><option>Bege</option><option>Marrom</option>
            <option>Cinza</option><option>Amarelo</option><option>Outra</option>
          </select>
          <select id="filterCat" class="filter-select"><option value="">Categoria</option></select>
          <select id="filterMarca" class="filter-select"><option value="">Marca</option></select>
          <button id="btnGerenciarMarcas" class="btn-gerenciar">⚙ Gerenciar</button>
        </div>
      </div>

      <!-- Grid de produtos -->
      <div id="estoqueGrid" class="product-grid">
        <div class="loading"><div class="spinner"></div></div>
      </div>
      <p id="estoqueCount" class="grid-count"></p>

      <!-- FAB Adicionar -->
      <button id="fabEstoque" class="fab" title="Adicionar produto" aria-label="Adicionar produto">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <rect x="2" y="4" width="3" height="16"/><rect x="7" y="4" width="1.5" height="16"/>
          <rect x="11" y="4" width="3" height="16"/><rect x="16.5" y="4" width="1.5" height="16"/>
          <rect x="20" y="4" width="2" height="16"/>
        </svg>
      </button>

      <!-- ===== Modal Adicionar Produto ===== -->
      <div id="modalEstoque" class="modal-overlay" hidden>
        <div class="modal">
          <div class="modal-header">
            <h2>Novo Produto</h2>
            <button class="modal-close" data-close="modalEstoque">&times;</button>
          </div>
          <form id="formEstoque" class="modal-form" novalidate>

            <!-- Código de barras + câmera -->
            <div class="form-group">
              <label>Código de Barras</label>
              <div class="input-addon">
                <input type="text" id="fBarcode" placeholder="Escanear ou digitar...">
                <button type="button" id="btnScanBarcode" class="btn-camera" title="Abrir câmera">📷</button>
              </div>
            </div>

            <div class="form-group">
              <label>Nome da Peça <span class="req">*</span></label>
              <input type="text" id="fNome" required placeholder="Ex: Vestido Floral">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>SKU</label>
                <div class="input-addon">
                  <input type="text" id="fSKU" placeholder="LW-0000">
                  <button type="button" id="btnGerarSKU" class="btn-icon" title="Gerar SKU">↻</button>
                </div>
              </div>
              <div class="form-group">
                <label>Categoria <span class="req">*</span></label>
                <div class="input-addon">
                  <select id="fCategoria" required style="flex:1">
                    <option value="">Selecionar...</option>
                  </select>
                  <button type="button" id="btnAddCatInline" class="btn-icon" title="Nova categoria">+</button>
                </div>
                <!-- Campo inline para criar nova categoria -->
                <div class="cat-add-inline" id="catAddInline">
                  <input type="text" id="catNovoNome" placeholder="Nome da categoria">
                  <button type="button" id="btnSalvarCatInline" class="btn btn-sm btn-primary">OK</button>
                  <button type="button" id="btnCancelarCatInline" class="btn btn-sm btn-secondary">✕</button>
                </div>
              </div>
            </div>

            <!-- Marca -->
            <div class="form-group">
              <label>Marca</label>
              <select id="fMarca">
                <option value="">Sem marca</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Tamanho <span class="req">*</span></label>
                <select id="fTamanho" required>
                  <option value="">Selecionar...</option>
                  <option>PP</option><option>P</option><option>M</option><option>G</option>
                  <option>GG</option><option>XGG</option><option>34</option><option>36</option>
                  <option>38</option><option>40</option><option>42</option><option>44</option><option>46</option>
                </select>
              </div>
              <div class="form-group">
                <label>Cor <span class="req">*</span></label>
                <select id="fCor" required>
                  <option value="">Selecionar...</option>
                  <option>Preto</option><option>Branco</option><option>Azul</option><option>Vermelho</option>
                  <option>Verde</option><option>Rosa</option><option>Bege</option><option>Marrom</option>
                  <option>Cinza</option><option>Amarelo</option><option>Outra</option>
                </select>
              </div>
            </div>

            <!-- Preço de custo + Preço de venda com botão Calcular -->
            <div class="form-row">
              <div class="form-group">
                <label>Preço de Custo (R$)</label>
                <input type="number" id="fPrecoCusto" min="0" step="0.01" placeholder="0,00">
              </div>
              <div class="form-group">
                <label>Preço de Venda (R$) <span class="req">*</span></label>
                <div class="preco-group">
                  <input type="number" id="fPreco" required min="0" step="0.01" placeholder="0,00">
                  <button type="button" id="btnCalcularPreco" class="btn-calc" title="Calcular com margem da marca">Calcular</button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Quantidade <span class="req">*</span></label>
              <input type="number" id="fQtd" required min="0" step="1" placeholder="0">
            </div>

            <div class="form-group">
              <label>Imagem</label>
              <input type="url" id="fImgUrl" placeholder="https://... ou escolha arquivo abaixo">
              <input type="file" id="fImgFile" accept="image/*" style="margin-top:0.4rem">
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" data-close="modalEstoque">Cancelar</button>
              <button type="submit" id="btnSalvarProduto" class="btn btn-primary">Salvar Produto</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ===== Modal Repor ===== -->
      <div id="modalRepor" class="modal-overlay" hidden>
        <div class="modal modal-sm">
          <div class="modal-header">
            <h2>Repor Estoque</h2>
            <button class="modal-close" data-close="modalRepor">&times;</button>
          </div>
          <div class="modal-form">
            <p id="reporNome" style="font-weight:600;margin-bottom:1rem;color:var(--text)"></p>
            <div class="form-group">
              <label>Quantidade a Adicionar</label>
              <input type="number" id="reporQtd" min="1" step="1" value="1" class="input-lg">
            </div>
            <div class="modal-actions">
              <button class="btn btn-secondary" data-close="modalRepor">Cancelar</button>
              <button id="btnConfirmarRepor" class="btn btn-primary">+ Adicionar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Confirm Deletar ===== -->
      <div id="modalConfirmDel" class="modal-overlay" hidden>
        <div class="modal modal-sm">
          <p class="confirm-text">Remover este produto do estoque?</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" data-close="modalConfirmDel">Cancelar</button>
            <button id="btnConfirmDel" class="btn btn-danger">Deletar</button>
          </div>
        </div>
      </div>

      <!-- ===== Modal Gerenciar Marcas + Categorias ===== -->
      <div id="modalGerenciar" class="modal-overlay" hidden>
        <div class="modal modal-lg">
          <div class="modal-header">
            <h2>Gerenciar</h2>
            <button class="modal-close" data-close="modalGerenciar">&times;</button>
          </div>
          <div class="modal-form">
            <!-- Tabs -->
            <div class="mgr-tabs">
              <button class="mgr-tab mgr-tab--active" data-tab="marcas">Marcas</button>
              <button class="mgr-tab" data-tab="categorias">Categorias</button>
            </div>

            <!-- Seção: Marcas -->
            <div class="mgr-section mgr-section--active" id="mgrMarcas">
              <div id="mgrMarcasList" class="mgr-list">
                <div class="loading"><div class="spinner"></div></div>
              </div>
              <form id="formNovaMaraca" class="mgr-add-form" novalidate>
                <div class="form-group">
                  <label>Nome da Marca <span class="req">*</span></label>
                  <input type="text" id="mNome" required placeholder="Ex: ZARA">
                </div>
                <div class="form-group" style="max-width:110px">
                  <label>Margem (%) <span class="req">*</span></label>
                  <input type="number" id="mMargem" required min="0" max="999" step="0.01" placeholder="50">
                </div>
                <button type="submit" class="btn btn-primary btn-sm" style="align-self:flex-end;margin-bottom:0">Adicionar</button>
              </form>
            </div>

            <!-- Seção: Categorias -->
            <div class="mgr-section" id="mgrCategorias">
              <div id="mgrCatList" class="mgr-list">
                <div class="loading"><div class="spinner"></div></div>
              </div>
              <form id="formNovaCat" class="mgr-add-form" novalidate>
                <div class="form-group">
                  <label>Nome da Categoria <span class="req">*</span></label>
                  <input type="text" id="cNome" required placeholder="Ex: Blazer">
                </div>
                <button type="submit" class="btn btn-primary btn-sm" style="align-self:flex-end;margin-bottom:0">Adicionar</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>`;
}

// ── Init da view ──────────────────────────────────────────────
export async function initView() {
  // Reseta flag de binding (view é re-montada a cada navegação)
  _gerenciarBound = false;

  // Carrega dados em paralelo
  await Promise.all([loadProducts(), loadMarcas(), loadCategorias()]);

  // Filtros
  let searchTimer;
  document.getElementById("estoqueSearch").addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 250);
  });
  ["filterTam", "filterCor", "filterCat", "filterMarca"].forEach(id =>
    document.getElementById(id).addEventListener("change", applyFilters)
  );

  // FAB → abre modal
  document.getElementById("fabEstoque").addEventListener("click", () => openModal());

  // Gerar SKU
  document.getElementById("btnGerarSKU").addEventListener("click", () => {
    document.getElementById("fSKU").value = gerarSKU();
  });

  // Scanner câmera no barcode (Feature 3)
  document.getElementById("btnScanBarcode").addEventListener("click", () => {
    abrirScanner(codigo => {
      document.getElementById("fBarcode").value = codigo;
      showToast(`Código detectado: ${codigo}`);
    });
  });

  // Calcular preço de venda com margem da marca selecionada (Feature 1)
  document.getElementById("btnCalcularPreco").addEventListener("click", () => {
    const custo = parseFloat(document.getElementById("fPrecoCusto").value);
    const marcaId = document.getElementById("fMarca").value;
    if (!custo || custo <= 0) { showToast("Informe o preço de custo primeiro.", "error"); return; }
    const marca = allMarcas.find(m => m.id === marcaId);
    if (!marca) { showToast("Selecione uma marca para calcular.", "error"); return; }
    const venda = +(custo * (1 + marca.margem_padrao / 100)).toFixed(2);
    document.getElementById("fPreco").value = venda;
    showToast(`Preço calculado com margem ${marca.margem_padrao}% → ${brl(venda)}`);
  });

  // Adicionar categoria inline (Feature 2)
  document.getElementById("btnAddCatInline").addEventListener("click", () => {
    document.getElementById("catAddInline").classList.add("visible");
    document.getElementById("catNovoNome").focus();
  });
  document.getElementById("btnCancelarCatInline").addEventListener("click", () => {
    document.getElementById("catAddInline").classList.remove("visible");
    document.getElementById("catNovoNome").value = "";
  });
  document.getElementById("btnSalvarCatInline").addEventListener("click", async () => {
    const nome = document.getElementById("catNovoNome").value.trim();
    if (!nome) return;
    try {
      const nova = await insertCategoria(nome);
      allCategorias.push(nova);
      allCategorias.sort((a, b) => a.nome.localeCompare(b.nome));
      populateCatSelects();
      document.getElementById("fCategoria").value = nova.id;
      document.getElementById("catAddInline").classList.remove("visible");
      document.getElementById("catNovoNome").value = "";
      showToast(`Categoria "${nome}" criada.`);
    } catch (err) { showToast(err.message, "error"); }
  });

  // Submit form novo produto
  document.getElementById("formEstoque").addEventListener("submit", handleSubmitProduto);

  // Delegação de eventos no grid (Repor / Deletar)
  document.getElementById("estoqueGrid").addEventListener("click", handleGridClick);

  // Botões fechar modal
  document.querySelectorAll("[data-close]").forEach(btn =>
    btn.addEventListener("click", () => closeModal(btn.dataset.close))
  );

  // Fechar overlay ao clicar fora
  ["modalEstoque", "modalRepor", "modalConfirmDel", "modalGerenciar"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", e => {
      if (e.target.id === id) closeModal(id);
    });
  });

  // Abrir modal gerenciar
  document.getElementById("btnGerenciarMarcas").addEventListener("click", () => {
    openModalGerenciar("marcas");
  });
}

// ── Funções internas ──────────────────────────────────────────

async function loadProducts() {
  const grid = document.getElementById("estoqueGrid");
  grid.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;
  try {
    allProducts = await fetchRoupas();
    renderGrid(allProducts);
  } catch (err) {
    showToast(err.message, "error");
    grid.innerHTML = "";
  }
}

async function loadMarcas() {
  try {
    allMarcas = await fetchMarcas();
  } catch (_) { allMarcas = []; }
  populateMarcaSelects();
}

async function loadCategorias() {
  try {
    allCategorias = await fetchCategorias();
  } catch (_) { allCategorias = []; }
  populateCatSelects();
}

/** Popula todos os selects de marca na página */
function populateMarcaSelects() {
  const selects = ["fMarca", "filterMarca"];
  selects.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const isFilter = id === "filterMarca";
    const defaultOpt = isFilter ? '<option value="">Marca</option>' : '<option value="">Sem marca</option>';
    sel.innerHTML = defaultOpt + allMarcas.map(m =>
      `<option value="${m.id}">${m.nome}</option>`
    ).join("");
  });
}

/** Popula todos os selects de categoria na página */
function populateCatSelects() {
  const selects = ["fCategoria", "filterCat"];
  selects.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const isFilter = id === "filterCat";
    const defaultOpt = isFilter
      ? '<option value="">Categoria</option>'
      : '<option value="">Selecionar...</option>';
    sel.innerHTML = defaultOpt + allCategorias.map(c =>
      `<option value="${c.id}">${c.nome}</option>`
    ).join("");
    // Se não há categorias no banco, mantém fallback hardcoded no filtro
    if (allCategorias.length === 0 && isFilter) {
      sel.innerHTML = `<option value="">Categoria</option>
        <option>Camiseta</option><option>Calça</option><option>Vestido</option>
        <option>Short</option><option>Blusa</option><option>Jaqueta</option>
        <option>Saia</option><option>Moletom</option><option>Acessório</option>`;
    }
  });
}

function applyFilters() {
  const search   = document.getElementById("estoqueSearch").value.toLowerCase();
  const tamanho  = document.getElementById("filterTam").value;
  const cor      = document.getElementById("filterCor").value;
  const catVal   = document.getElementById("filterCat").value;
  const marcaVal = document.getElementById("filterMarca").value;

  const filtered = allProducts.filter(p => {
    // Categoria: compara id ou nome (depende se tabela categorias existe)
    const catMatch = !catVal || p.categoria === catVal ||
      (allCategorias.find(c => c.id === catVal)?.nome === p.categoria);
    const marcaMatch = !marcaVal || p.marca_id === marcaVal;
    return (
      (!search   || p.nome.toLowerCase().includes(search) || p.sku?.toLowerCase().includes(search)) &&
      (!tamanho  || p.tamanho === tamanho) &&
      (!cor      || p.cor === cor) &&
      catMatch &&
      marcaMatch
    );
  });
  renderGrid(filtered);
}

function renderGrid(produtos) {
  const grid  = document.getElementById("estoqueGrid");
  const count = document.getElementById("estoqueCount");
  grid.innerHTML = "";

  if (!produtos.length) {
    grid.innerHTML = `<p class="empty-state">Nenhum produto encontrado.</p>`;
    count.textContent = "";
    return;
  }

  count.textContent = `Mostrando ${produtos.length} de ${allProducts.length} produtos`;
  const frag = document.createDocumentFragment();
  produtos.forEach(p => frag.appendChild(buildCard(p)));
  grid.appendChild(frag);
}

function buildCard(p) {
  const unavail = p.quantidade <= 0;
  const card = document.createElement("article");
  card.className = `pcard${unavail ? " pcard--unavail" : ""}`;
  card.dataset.id  = p.id;
  card.dataset.qty = p.quantidade;

  const img = p.imagem_url
    ? `<img src="${p.imagem_url}" alt="${p.nome}" class="pcard-img" loading="lazy" onerror="this.outerHTML='<div class=\\'pcard-img pcard-img--empty\\'>👗</div>'">`
    : `<div class="pcard-img pcard-img--empty">👗</div>`;

  // Marca badge (Feature 1)
  const marcaInfo = p.marcas
    ? `<span class="pcard-marca">${p.marcas.nome} — ${p.marcas.margem_padrao}%</span>`
    : "";

  card.innerHTML = `
    ${img}
    ${unavail ? `<span class="unavail-badge">Indisponível</span>` : ""}
    <div class="pcard-body">
      <span class="pcard-sku">${p.sku || "—"}</span>
      <span class="pcard-name" title="${p.nome}">${p.nome}</span>
      ${marcaInfo}
      <span class="pcard-meta">TAM: ${p.tamanho} &nbsp;|&nbsp; COR: ${p.cor}</span>
      <div class="pcard-row">
        <span class="pcard-qty ${unavail ? "pcard-qty--zero" : ""}">QTD: ${p.quantidade}</span>
        <span class="pcard-price">${brl(p.preco)}</span>
      </div>
    </div>
    <div class="pcard-footer">
      <button class="pcard-btn btn-repor" data-id="${p.id}" data-nome="${p.nome}" data-qty="${p.quantidade}">+ Repor</button>
      <button class="pcard-btn pcard-btn--danger btn-deletar" data-id="${p.id}">🗑 Deletar</button>
    </div>`;
  return card;
}

function openModal() {
  const form = document.getElementById("formEstoque");
  form.reset();
  document.getElementById("fSKU").value = gerarSKU();
  document.getElementById("catAddInline").classList.remove("visible");
  document.getElementById("modalEstoque").hidden = false;
  document.getElementById("fNome").focus();
}

function closeModal(id) {
  document.getElementById(id).hidden = true;
}

// ── Modal Gerenciar (Marcas + Categorias) ─────────────────────

function openModalGerenciar(tab = "marcas") {
  document.getElementById("modalGerenciar").hidden = false;
  switchTab(tab);
  renderMgrMarcas();
  renderMgrCategorias();
  bindGerenciarEvents();
}

function bindGerenciarEvents() {
  if (_gerenciarBound) return;
  _gerenciarBound = true;

  // Tabs
  document.querySelectorAll(".mgr-tab").forEach(btn =>
    btn.addEventListener("click", () => switchTab(btn.dataset.tab))
  );

  // Adicionar marca
  document.getElementById("formNovaMaraca").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome   = document.getElementById("mNome").value.trim();
    const margem = parseFloat(document.getElementById("mMargem").value);
    if (!nome || isNaN(margem)) return;
    try {
      await insertMarca({ nome, margem_padrao: margem });
      allMarcas = await fetchMarcas();
      populateMarcaSelects();
      renderMgrMarcas();
      document.getElementById("formNovaMaraca").reset();
      showToast(`Marca "${nome}" criada.`);
    } catch (err) { showToast(err.message, "error"); }
  });

  // Adicionar categoria
  document.getElementById("formNovaCat").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("cNome").value.trim();
    if (!nome) return;
    try {
      await insertCategoria(nome);
      allCategorias = await fetchCategorias();
      populateCatSelects();
      renderMgrCategorias();
      document.getElementById("formNovaCat").reset();
      showToast(`Categoria "${nome}" criada.`);
    } catch (err) { showToast(err.message, "error"); }
  });

  // Deletar via delegação
  document.getElementById("mgrMarcasList").addEventListener("click", async (e) => {
    const btn = e.target.closest(".mgr-item-del[data-mid]");
    if (!btn) return;
    if (!confirm(`Deletar marca "${btn.dataset.nome}"?`)) return;
    try {
      await deleteMarca(btn.dataset.mid);
      allMarcas = await fetchMarcas();
      populateMarcaSelects();
      renderMgrMarcas();
      showToast("Marca removida.");
    } catch (err) { showToast(err.message, "error"); }
  });

  document.getElementById("mgrCatList").addEventListener("click", async (e) => {
    const btn = e.target.closest(".mgr-item-del[data-cid]");
    if (!btn) return;
    if (!confirm(`Deletar categoria "${btn.dataset.nome}"?`)) return;
    try {
      await deleteCategoria(btn.dataset.cid);
      allCategorias = await fetchCategorias();
      populateCatSelects();
      renderMgrCategorias();
      showToast("Categoria removida.");
    } catch (err) { showToast(err.message, "error"); }
  });
}

function switchTab(tab) {
  document.querySelectorAll(".mgr-tab").forEach(b =>
    b.classList.toggle("mgr-tab--active", b.dataset.tab === tab)
  );
  document.querySelectorAll(".mgr-section").forEach(s =>
    s.classList.toggle("mgr-section--active", s.id === `mgr${tab.charAt(0).toUpperCase() + tab.slice(1)}`)
  );
}

function renderMgrMarcas() {
  const el = document.getElementById("mgrMarcasList");
  if (!el) return;
  if (!allMarcas.length) {
    el.innerHTML = `<p class="empty-state" style="padding:0.5rem">Nenhuma marca cadastrada.</p>`;
    return;
  }
  el.innerHTML = allMarcas.map(m => `
    <div class="mgr-item">
      <span class="mgr-item-nome">${m.nome}</span>
      <span class="mgr-item-sub">Margem: ${m.margem_padrao}%</span>
      <button class="mgr-item-del" data-mid="${m.id}" data-nome="${m.nome}" title="Deletar">🗑</button>
    </div>`).join("");
}

function renderMgrCategorias() {
  const el = document.getElementById("mgrCatList");
  if (!el) return;
  if (!allCategorias.length) {
    el.innerHTML = `<p class="empty-state" style="padding:0.5rem">Nenhuma categoria cadastrada.</p>`;
    return;
  }
  el.innerHTML = allCategorias.map(c => `
    <div class="mgr-item">
      <span class="mgr-item-nome">${c.nome}</span>
      <button class="mgr-item-del" data-cid="${c.id}" data-nome="${c.nome}" title="Deletar">🗑</button>
    </div>`).join("");
}

// ── Estado para repor/deletar ─────────────────────────────────
let pendingReporId = null;
let pendingDelId = null;

function handleGridClick(e) {
  const btnRepor = e.target.closest(".btn-repor");
  const btnDel   = e.target.closest(".btn-deletar");
  if (btnRepor) {
    pendingReporId = btnRepor.dataset.id;
    document.getElementById("reporNome").textContent = btnRepor.dataset.nome;
    document.getElementById("reporQtd").value = 1;
    document.getElementById("modalRepor").hidden = false;
    document.getElementById("reporQtd").focus();
  }
  if (btnDel) {
    pendingDelId = btnDel.dataset.id;
    document.getElementById("modalConfirmDel").hidden = false;
  }
}

// Confirmar repor / deletar (delegação global)
document.addEventListener("click", async (e) => {
  if (e.target.id === "btnConfirmarRepor") {
    const add = parseInt(document.getElementById("reporQtd").value, 10);
    if (!add || add <= 0) { showToast("Quantidade inválida", "error"); return; }
    try {
      const updated = await reporEstoque(pendingReporId, add);
      const idx = allProducts.findIndex(p => p.id === pendingReporId);
      if (idx !== -1) allProducts[idx] = { ...allProducts[idx], ...updated };
      applyFilters();
      closeModal("modalRepor");
      showToast(`+${add} unidades adicionadas.`);
    } catch (err) { showToast(err.message, "error"); }
  }

  if (e.target.id === "btnConfirmDel") {
    try {
      await deleteRoupa(pendingDelId);
      allProducts = allProducts.filter(p => p.id !== pendingDelId);
      applyFilters();
      closeModal("modalConfirmDel");
      showToast("Produto removido.");
    } catch (err) { showToast(err.message, "error"); }
  }
});

async function handleSubmitProduto(e) {
  e.preventDefault();
  if (!e.target.checkValidity()) { e.target.reportValidity(); return; }

  const btn = document.getElementById("btnSalvarProduto");
  btn.disabled = true; btn.textContent = "Salvando...";

  let imagem_url = document.getElementById("fImgUrl").value.trim() || null;
  const file = document.getElementById("fImgFile").files[0];
  if (file) imagem_url = await fileToDataUrl(file);

  // Resolve categoria: pode ser UUID (da tabela) ou nome direto (fallback)
  const catVal = document.getElementById("fCategoria").value;
  const catNome = allCategorias.find(c => c.id === catVal)?.nome ?? catVal;

  const marcaId = document.getElementById("fMarca").value || null;
  const precoCusto = parseFloat(document.getElementById("fPrecoCusto").value) || null;

  try {
    const novo = await insertRoupa({
      sku:        document.getElementById("fSKU").value.trim() || gerarSKU(),
      nome:       document.getElementById("fNome").value.trim(),
      categoria:  catNome,
      tamanho:    document.getElementById("fTamanho").value,
      cor:        document.getElementById("fCor").value,
      preco:      parseFloat(document.getElementById("fPreco").value),
      quantidade: parseInt(document.getElementById("fQtd").value, 10),
      imagem_url,
      marca_id:   marcaId,
      preco_custo: precoCusto,
    });
    allProducts.push(novo);
    allProducts.sort((a, b) => a.nome.localeCompare(b.nome));
    applyFilters();
    closeModal("modalEstoque");
    showToast(`"${novo.nome}" adicionado ao estoque.`);
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    btn.disabled = false; btn.textContent = "Salvar Produto";
  }
}
