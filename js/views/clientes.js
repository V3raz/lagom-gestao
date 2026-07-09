import {
  fetchClientes,
  insertCliente,
  updateCliente,
  deleteCliente,
  fetchPedidosCliente,
  abaterDebito,
  cancelarPedidoHistorico,
  reabrirPedidoParaEditar,
} from "../db/clientes.js";
import { brl, dataBR, escapeAttr, escapeHtml, parseValorBR, showToast } from "../utils.js";

// ── Estado ────────────────────────────────────────────────────
let allClientes = [];
let historicoPedidosAtivos = [];
let historicoClienteAtual = null;

// ── Template ──────────────────────────────────────────────────
export function renderView() {
  return `
    <div class="view-clientes">
      <div class="view-header">
        <div>
          <h1 class="view-title">Clientes</h1>
          <p class="view-subtitle">Histórico, débitos e contato das clientes em um só lugar.</p>
        </div>
        <div class="view-controls">
          <div class="search-wrap">
            <svg class="search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="8.5" cy="8.5" r="5.5"/><path d="M17 17l-4-4"/>
            </svg>
            <input type="text" id="clientesSearch" class="search-input" placeholder="Nome / Telefone">
          </div>
        </div>
      </div>

      <div id="clientesSummary" class="clientes-summary"></div>

      <!-- Lista de clientes -->
      <div id="clientesList" class="clientes-list">
        <div class="loading"><div class="spinner"></div></div>
      </div>

      <!-- FAB Adicionar -->
      <button id="fabClientes" class="fab" title="Novo cliente" aria-label="Novo cliente">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>

      <!-- Modal Novo/Editar Cliente -->
      <div id="modalCliente" class="modal-overlay" hidden>
        <div class="modal">
          <div class="modal-header">
            <h2 id="modalClienteTitulo">Novo Cliente</h2>
            <button class="modal-close" data-close="modalCliente">&times;</button>
          </div>
          <form id="formCliente" class="modal-form" novalidate>
            <div class="form-group">
              <label>Nome <span class="req">*</span></label>
              <input type="text" id="cNome" required placeholder="Nome completo">
            </div>
            <div class="form-group">
              <label>Telefone</label>
              <input type="tel" id="cTelefone" placeholder="(00) 00000-0000">
            </div>
            <div class="form-group">
              <label>Aniversário</label>
              <input type="date" id="cAniversario">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" data-close="modalCliente">Cancelar</button>
              <button type="submit" id="btnSalvarCliente" class="btn btn-primary">Salvar Cliente</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Detalhes / Histórico -->
      <div id="modalDetalhesCliente" class="modal-overlay" hidden>
        <div class="modal">
          <div class="modal-header">
            <h2 id="detalheNome">Cliente</h2>
            <button class="modal-close" data-close="modalDetalhesCliente">&times;</button>
          </div>
          <div id="detalheContent" class="modal-form">
            <div class="loading"><div class="spinner"></div></div>
          </div>
        </div>
      </div>

    </div>`;
}

// ── Init ──────────────────────────────────────────────────────
export async function initView() {
  await loadClientes();

  // Busca em tempo real
  let searchTimer;
  document.getElementById("clientesSearch").addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilter, 250);
  });

  // FAB → abre modal
  document.getElementById("fabClientes").addEventListener("click", () => {
    openClienteModal();
  });

  // Submit novo cliente
  document.getElementById("formCliente").addEventListener("submit", handleSubmitCliente);

  // Fechar modais
  document.querySelectorAll("[data-close]").forEach(btn =>
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.close).hidden = true;
    })
  );

  // Fechar ao clicar fora
  ["modalCliente", "modalDetalhesCliente"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", e => {
      if (e.target.id === id) document.getElementById(id).hidden = true;
    });
  });

  // Delegação: abrir detalhes / abater débito
  document.getElementById("clientesList").addEventListener("click", handleListClick);
  document.getElementById("detalheContent").addEventListener("click", handleHistoricoClick);
}

// ── Funções internas ──────────────────────────────────────────

async function loadClientes() {
  const el = document.getElementById("clientesList");
  if (!el) return;
  el.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;
  try {
    allClientes = await fetchClientes();
    if (!document.getElementById("clientesList")) return;
    renderList(allClientes);
  } catch (err) {
    showToast(err.message, "error");
    if (document.getElementById("clientesList")) el.innerHTML = "";
  }
}

