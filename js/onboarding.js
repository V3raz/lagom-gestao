// ============================================================
// LAGOM GESTÃO — Modal de Boas-Vindas (Onboarding)
// Aparece apenas na primeira vez que o usuário abre o app
// ============================================================

const STORAGE_KEY = "lagom_onboarding_done";

const slides = [
  {
    icon: "✦",
    titulo: "Bem-vinda ao Lagom Gestão!",
    texto: "Seu sistema completo de estoque, vendas e clientes — feito para funcionar direto no celular, sem complicação.",
    dica: null,
  },
  {
    icon: "📦",
    titulo: "Gerencie seu Estoque",
    texto: "Cadastre cada peça com nome, tamanho, cor, preço e quantidade. Use o scanner de código de barras para agilizar o cadastro.",
    dica: "Antes de cadastrar peças, crie as Categorias e Marcas pelo botão ⚙ Gerenciar no Estoque.",
  },
  {
    icon: "🛒",
    titulo: "Registre suas Vendas",
    texto: "Abra um pedido, bipe ou busque as peças, escolha a forma de pagamento e finalize. O estoque é atualizado automaticamente!",
    dica: "Se a cliente vai pagar depois, selecione 'Anotado' — o valor vai direto pro Caderninho.",
  },
  {
    icon: "👤",
    titulo: "Conheça suas Clientes",
    texto: "Cadastre suas clientes, acompanhe o histórico de compras e veja quem tem saldo em aberto no Caderninho.",
    dica: "Para vendas no caderninho, associe o pedido a uma 'Cliente Cadastrada' ao criar.",
  },
  {
    icon: "🚀",
    titulo: "Tudo pronto!",
    texto: "Comece pelos primeiros passos: crie as Categorias → Marcas → Produtos → e faça sua primeira venda!",
    dica: "Dúvidas? A aba Ajuda na barra lateral tem tudo explicado em detalhes.",
  },
];

export function mostrarOnboardingSeNecessario() {
  if (localStorage.getItem(STORAGE_KEY)) return; // já viu
  _renderOnboarding();
}

function _renderOnboarding() {
  let currentSlide = 0;

  const overlay = document.createElement("div");
  overlay.className = "onboarding-overlay";
  overlay.innerHTML = `
    <div class="onboarding-box">
      <button class="onboarding-skip" id="obSkip">Pular →</button>
      <div class="onboarding-slides" id="obSlides"></div>
      <div class="onboarding-dots" id="obDots"></div>
      <div class="onboarding-actions">
        <button class="btn btn-secondary onboarding-btn-prev" id="obPrev">← Anterior</button>
        <button class="btn btn-primary onboarding-btn-next" id="obNext">Próximo →</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const slidesEl = document.getElementById("obSlides");
  const dotsEl   = document.getElementById("obDots");
  const prevBtn  = document.getElementById("obPrev");
  const nextBtn  = document.getElementById("obNext");
  const skipBtn  = document.getElementById("obSkip");

  // Renderiza slides
  slidesEl.innerHTML = slides.map((s, i) => `
    <div class="ob-slide ${i === 0 ? "ob-slide--active" : ""}" data-idx="${i}">
      <div class="ob-icon">${s.icon}</div>
      <h2 class="ob-titulo">${s.titulo}</h2>
      <p class="ob-texto">${s.texto}</p>
      ${s.dica ? `<div class="ob-dica">💡 ${s.dica}</div>` : ""}
    </div>`).join("");

  // Dots
  function renderDots() {
    dotsEl.innerHTML = slides.map((_, i) =>
      `<span class="ob-dot ${i === currentSlide ? "ob-dot--active" : ""}"></span>`
    ).join("");
  }

  function goTo(idx) {
    document.querySelectorAll(".ob-slide").forEach((el, i) =>
      el.classList.toggle("ob-slide--active", i === idx)
    );
    currentSlide = idx;
    renderDots();
    prevBtn.style.visibility = idx === 0 ? "hidden" : "visible";
    nextBtn.textContent = idx === slides.length - 1 ? "✓ Começar!" : "Próximo →";
  }

  function fechar() {
    localStorage.setItem(STORAGE_KEY, "1");
    overlay.classList.add("onboarding-saindo");
    setTimeout(() => overlay.remove(), 350);
  }

  nextBtn.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) goTo(currentSlide + 1);
    else fechar();
  });
  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) goTo(currentSlide - 1);
  });
  skipBtn.addEventListener("click", fechar);

  goTo(0); // inicializa
}

/** Abre o onboarding manualmente (ex: botão "Ver tutorial" na Ajuda) */
export function reabrirOnboarding() {
  localStorage.removeItem(STORAGE_KEY);
  _renderOnboarding();
}
