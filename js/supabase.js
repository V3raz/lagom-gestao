// Versão FIXADA de propósito: "@2" solto pegaria qualquer versão nova do CDN
// sem a gente testar (risco de quebrar o site ou de supply chain).
// Pra atualizar: troque o número, teste local e faça deploy.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

/** Intercepta respostas "JWT expired" (sessão vencida — ex.: relógio do
 *  celular errado engana o renovador automático). Renova o token e refaz
 *  a requisição uma vez; se a renovação falhar, volta pra tela de login
 *  em vez de deixar o app travado mostrando erro. */
async function fetchComRenovacao(input, init) {
  const resp = await fetch(input, init);
  if (resp.status !== 401) return resp;

  const corpo = await resp.clone().text().catch(() => "");
  if (!corpo.includes("JWT expired")) return resp;

  // Sem sessão (modo anônimo) não há o que renovar — devolve o erro normal
  const { data: sess } = await db.auth.getSession();
  if (!sess?.session) return resp;

  const { data, error } = await db.auth.refreshSession();
  if (error || !data?.session) {
    // Sessão irrecuperável: limpa e recomeça no login
    await db.auth.signOut().catch(() => {});
    window.location.reload();
    return resp;
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${data.session.access_token}`);
  return fetch(input, { ...init, headers });
}

export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { fetch: fetchComRenovacao },
});