function applyFilter() {
  const q = document.getElementById("clientesSearch").value.toLowerCase();
  const filtered = allClientes.filter(c =>
    c.nome.toLowerCase().includes(q) ||
    (c.telefone ?? "").toLowerCase().includes(q)
  );
  renderList(filtered);
}

function renderList(clientes) {
  const el = document.getElementById("clientesList");
  if (!el) return;
  renderSummary(clientes);
  if (!clientes.length) {
    el.innerHTML = `<p class="empty-state">Nenhum cliente encontrado.</p>`;
    return;
  }
  el.innerHTML = clientes.map(c => `
    <div class="cliente-card" data-id="${escapeAttr(c.id)}">
      <div class="cliente-info">
        <span class="cliente-nome">${escapeHtml(c.nome)}</span>
        ${c.aniversario ? `<span class="cliente-birthday">Aniversário: ${escapeHtml(formatBirthday(c.aniversario))}</span>` : ""}
        <span class="cliente-tel">${escapeHtml(c.telefone ?? "—")}</span>
      </div>
      <div class="cliente-meta">
        <button class="btn btn-secondary btn-sm btn-editar-cliente" data-id="${escapeAttr(c.id)}">Editar</button>
        ${c.debito_pendente > 0
          ? `<span class="debito-badge">Débito: ${brl(c.debito_pendente)}</span>`
          : `<span class="debito-ok">Sem débito</span>`}
        <button class="btn btn-secondary btn-sm btn-historico" data-id="${escapeAttr(c.id)}" data-nome="${escapeAttr(c.nome)}">Histórico</button>
        ${c.debito_pendente > 0
          ? `<button class="btn btn-primary btn-sm btn-abater" data-id="${escapeAttr(c.id)}" data-debito="${escapeAttr(c.debito_pendente)}">Abater</button>`
          : ""}
        <button class="btn btn-sm btn-deletar-cliente" data-id="${escapeAttr(c.id)}" data-nome="${escapeAttr(c.nome)}" style="color:var(--danger)" title="Remover cliente">🗑</button>
      </div>
    </div>`).join("");
}

function renderSummary(clientes) {
  const el = document.getElementById("clientesSummary");
  if (!el) return;
  const totalClientes = clientes.length;
  const clientesComDebito = clientes.filter(c => Number(c.debito_pendente ?? 0) > 0);
  const totalDebito = clientesComDebito.reduce((sum, c) => sum + Number(c.debito_pendente ?? 0), 0);

  el.innerHTML = `
    <div class="cliente-stat">
      <span>Clientes</span>
      <strong>${escapeHtml(totalClientes)}</strong>
    </div>
    <div class="cliente-stat">
      <span>Com débito</span>
      <strong>${escapeHtml(clientesComDebito.length)}</strong>
    </div>
    <div class="cliente-stat cliente-stat--debt">
      <span>Total em aberto</span>
      <strong>${brl(totalDebito)}</strong>
    </div>`;
}

function formatBirthday(value) {
  const [year, month, day] = String(value ?? "").split("-");
  if (!month || !day) return value;
  return `${day}/${month}`;
}

function openClienteModal(cliente = null) {
  const form = document.getElementById("formCliente");
  form.reset();
  if (cliente) {
    form.dataset.editingId = cliente.id;
    document.getElementById("modalClienteTitulo").textContent = "Editar Cliente";
    document.getElementById("btnSalvarCliente").textContent = "Salvar Alterações";
    document.getElementById("cNome").value = cliente.nome ?? "";
    document.getElementById("cTelefone").value = cliente.telefone ?? "";
    document.getElementById("cAniversario").value = cliente.aniversario ?? "";
  } else {
    delete form.dataset.editingId;
    document.getElementById("modalClienteTitulo").textContent = "Novo Cliente";
    document.getElementById("btnSalvarCliente").textContent = "Salvar Cliente";
  }
  document.getElementById("modalCliente").hidden = false;
  document.getElementById("cNome").focus();
}

