import { db } from "../supabase.js";

const T = "roupas";

/** Busca todos os produtos com filtros opcionais */
export async function fetchRoupas({ search = "", tamanho = "", cor = "", categoria = "", marca_id = "" } = {}) {
  // Remove caracteres que quebram a sintaxe do filtro .or() do Supabase
  search = search.replace(/[,()"']/g, "").trim();
  let q = db.from(T).select("*, marcas(id, nome, margem_padrao, logo_url)").order("nome");
  if (tamanho)   q = q.eq("tamanho", tamanho);
  if (cor)       q = q.eq("cor", cor);
  if (categoria) q = q.eq("categoria", categoria);
  if (marca_id)  q = q.eq("marca_id", marca_id);
  if (search)    q = q.or(`nome.ilike.%${search}%,sku.ilike.%${search}%,barcode.ilike.%${search}%`);
  const { data, error } = await q;
  if (error && isMissingBrandLogoColumn(error)) {
    return fetchRoupasWithoutBrandLogo({ search, tamanho, cor, categoria, marca_id });
  }
  if (error && isMissingBarcodeColumn(error)) {
    return fetchRoupasWithoutBarcode({ search, tamanho, cor, categoria, marca_id });
  }
  if (error) throw error;
  return data ?? [];
}

async function fetchRoupasWithoutBrandLogo({ search = "", tamanho = "", cor = "", categoria = "", marca_id = "" } = {}) {
  let q = db.from(T).select("*, marcas(id, nome, margem_padrao)").order("nome");
  if (tamanho)   q = q.eq("tamanho", tamanho);
  if (cor)       q = q.eq("cor", cor);
  if (categoria) q = q.eq("categoria", categoria);
  if (marca_id)  q = q.eq("marca_id", marca_id);
  if (search)    q = q.or(`nome.ilike.%${search}%,sku.ilike.%${search}%,barcode.ilike.%${search}%`);
  const { data, error } = await q;
  if (error && isMissingBarcodeColumn(error)) {
    return fetchRoupasWithoutBarcode({ search, tamanho, cor, categoria, marca_id });
  }
  if (error) throw error;
  return data ?? [];
}

async function fetchRoupasWithoutBarcode({ search = "", tamanho = "", cor = "", categoria = "", marca_id = "" } = {}) {
  let q = db.from(T).select("*, marcas(id, nome, margem_padrao)").order("nome");
  if (tamanho)   q = q.eq("tamanho", tamanho);
  if (cor)       q = q.eq("cor", cor);
  if (categoria) q = q.eq("categoria", categoria);
  if (marca_id)  q = q.eq("marca_id", marca_id);
  if (search)    q = q.or(`nome.ilike.%${search}%,sku.ilike.%${search}%`);
  const { data, error } = await q;
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

function isMissingBrandLogoColumn(error) {
  const message = `${error?.message ?? ""} ${error?.details ?? ""}`;
  return message.includes("logo_url") && (
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("Could not find")
  );
}

function withoutBarcode(dados) {
  const { barcode, ...rest } = dados;
  if (barcode) {
    rest.sku = barcode;
  }
  return rest;
}

/** Incrementa quantidade em estoque (usado pelo Repor) */
export async function reporEstoque(id, adicionar) {
  if (!Number.isInteger(adicionar) || adicionar <= 0) {
    throw new Error("Informe uma quantidade maior que zero para repor.");
  }
  const { data: atual, error: e1 } = await db.from(T).select("quantidade").eq("id", id).single();
  if (e1) throw e1;
  const { data, error } = await db
    .from(T).update({ quantidade: atual.quantidade + adicionar }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

/** Remove um produto */
export async function deleteRoupa(id) {
  const { error } = await db.from(T).delete().eq("id", id);
  if (error) throw error;
}

/** Insere novo produto */
export async function insertRoupa(dados) {
  const { data, error } = await db.from(T).insert(dados).select().single();
  if (error && isMissingBarcodeColumn(error)) {
    return insertRoupa(withoutBarcode(dados));
  }
  if (error) throw error;
  return data;
}

/** Atualiza produto existente */
export async function updateRoupa(id, dados) {
  const { data, error } = await db.from(T).update(dados).eq("id", id).select().single();
  if (error && isMissingBarcodeColumn(error)) {
    return updateRoupa(id, withoutBarcode(dados));
  }
  if (error) throw error;
  return data;
}

/** Desconta quantidade (chamado ao adicionar item no pedido) */
export async function descontarEstoque(id, qtd) {
  if (!Number.isInteger(qtd) || qtd <= 0) {
    throw new Error("Quantidade inválida para venda.");
  }
  const { data: atual, error: e1 } = await db.from(T).select("quantidade").eq("id", id).single();
  if (e1) throw e1;
  if ((atual.quantidade ?? 0) < qtd) {
    throw new Error("Estoque insuficiente para este produto.");
  }
  const nova = atual.quantidade - qtd;
  const { data, error } = await db.from(T).update({ quantidade: nova }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
