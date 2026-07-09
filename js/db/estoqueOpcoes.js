import { db } from "../supabase.js";

const T = "estoque_opcoes";

export const DEFAULT_ESTOQUE_OPTIONS = {
  tamanho: ["Único", "PP", "P", "M", "G", "GG", "XGG", "34", "36", "38", "40", "42", "44", "46"],
  cor: ["Preto", "Branco", "Off-white", "Azul", "Jeans", "Vermelho", "Verde", "Rosa", "Bege", "Marrom", "Vinho", "Cinza", "Amarelo", "Outra"],
};

export async function fetchEstoqueOpcoes(tipo) {
  const { data, error } = await db
    .from(T)
    .select("*")
    .eq("tipo", tipo)
    .eq("ativo", true)
    .order("ordem")
    .order("nome");
  if (error && isMissingOptionsTable(error)) return fallbackOptions(tipo);
  if (error) throw error;
  return data?.length ? data : fallbackOptions(tipo);
}

export async function insertEstoqueOpcao(tipo, nome) {
  const ordem = Date.now();
  const { data, error } = await db
    .from(T)
    .insert({ tipo, nome, ordem, ativo: true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEstoqueOpcao(id, nome) {
  const { data, error } = await db
    .from(T)
    .update({ nome })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEstoqueOpcao(id) {
  const { error } = await db.from(T).delete().eq("id", id);
  if (error) throw error;
}

function fallbackOptions(tipo) {
  return (DEFAULT_ESTOQUE_OPTIONS[tipo] ?? []).map((nome, index) => ({
    id: `fallback-${tipo}-${index}`,
    tipo,
    nome,
    ordem: index + 1,
    ativo: true,
    fallback: true,
  }));
}

function isMissingOptionsTable(error) {
  const message = `${error?.message ?? ""} ${error?.details ?? ""}`;
  return message.includes(T) && (
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("Could not find")
  );
}
