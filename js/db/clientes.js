import { db } from "../supabase.js";

const T = "clientes";

/** Busca clientes por nome ou telefone */
export async function fetchClientes(search = "") {
  let q = db.from(T).select("*").order("nome");
  // Remove caracteres que quebram a sintaxe do filtro .or() do Supabase
  search = search.replace(/[,()"']/g, "").trim();
  if (search) q = q.or(`nome.ilike.%${search}%,telefone.ilike.%${search}%`);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

/** Busca cliente por ID com histórico de pedidos */
export async function fetchClienteById(id) {
  const { data, error } = await db.from(T).select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

/** Busca últimos pedidos de um cliente */
export async function fetchPedidosCliente(clienteId, limit = 10) {
  const { data, error } = await db
    .from("pedidos")
    .select(`*, itens_pedido(id, roupa_id, quantidade, preco_unitario, roupas(id, nome, sku, barcode, tamanho, cor, imagem_url))`)
    .eq("cliente_id", clienteId)
    .eq("status", "finalizado")
    .order("finalizado_at", { ascending: false })
    .limit(limit);
  if (error && isMissingBarcodeColumn(error)) {
    return fetchPedidosClienteWithoutBarcode(clienteId, limit);
  }
  if (error) throw error;
  return data ?? [];
}

async function fetchPedidosClienteWithoutBarcode(clienteId, limit = 10) {
  const { data, error } = await db
    .from("pedidos")
    .select(`*, itens_pedido(id, roupa_id, quantidade, preco_unitario, roupas(id, nome, sku, tamanho, cor, imagem_url))`)
    .eq("cliente_id", clienteId)
    .eq("status", "finalizado")
    .order("finalizado_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

function isMissingBarcodeColumn(error) {
  const message = `${error?.message ?? ""} ${error?.details ?? ""}`;
  return message.includes("barcode") && (
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("Could not find")
  );
}

/** Remove cliente */
export async function deleteCliente(id) {
  const { error } = await db.from("clientes").delete().eq("id", id);
  if (error) throw error;
}

/** Insere novo cliente */
export async function insertCliente(dados) {
  const { data, error } = await db.from(T).insert(dados).select().single();
  if (error) throw error;
  return data;
}

/** Atualiza dados básicos do cliente */
export async function updateCliente(id, dados) {
  const { data, error } = await db.from(T).update(dados).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

/** Abate valor do débito pendente */
export async function abaterDebito(clienteId, valor) {
  const { data: cli, error: e1 } = await db.from(T).select("debito_pendente").eq("id", clienteId).single();
  if (e1) throw e1;
  const novoDebito = Math.max(0, cli.debito_pendente - valor);
  const { data, error } = await db.from(T).update({ debito_pendente: novoDebito }).eq("id", clienteId).select().single();
  if (error) throw error;
  return data;
}

/** Adiciona débito ao cliente (quando pagamento é 'anotado') */
export async function adicionarDebito(clienteId, valor) {
  const { data: cli, error: e1 } = await db.from(T).select("debito_pendente").eq("id", clienteId).single();
  if (e1) throw e1;
  const { data, error } = await db
    .from(T).update({ debito_pendente: cli.debito_pendente + valor }).eq("id", clienteId).select().single();
  if (error) throw error;
  return data;
}

async function devolverItensAoEstoque(pedidoId) {
  const { data: itens, error } = await db
    .from("itens_pedido")
    .select("roupa_id, quantidade")
    .eq("pedido_id", pedidoId);
  if (error) throw error;

  for (const item of itens ?? []) {
    const { data: roupa, error: e1 } = await db
      .from("roupas")
      .select("quantidade")
      .eq("id", item.roupa_id)
      .single();
    if (e1 || !roupa) continue;
    await db
      .from("roupas")
      .update({ quantidade: (roupa.quantidade ?? 0) + (Number(item.quantidade) || 0) })
      .eq("id", item.roupa_id);
  }
}

async function desfazerDebitoSeAnotado(pedido) {
  if (pedido?.forma_pagamento === "anotado" && pedido?.cliente_id && Number(pedido.total ?? 0) > 0) {
    await abaterDebito(pedido.cliente_id, Number(pedido.total));
  }
}

export async function cancelarPedidoHistorico(pedido) {
  await devolverItensAoEstoque(pedido.id);
  await desfazerDebitoSeAnotado(pedido);
  const { error } = await db
    .from("pedidos")
    .update({ status: "cancelado" })
    .eq("id", pedido.id);
  if (error) throw error;
}

export async function reabrirPedidoParaEditar(pedido) {
  await desfazerDebitoSeAnotado(pedido);
  const { data, error } = await db
    .from("pedidos")
    .update({
      status: "ativo",
      forma_pagamento: null,
      finalizado_at: null,
    })
    .eq("id", pedido.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
