import { db } from "../supabase.js";

const T = "categorias";

/** Busca todas as categorias ordenadas por nome */
export async function fetchCategorias() {
  const { data, error } = await db.from(T).select("*").order("nome");
  if (error) throw error;
  return data ?? [];
}

/** Insere nova categoria */
export async function insertCategoria(nome) {
  const { data, error } = await db.from(T).insert({ nome }).select().single();
  if (error) throw error;
  return data;
}

/** Deleta categoria */
export async function deleteCategoria(id) {
  const { error } = await db.from(T).delete().eq("id", id);
  if (error) throw error;
}