async function handleListClick(e) {
  const btnHistorico = e.target.closest(".btn-historico");
  const btnAbater    = e.target.closest(".btn-abater");
  const btnEditar    = e.target.closest(".btn-editar-cliente");

  if (btnEditar) {
    const cliente = allClientes.find(c => c.id === btnEditar.dataset.id);
    if (cliente) openClienteModal(cliente);
    return;
  }

  if (btnHistorico) {
    const id   = btnHistorico.dataset.id;
    const nome = btnHistorico.dataset.nome;
    historicoClienteAtual = { id, nome };
    document.getElementById("detalheNome").textContent = nome;
    document.getElementById("detalheContent").innerHTML =
      `<div class="loading"><div class="spinner"></div></div>`;
    document.getElementById("modalDetalhesCliente").hidden = false;
    try {
      await renderHistoricoCliente(id);
    } catch (err) {
      document.getElementById("detalheContent").innerHTML =
        `<p class="empty-state">Erro ao carregar histórico.</p>`;
      showToast(err.message, "error");
    }
  }

  const btnDeletar = e.target.closest(".btn-deletar-cliente");
  if (btnDeletar) {
    const id   = btnDeletar.dataset.id;
    const nome = btnDeletar.dataset.nome;
    if (!confirm(`Remover "${nome}" permanentemente?`)) return;
    try {
      await deleteCliente(id);
      allClientes = allClientes.filter(c => c.id !== id);
      renderList(allClientes);
      showToast(`"${nome}" removido.`);
    } catch (err) { showToast(err.message, "error"); }
  }

  if (btnAbater) {
    const id     = btnAbater.dataset.id;
    const debito = parseFloat(btnAbater.dataset.debito);
    const entrada = prompt(`Abater quanto do débito de ${brl(debito)}?`);
    if (entrada == null) return; // cancelou
    // Formato brasileiro: "1.520,00" e "1520" funcionam ("1.520" é milhar)
    const valor = parseValorBR(entrada);
    if (isNaN(valor) || valor <= 0) {
      showToast("Valor inválido. Ex.: 1520 ou 1.520,00", "error");
      return;
    }
    if (valor > debito) {
      showToast(`Valor maior que o débito (${brl(debito)}).`, "error");
      return;
    }
    try {
      await abaterDebito(id, valor);
      showToast(`${brl(valor)} abatido do débito.`);
      await loadClientes();
    } catch (err) {
      showToast(err.message, "error");
    }
  }
}

async function renderHistoricoCliente(clienteId) {
  const pedidos = await fetchPedidosCliente(clienteId);
  historicoPedidosAtivos = pedidos;
  const content = document.getElementById("detalheContent");
  if (!pedidos.length) {
    content.innerHTML = `<p class="empty-state">Nenhum pedido finalizado ainda.</p>`;
    return;
  }
  content.innerHTML = pedidos.map(buildPedidoHistorico).join("");
}

async function handleHistoricoClick(e) {
  const btnEditar = e.target.closest(".btn-editar-pedido");
  const btnExcluir = e.target.closest(".btn-excluir-pedido");
  if (!btnEditar && !btnExcluir) return;

  const pedidoId = (btnEditar || btnExcluir).dataset.pid;
  const pedido = historicoPedidosAtivos.find(p => p.id === pedidoId);
  if (!pedido) {
    showToast("Pedido não encontrado no histórico.", "error");
    return;
  }

  if (btnEditar) {
    if (!confirm("Reabrir este pedido em Vendas para editar? Se ele era Anotado, o débito será ajustado para não duplicar.")) return;
    try {
      await reabrirPedidoParaEditar(pedido);
      sessionStorage.setItem("lagom_editar_pedido_id", pedido.id);
      document.getElementById("modalDetalhesCliente").hidden = true;
      await loadClientes();
      showToast(`Pedido #${pedido.numero} reaberto para edição.`);
      window.location.hash = "/vendas";
    } catch (err) {
      showToast(err.message, "error");
    }
    return;
  }

  if (!confirm("Excluir/cancelar este pedido? Os itens voltam para o estoque e, se era Anotado, o débito será abatido.")) return;
  try {
    await cancelarPedidoHistorico(pedido);
    showToast(`Pedido #${pedido.numero} cancelado.`);
    await loadClientes();
    if (historicoClienteAtual?.id) await renderHistoricoCliente(historicoClienteAtual.id);
  } catch (err) {
    showToast(err.message, "error");
  }
}

