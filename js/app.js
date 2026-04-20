// ============================================================
// LAGOM GESTÃO — App Principal (Router + Shell)
// ============================================================

import * as Estoque    from "./views/estoque.js";
import * as Vendas     from "./views/vendas.js";
import * as Clientes   from "./views/clientes.js";
import * as Caderninho from "./views/caderninho.js";
import * as Ajuda      from "./views/ajuda.js";
import { mostrarOnboardingSeNecessario } from "./onboarding.js";

// Mapa de rotas
const routes = {
  "/estoque":    { module: Estoque,    label: "Estoque"    },
  "/vendas":     { module: Vendas,     label: "Vendas"     },
  "/clientes":   { module: Clientes,   label: "Clientes"   },
  "/caderninho": { module: Caderninho, label: "Caderninho" },
  "/ajuda":      { module: Ajuda,      label: "Ajuda"      },
};

const DEFAULT_ROUTE = "/estoque";

// ── Router ────────────────────────────────────────────────────

async function navigate(path) {
  const route = routes[path] ?? routes[DEFAULT_ROUTE];
  const finalPath = routes[path] ? path : DEFAULT_ROUTE;

  // Atualiza sidebar
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("nav-item--active", el.dataset.route === finalPath);
  });

  // Renderiza view
  const container = document.getElementById("viewContainer");
  container.innerHTML = route.module.renderView();

  // Título da página
  document.getElementById("pageTitle").textContent = "Lagom Gestão";

  // Inicializa lógica da view
  await route.module.initView();
}

// Normaliza hash: "estoque" → "/estoque", "/estoque" → "/estoque"
function normalizePath(hash) {
  const raw = hash.replace("#", "").replace(/^\/+/, "");
  const withSlash = "/" + raw;
  if (routes[withSlash]) return withSlash;
  if (routes[raw])       return raw;
  return DEFAULT_ROUTE;
}

// Escuta mudanças na hash
window.addEventListener("hashchange", () => {
  navigate(normalizePath(window.location.hash));
});

// ── Init ──────────────────────────────────────────────────────

function initSidebar() {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      window.location.hash = item.dataset.route;
    });
  });
}

function initTopbar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const toggle  = document.getElementById("btnMenuToggle");

  function openSidebar()  { sidebar.classList.add("sidebar--open");    overlay.classList.add("active"); }
  function closeSidebar() { sidebar.classList.remove("sidebar--open"); overlay.classList.remove("active"); }

  toggle?.addEventListener("click", () =>
    sidebar.classList.contains("sidebar--open") ? closeSidebar() : openSidebar()
  );
  overlay?.addEventListener("click", closeSidebar);

  // Fechar ao navegar (mobile)
  document.querySelectorAll(".nav-item").forEach(item =>
    item.addEventListener("click", () => {
      if (window.innerWidth < 768) closeSidebar();
    })
  );
}

// Arranca o app
function init() {
  initSidebar();
  initTopbar();
  // Navega diretamente — não depende de hashchange disparar
  navigate(normalizePath(window.location.hash));
  // Mostra onboarding na primeira visita
  mostrarOnboardingSeNecessario();
}

init();
