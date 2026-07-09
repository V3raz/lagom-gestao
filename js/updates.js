// ============================================================
// LAGOM GESTÃO — Aviso de Atualização
//
// Como funciona: a cada deploy com mudança visível, adicione uma
// entrada NO TOPO do CHANGELOG abaixo (versão = data, itens em
// linguagem simples). Na primeira visita após o deploy, um aviso
// grande aparece na tela inicial explicando o que mudou; ao clicar
// em "Entendi", ele some e não volta até a próxima versão.
// ============================================================

import { escapeHtml } from "./utils.js";

const CHANGELOG = [
  {
    versao: "2026-07-09",
    titulo: "O visual da loja voltou — e agora com login!",
    itens: [
      "As logos das marcas voltaram a aparecer nas peças sem foto própria.",
      "A tela de Clientes voltou ao normal (cards, aniversários e débitos).",
      "Agora o sistema pede login pra entrar — seus dados estão protegidos. Use o e-mail e a senha que o Gustavo te passou.",
      "Abater débito aceita valores como 1.520,00 sem erro.",
      "Fotos de produto são comprimidas sozinhas — pode mandar foto do celular sem medo.",
    ],
  },
];

const STORAGE_KEY = "lagom_versao_vista";

/** Mostra o aviso de atualização se houver versão nova desde a última visita. */
export function mostrarAvisoAtualizacao() {
  const atual = CHANGELOG[0];
  if (!atual) return;
  if (localStorage.getItem(STORAGE_KEY) === atual.versao) return;

  const viewContainer = document.getElementById("viewContainer");
  if (!viewContainer) return;

  const banner = document.createElement("div");
  banner.className = "update-banner";
  banner.innerHTML = `
    <div class="update-banner-head">
      <span class="update-banner-badge">🔔 ATUALIZAÇÃO</span>
      <span class="update-banner-titulo">${escapeHtml(atual.titulo)}</span>
    </div>
    <ul class="update-banner-lista">
      ${atual.itens.map(i => `<li>${escapeHtml(i)}</li>`).join("")}
    </ul>
    <button class="btn btn-primary btn-sm update-banner-ok">✓ Entendi</button>
  `;

  banner.querySelector(".update-banner-ok").addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEY, atual.versao);
    banner.remove();
  });

  viewContainer.parentElement.insertBefore(banner, viewContainer);
}
