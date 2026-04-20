// ============================================================
// LAGOM GESTÃO — Aba de Ajuda
// Guia completo de uso do sistema
// ============================================================

import { reabrirOnboarding } from "../onboarding.js";

export function renderView() {
  return `
    <div class="view-ajuda">

      <!-- Hero -->
      <div class="ajuda-hero">
        <div class="ajuda-hero-inner">
          <span class="ajuda-hero-icon">✦</span>
          <h1 class="ajuda-hero-title">Central de Ajuda</h1>
          <p class="ajuda-hero-sub">Tudo que você precisa saber para usar o Lagom Gestão com confiança.</p>
          <button id="btnVerTutorial" class="btn btn-primary" style="margin-top:1.25rem;gap:0.5rem">
            🎬 Ver Tutorial de Boas-Vindas
          </button>
        </div>
      </div>

      <!-- Índice rápido -->
      <nav class="ajuda-indice">
        <a class="ajuda-indice-item" href="#sec-inicio">🚀 Primeiros Passos</a>
        <a class="ajuda-indice-item" href="#sec-estoque">📦 Estoque</a>
        <a class="ajuda-indice-item" href="#sec-vendas">🛒 Vendas</a>
        <a class="ajuda-indice-item" href="#sec-clientes">👤 Clientes</a>
        <a class="ajuda-indice-item" href="#sec-caderninho">📓 Caderninho</a>
        <a class="ajuda-indice-item" href="#sec-scanner">📷 Scanner</a>
        <a class="ajuda-indice-item" href="#sec-faq">❓ FAQ</a>
      </nav>

      <div class="ajuda-body">

        <!-- ===== PRIMEIROS PASSOS ===== -->
        <section class="ajuda-sec" id="sec-inicio">
          <h2 class="ajuda-sec-title">🚀 Primeiros Passos</h2>

          <div class="ajuda-destaque">
            <strong>Bem-vinda ao Lagom Gestão!</strong> Este app foi feito especialmente para você
            gerenciar estoque, vendas, clientes e o caderninho de dívidas — tudo num só lugar,
            pelo celular ou computador.
          </div>

          <p class="ajuda-p">Para começar do zero, siga esta ordem:</p>

          <div class="ajuda-steps">
            <div class="ajuda-step">
              <div class="ajuda-step-num">1</div>
              <div>
                <strong>Cadastre as Categorias</strong>
                <p>Vá em <b>Estoque → ⚙ Gerenciar → Categorias</b> e adicione os tipos de peça que você vende (Camiseta, Calça, Vestido, etc.).</p>
              </div>
            </div>
            <div class="ajuda-step">
              <div class="ajuda-step-num">2</div>
              <div>
                <strong>Cadastre as Marcas</strong>
                <p>Na mesma tela, vá em <b>Marcas</b> e adicione as marcas com a margem de lucro padrão de cada uma (ex: ZARA — 80%). Isso permite calcular preço de venda automaticamente.</p>
              </div>
            </div>
            <div class="ajuda-step">
              <div class="ajuda-step-num">3</div>
              <div>
                <strong>Cadastre seus Produtos</strong>
                <p>Em <b>Estoque</b>, clique no botão dourado no canto inferior direito (📦) para adicionar cada peça com nome, tamanho, cor, preço e quantidade.</p>
              </div>
            </div>
            <div class="ajuda-step">
              <div class="ajuda-step-num">4</div>
              <div>
                <strong>Registre seus Clientes</strong>
                <p>Em <b>Clientes</b>, cadastre as clientes que compram fiado ou que você quer acompanhar o histórico de compras.</p>
              </div>
            </div>
            <div class="ajuda-step">
              <div class="ajuda-step-num">5</div>
              <div>
                <strong>Faça sua Primeira Venda</strong>
                <p>Em <b>Vendas</b>, clique em <b>+ Novo Pedido</b>, escolha o tipo (balcão, expressa ou cliente), adicione as peças e finalize com a forma de pagamento.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ===== ESTOQUE ===== -->
        <section class="ajuda-sec" id="sec-estoque">
          <h2 class="ajuda-sec-title">📦 Estoque</h2>
          <p class="ajuda-p">O estoque é o coração do sistema. Aqui você vê, cadastra, filtra e gerencia todas as peças disponíveis.</p>

          <h3 class="ajuda-sub">Cadastrar um Produto Novo</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Clique no botão dourado com ícone de código de barras no canto inferior direito da tela.</li>
            <li>Preencha os campos:
              <ul class="ajuda-list ajuda-list--sub">
                <li><b>Código de Barras:</b> escanei com a câmera (📷) ou digiti manualmente. Campo opcional.</li>
                <li><b>Nome da Peça:</b> ex. "Vestido Floral Branco". Obrigatório.</li>
                <li><b>SKU:</b> código interno automático (clique em ↻ para gerar). Opcional.</li>
                <li><b>Categoria:</b> selecione ou crie uma nova clicando no "+". Obrigatório.</li>
                <li><b>Marca:</b> selecione a marca da peça (opcional). Com marca, você pode calcular o preço de venda automaticamente.</li>
                <li><b>Tamanho:</b> PP, P, M, G, GG, XGG ou numeração (34–46). Obrigatório.</li>
                <li><b>Cor:</b> escolha na lista. Obrigatório.</li>
                <li><b>Preço de Custo:</b> quanto você pagou pela peça. Opcional, mas necessário para usar o botão "Calcular".</li>
                <li><b>Preço de Venda:</b> quanto você vai cobrar. Obrigatório. Ou clique em <b>Calcular</b> para aplicar a margem da marca automaticamente.</li>
                <li><b>Quantidade:</b> quantas peças dessa variação você tem em estoque. Obrigatório.</li>
                <li><b>Imagem:</b> cole um link de imagem ou escolha uma foto do seu celular. Opcional, mas recomendado.</li>
              </ul>
            </li>
            <li>Clique em <b>Salvar Produto</b>. A peça aparece imediatamente no estoque.</li>
          </ol>

          <div class="ajuda-tip">
            💡 <strong>Dica:</strong> Cada combinação de cor + tamanho é um produto separado. Se você tem um vestido em P azul e P preto, cadastre como dois produtos diferentes com quantidades diferentes.
          </div>

          <h3 class="ajuda-sub">Filtrar Produtos</h3>
          <p class="ajuda-p">Use os filtros no topo da tela para encontrar peças rapidamente:</p>
          <ul class="ajuda-list">
            <li><b>Campo de busca:</b> Digite parte do nome ou SKU da peça.</li>
            <li><b>Tamanho:</b> filtra por tamanho específico.</li>
            <li><b>Cor:</b> filtra por cor específica.</li>
            <li><b>Categoria:</b> filtra por tipo de peça (ex: só Vestidos).</li>
            <li><b>Marca:</b> filtra por marca específica.</li>
          </ul>
          <p class="ajuda-p">Todos os filtros funcionam juntos — você pode combinar como quiser.</p>

          <h3 class="ajuda-sub">Repor Estoque</h3>
          <p class="ajuda-p">Quando chegam peças novas de um produto que já está cadastrado:</p>
          <ol class="ajuda-list ajuda-list--num">
            <li>Encontre o produto no estoque.</li>
            <li>Clique em <b>+ Repor</b> no cartão do produto.</li>
            <li>Digite a quantidade a adicionar.</li>
            <li>Clique em <b>+ Adicionar</b>. O estoque é atualizado automaticamente.</li>
          </ol>

          <h3 class="ajuda-sub">Deletar um Produto</h3>
          <p class="ajuda-p">Para remover uma peça do estoque:</p>
          <ol class="ajuda-list ajuda-list--num">
            <li>Encontre o produto no estoque.</li>
            <li>Clique em <b>🗑 Deletar</b> no cartão do produto.</li>
            <li>Confirme a exclusão. <span class="ajuda-warn">⚠️ Esta ação não tem como desfazer.</span></li>
          </ol>

          <h3 class="ajuda-sub">Gerenciar Marcas e Categorias</h3>
          <p class="ajuda-p">Clique em <b>⚙ Gerenciar</b> no topo do estoque para:</p>
          <ul class="ajuda-list">
            <li>Adicionar, visualizar e deletar marcas (com margem de lucro padrão).</li>
            <li>Adicionar, visualizar e deletar categorias de produtos.</li>
          </ul>

          <div class="ajuda-tip">
            💡 <strong>Calcular Preço com Margem:</strong> No formulário de novo produto, selecione a marca, preencha o <b>Preço de Custo</b> e clique em <b>Calcular</b>. O sistema aplica a margem da marca automaticamente e preenche o preço de venda.
          </div>
        </section>

        <!-- ===== VENDAS ===== -->
        <section class="ajuda-sec" id="sec-vendas">
          <h2 class="ajuda-sec-title">🛒 Vendas</h2>
          <p class="ajuda-p">A tela de Vendas é o caixa do seu negócio. Aqui você registra cada venda, adiciona as peças vendidas, aplica descontos e finaliza com a forma de pagamento.</p>

          <h3 class="ajuda-sub">Criar um Novo Pedido</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Clique em <b>+ Novo Pedido</b>.</li>
            <li>Escolha o tipo de venda:
              <ul class="ajuda-list ajuda-list--sub">
                <li><b>Venda Balcão:</b> cliente presente, pagamento na hora.</li>
                <li><b>Venda Expressa:</b> venda rápida sem identificar o cliente.</li>
                <li><b>Cliente Cadastrado:</b> associa a venda a um cliente específico (necessário para registrar no caderninho).</li>
              </ul>
            </li>
            <li>Clique em <b>Criar Pedido</b>. O pedido aparece na lista e abre automaticamente.</li>
          </ol>

          <h3 class="ajuda-sub">Adicionar Peças ao Pedido</h3>
          <p class="ajuda-p">Com o pedido aberto à direita, você tem duas formas de adicionar peças:</p>

          <div class="ajuda-metodos">
            <div class="ajuda-metodo">
              <div class="ajuda-metodo-icon">📷</div>
              <div>
                <strong>Escanear Código de Barras</strong>
                <p>Clique em 📷 ao lado do campo de busca. Aponte a câmera para o código da peça. Se encontrar um produto exato, já pergunta para confirmar a adição.</p>
              </div>
            </div>
            <div class="ajuda-metodo">
              <div class="ajuda-metodo-icon">🔍</div>
              <div>
                <strong>Buscar por Nome ou SKU</strong>
                <p>Digite o nome ou código SKU no campo de busca. Os produtos aparecem filtrados abaixo. Clique no cartão da peça para adicionar.</p>
              </div>
            </div>
            <div class="ajuda-metodo">
              <div class="ajuda-metodo-icon">👆</div>
              <div>
                <strong>Clicar no Catálogo</strong>
                <p>O catálogo mostra as primeiras 20 peças disponíveis. Clique em qualquer cartão para adicionar ao pedido.</p>
              </div>
            </div>
          </div>

          <p class="ajuda-p">Após clicar numa peça, uma janela pede confirmação. Clique em <b>✓ Sim, Adicionar</b>. O estoque é descontado automaticamente.</p>

          <h3 class="ajuda-sub">Aplicar Desconto</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>No painel direito do pedido, encontre o campo <b>Desconto (%)</b>.</li>
            <li>Digite o percentual de desconto (ex: 10 para 10%).</li>
            <li>Clique em <b>Aplicar</b>. O valor do desconto e o total são atualizados na hora.</li>
          </ol>

          <h3 class="ajuda-sub">Finalizar a Venda</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Verifique as peças adicionadas e o total.</li>
            <li>Clique na forma de pagamento: <b>Pix</b>, <b>Cartão</b>, <b>Dinheiro</b> ou <b>Anotado</b>.</li>
            <li>Clique em <b>✓ Finalizar Venda</b>. O pedido é concluído e sai da lista de ativos.</li>
          </ol>

          <div class="ajuda-tip">
            💡 <strong>Anotado:</strong> Se a cliente pagou "no caderninho", selecione <b>Anotado</b> antes de finalizar. O valor é somado automaticamente à dívida dela na aba Clientes.
          </div>

          <h3 class="ajuda-sub">Cancelar um Pedido</h3>
          <p class="ajuda-p">Para cancelar antes de finalizar, clique em <b>✕ Cancelar Pedido</b>. Todas as peças são <b>devolvidas automaticamente ao estoque</b>.</p>

          <h3 class="ajuda-sub">Remover um Item do Pedido</h3>
          <p class="ajuda-p">Na lista de itens do pedido ativo, clique no <b>✕</b> ao lado do item. A peça volta ao estoque imediatamente.</p>
        </section>

        <!-- ===== CLIENTES ===== -->
        <section class="ajuda-sec" id="sec-clientes">
          <h2 class="ajuda-sec-title">👤 Clientes</h2>
          <p class="ajuda-p">Cadastre suas clientes para acompanhar o histórico de compras e gerenciar dívidas.</p>

          <h3 class="ajuda-sub">Cadastrar uma Cliente</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Vá em <b>Clientes</b> na barra lateral.</li>
            <li>Clique no botão <b>+</b> no canto inferior direito.</li>
            <li>Preencha nome e telefone (WhatsApp). O endereço é opcional.</li>
            <li>Clique em <b>Salvar</b>.</li>
          </ol>

          <h3 class="ajuda-sub">Buscar uma Cliente</h3>
          <p class="ajuda-p">Use o campo de busca no topo para encontrar pelo nome ou número de telefone.</p>

          <h3 class="ajuda-sub">Acompanhar Saldo Devedor</h3>
          <p class="ajuda-p">Cada cliente mostra seu saldo devedor atual. Clique no cartão da cliente para ver:</p>
          <ul class="ajuda-list">
            <li>Histórico de compras realizadas.</li>
            <li>Total que ela deve.</li>
            <li>Botão para registrar um pagamento (abater a dívida).</li>
          </ul>

          <h3 class="ajuda-sub">Registrar Pagamento de Dívida</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Abra o cartão da cliente.</li>
            <li>Clique em <b>Registrar Pagamento</b>.</li>
            <li>Digite o valor pago.</li>
            <li>Clique em <b>Confirmar</b>. O saldo devedor é reduzido automaticamente.</li>
          </ol>
        </section>

        <!-- ===== CADERNINHO ===== -->
        <section class="ajuda-sec" id="sec-caderninho">
          <h2 class="ajuda-sec-title">📓 Caderninho</h2>
          <p class="ajuda-p">O Caderninho é uma visão geral de todas as dívidas em aberto — quem deve, quanto deve e o histórico de anotações.</p>

          <h3 class="ajuda-sub">O que aparece no Caderninho?</h3>
          <ul class="ajuda-list">
            <li>Lista de todas as clientes com saldo devedor maior que zero.</li>
            <li>Valor total em aberto de cada cliente.</li>
            <li>Histórico de compras e abatimentos.</li>
          </ul>

          <h3 class="ajuda-sub">Como usar</h3>
          <p class="ajuda-p">O Caderninho é alimentado automaticamente — toda vez que uma venda é finalizada como <b>Anotado</b>, o valor entra aqui. Quando a cliente paga, use <b>Registrar Pagamento</b> em Clientes para abater.</p>

          <div class="ajuda-tip">
            💡 <strong>Dica:</strong> Consulte o Caderninho antes de fazer uma nova venda para uma cliente — você pode ver rapidamente se ela já tem dívida em aberto.
          </div>
        </section>

        <!-- ===== SCANNER ===== -->
        <section class="ajuda-sec" id="sec-scanner">
          <h2 class="ajuda-sec-title">📷 Scanner de Código de Barras</h2>
          <p class="ajuda-p">O scanner funciona direto pelo celular, sem precisar instalar nada. Ele usa a câmera do aparelho para ler o código de barras das etiquetas.</p>

          <h3 class="ajuda-sub">Onde o scanner aparece?</h3>
          <ul class="ajuda-list">
            <li><b>Estoque → Novo Produto:</b> botão 📷 ao lado do campo "Código de Barras" — preenche o código automaticamente.</li>
            <li><b>Vendas → Pedido Ativo:</b> botão 📷 ao lado da busca — lê o código e já filtra o produto no catálogo.</li>
          </ul>

          <h3 class="ajuda-sub">Como usar</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Clique em 📷. O app pede permissão para usar a câmera — clique em <b>Permitir</b>.</li>
            <li>Aponte a câmera para o código de barras da etiqueta.</li>
            <li>Aguarde a leitura automática (normalmente menos de 2 segundos).</li>
            <li>O código é preenchido automaticamente no campo correspondente.</li>
          </ol>

          <h3 class="ajuda-sub">Se a câmera não abrir</h3>
          <p class="ajuda-p">Caso apareça uma mensagem de câmera indisponível, você pode digitar o código manualmente no campo que aparece na tela.</p>

          <div class="ajuda-tip">
            💡 <strong>Dica:</strong> Para melhor leitura, mantenha a câmera a cerca de 15–20 cm do código e garanta boa iluminação. O scanner funciona em iOS Safari, Android Chrome e Samsung Internet.
          </div>
        </section>

        <!-- ===== FAQ ===== -->
        <section class="ajuda-sec" id="sec-faq">
          <h2 class="ajuda-sec-title">❓ Perguntas Frequentes</h2>

          <div class="faq-list">

            <details class="faq-item">
              <summary class="faq-pergunta">O sistema funciona no meu celular?</summary>
              <p class="faq-resp">Sim! O Lagom Gestão foi desenvolvido para funcionar em qualquer celular pelo navegador — Chrome, Safari (iPhone), Samsung Internet. Não precisa instalar nada.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Os dados ficam salvos mesmo se eu fechar o app?</summary>
              <p class="faq-resp">Sim. Todos os dados ficam salvos na nuvem automaticamente. Você pode abrir o app em qualquer dispositivo e tudo estará atualizado.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Posso usar em dois celulares ao mesmo tempo?</summary>
              <p class="faq-resp">Sim! Como os dados são na nuvem, você e um colaborador podem usar ao mesmo tempo. As informações sincronizam em tempo real.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">O que acontece com o estoque quando faço uma venda?</summary>
              <p class="faq-resp">Automaticamente! Ao adicionar uma peça a um pedido, a quantidade é descontada do estoque na mesma hora. Se cancelar o pedido, a quantidade volta.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Como faço para cadastrar muitas peças rapidamente?</summary>
              <p class="faq-resp">Use o scanner de código de barras para preencher o código automaticamente. Para peças sem código, gere um SKU automático clicando em ↻. Defina as categorias e marcas antes de começar para agilizar o preenchimento.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">O que é SKU?</summary>
              <p class="faq-resp">SKU é um código interno para identificar a peça no seu sistema. O app gera automaticamente no formato LW-0001, LW-0002, etc. Você pode digitar o seu próprio ou usar o gerado — serve para busca rápida na hora da venda.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Posso adicionar foto das peças?</summary>
              <p class="faq-resp">Sim! No cadastro do produto, você pode colar um link de imagem (de uma foto no Google Drive ou Instagram, por exemplo) ou fazer upload direto de uma foto do seu celular.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Como funciona a margem de lucro da marca?</summary>
              <p class="faq-resp">Ao cadastrar uma marca, você define a margem padrão (ex: 80%). No formulário de novo produto, ao informar o preço de custo e clicar em "Calcular", o sistema aplica essa margem automaticamente: Preço de Venda = Custo × (1 + Margem%). Exemplo: custo R$ 50, margem 80% → venda R$ 90.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">O pedido "Anotado" vai direto para o caderninho?</summary>
              <p class="faq-resp">Sim! Ao finalizar uma venda com pagamento "Anotado" e com uma cliente cadastrada selecionada, o valor é somado automaticamente ao saldo devedor dela no Caderninho.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Tem como ver o histórico de vendas?</summary>
              <p class="faq-resp">Sim, pelo perfil de cada cliente em Clientes você vê o histórico de compras dela. Em breve, um relatório geral de vendas será adicionado ao sistema.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Errei o preço de uma peça. Como corrigir?</summary>
              <p class="faq-resp">Por enquanto, delete o produto e recadastre com o preço correto. Em breve, a edição direta será adicionada.</p>
            </details>

          </div>
        </section>

        <!-- Rodapé da ajuda -->
        <div class="ajuda-footer">
          <p>Dúvidas? Fale com o suporte pelo WhatsApp. <span class="ajuda-footer-icon">✦</span></p>
          <p class="ajuda-footer-versao">Lagom Gestão • versão 1.0</p>
        </div>

      </div>
    </div>`;
}

export function initView() {
  // Botão Ver Tutorial
  document.getElementById("btnVerTutorial")?.addEventListener("click", () => {
    reabrirOnboarding();
  });

  // Smooth scroll nos links do índice
  document.querySelectorAll(".ajuda-indice-item").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