function buildPedidoHistorico(pedido) {
  const itens = pedido.itens_pedido ?? [];
  const subtotal = itens.reduce((sum, item) => sum + Number(item.preco_unitario ?? 0) * Number(item.quantidade ?? 0), 0);
  const numero = pedido.numero ? `#${pedido.numero}` : `#${String(pedido.id).slice(-6).toUpperCase()}`;
  const pagamento = pedido.forma_pagamento ? ` · ${labelPagamento(pedido.forma_pagamento)}` : "";

  return `
    <section class="hist-pedido">
      <div class="hist-pedido-head">
        <div>
          <strong>Pedido ${escapeHtml(numero)}</strong>
          <div class="hist-pedido-meta">${dataBR(pedido.finalizado_at ?? pedido.created_at)}${escapeHtml(pagamento)}</div>
        </div>
        <strong>${brl(pedido.total)}</strong>
      </div>
      <div class="hist-pedido-actions">
        <button type="button" class="btn btn-secondary btn-sm btn-editar-pedido" data-pid="${escapeAttr(pedido.id)}">Editar</button>
        <button type="button" class="btn btn-danger btn-sm btn-excluir-pedido" data-pid="${escapeAttr(pedido.id)}">Excluir</button>
      </div>
      <div class="hist-itens">
        ${itens.length
          ? itens.map(buildItemHistorico).join("")
          : `<p class="empty-state">Pedido sem itens registrados.</p>`}
      </div>
      ${itens.length ? `
        <div class="hist-pedido-total">
          <span>Subtotal dos itens</span>
          <span>${brl(subtotal)}</span>
        </div>` : ""}
    </section>`;
}

function buildItemHistorico(item) {
  const roupa = item.roupas ?? {};
  const codigo = roupa.barcode || roupa.sku || "sem código";
  const quantidade = Number(item.quantidade ?? 0);
  const unitario = Number(item.preco_unitario ?? 0);

  return `
    <div class="hist-item-row">
      ${roupa.imagem_url
        ? `<img class="hist-item-img" src="${escapeAttr(roupa.imagem_url)}" alt="${escapeAttr(roupa.nome)}">`
        : `<div class="hist-item-img hist-item-img--empty">👗</div>`}
      <div class="hist-item-info">
        <strong>${escapeHtml(roupa.nome || "Produto removido")}</strong>
        <span>${escapeHtml(codigo)} · Tam: ${escapeHtml(roupa.tamanho || "-")} · Cor: ${escapeHtml(roupa.cor || "-")}</span>
      </div>
      <div class="hist-item-price">
        <span>${escapeHtml(quantidade)}x</span>
        <strong>${brl(unitario * quantidade)}</strong>
      </div>
    </div>`;
}

function labelPagamento(value) {
  const labels = { pix: "Pix", cartao: "Cartão", dinheiro: "Dinheiro", anotado: "Anotado" };
  return labels[value] ?? value;
}

async function handleSubmitCliente(e) {
  e.preventDefault();
  if (!e.target.checkValidity()) { e.target.reportValidity(); return; }

  const btn = document.getElementById("btnSalvarCliente");
  const editingId = e.target.dataset.editingId;
  btn.disabled = true; btn.textContent = "Salvando...";

  try {
    const payload = {
      nome:     document.getElementById("cNome").value.trim(),
      telefone: document.getElementById("cTelefone").value.trim() || null,
      aniversario: document.getElementById("cAniversario").value || null,
      debito_pendente: 0,
    };
    const salvo = editingId
      ? await updateCliente(editingId, {
          nome: payload.nome,
          telefone: payload.telefone,
          aniversario: payload.aniversario,
        })
      : await insertCliente(payload);
    const index = allClientes.findIndex(c => c.id === salvo.id);
    if (index >= 0) allClientes[index] = { ...allClientes[index], ...salvo };
    else allClientes.push(salvo);
    allClientes.sort((a, b) => a.nome.localeCompare(b.nome));
    renderList(allClientes);
    document.getElementById("modalCliente").hidden = true;
    delete e.target.dataset.editingId;
    showToast(editingId ? `"${salvo.nome}" atualizado.` : `"${salvo.nome}" adicionado.`);
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    btn.disabled = false; btn.textContent = editingId ? "Salvar Alterações" : "Salvar Cliente";
  }
}
