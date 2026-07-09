import { db } from "../supabase.js";

const T = "marcas";

/** Busca todas as marcas ordenadas por nome */
export async function fetchMarcas() {
  const { data, error } = await db.from(T).select("*").order("nome");
  if (error) throw error;
  return data ?? [];
}

function isMissingLogoColumn(error) {
  const message = `${error?.message ?? ""} ${error?.details ?? ""}`;
  return message.includes("logo_url") && (
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("Could not find")
  );
}

function withoutLogo(dados) {
  const { logo_url, ...rest } = dados;
  return rest;
}

/** Insere nova marca */
export async function insertMarca(dados) {
  const { data, error } = await db.from(T).insert(dados).select().single();
  if (error && isMissingLogoColumn(error)) {
    return insertMarca(withoutLogo(dados));
  }
  if (error) throw error;
  return data;
}

/** Atualiza marca existente */
export async function updateMarca(id, dados) {
  const { data, error } = await db.from(T).update(dados).eq("id", id).select().single();
  if (error && isMissingLogoColumn(error)) {
    return updateMarca(id, withoutLogo(dados));
  }
  if (error) throw error;
  return data;
}

/** Deleta marca */
export async function deleteMarca(id) {
  const { error } = await db.from(T).delete().eq("id", id);
  if (error) throw error;
}
