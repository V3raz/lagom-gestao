// ============================================================
// LAGOM GESTÃO — Autenticação (Supabase Auth)
// ============================================================

import { db } from "./supabase.js";

/** Retorna a sessão atual, ou null se ninguém estiver logado. */
export async function getSession() {
  const { data } = await db.auth.getSession();
  return data.session;
}

/** Faz login com e-mail e senha. Lança erro em caso de falha. */
export async function signIn(email, senha) {
  const { data, error } = await db.auth.signInWithPassword({
    email,
    password: senha,
  });
  if (error) throw error;
  return data.session;
}

/** Encerra a sessão e recarrega, voltando pra tela de login. */
export async function signOut() {
  await db.auth.signOut();
  window.location.reload();
}

/** Mostra a tela de login. Chama onSucesso() quando o usuário entra. */
export function mostrarLogin(onSucesso) {
  const screen = document.getElementById("authScreen");
  const form   = document.getElementById("authForm");
  const erro   = document.getElementById("authErro");
  const btn    = document.getElementById("authSubmit");

  screen.hidden = false;
  document.getElementById("authEmail").focus();

  form.onsubmit = async (e) => {
    e.preventDefault();
    erro.hidden = true;

    const email = document.getElementById("authEmail").value.trim();
    const senha = document.getElementById("authSenha").value;
    if (!email || !senha) return;

    btn.disabled = true;
    btn.textContent = "Entrando...";
    try {
      await signIn(email, senha);
      form.reset();
      screen.hidden = true;
      onSucesso();
    } catch (err) {
      erro.textContent = traduzErro(err);
      erro.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = "Entrar";
    }
  };
}

/** Traduz mensagens de erro do Supabase pra algo amigável em português. */
function traduzErro(err) {
  const m = (err?.message || "").toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials"))
    return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed"))
    return "E-mail ainda não confirmado. Confira sua caixa de entrada.";
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Sem conexão com a internet. Tente de novo.";
  return "Não foi possível entrar. Tente de novo.";
}
