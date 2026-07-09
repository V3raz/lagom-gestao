// ============================================================
// LAGOM GESTÃO — Aba de Ajuda
// Manual completo e descritivo do sistema
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
          <p class="ajuda-hero-sub">Manual completo do Lagom Gestão — tudo explicado passo a passo.</p>
          <button id="btnVerTutorial" class="btn btn-primary" style="margin-top:1.25rem;gap:0.5rem">
            🎬 Ver Tutorial de Boas-Vindas
          </button>
        </div>
      </div>

      <!-- Índice rápido -->
      <nav class="ajuda-indice">
        <a class="ajuda-indice-item" href="#sec-conceitos">📚 Conceitos Básicos</a>
        <a class="ajuda-indice-item" href="#sec-inicio">🚀 Primeiros Passos</a>
        <a class="ajuda-indice-item" href="#sec-estoque">📦 Estoque</a>
        <a class="ajuda-indice-item" href="#sec-marcas">🏷️ Marcas, Categorias e Opções</a>
        <a class="ajuda-indice-item" href="#sec-vendas">🛒 Vendas</a>
        <a class="ajuda-indice-item" href="#sec-clientes">👤 Clientes</a>
        <a class="ajuda-indice-item" href="#sec-caderninho">📓 Caderninho</a>
        <a class="ajuda-indice-item" href="#sec-scanner">📷 Scanner</a>
        <a class="ajuda-indice-item" href="#sec-dia-a-dia">☀️ Rotina do Dia a Dia</a>
        <a class="ajuda-indice-item" href="#sec-faq">❓ FAQ</a>
      </nav>

      <div class="ajuda-body">

        <!-- ===== CONCEITOS BÁSICOS ===== -->
        <section class="ajuda-sec" id="sec-conceitos">
          <h2 class="ajuda-sec-title">📚 Conceitos Básicos</h2>

          <div class="ajuda-destaque">
            Antes de começar a usar, vale entender 4 palavrinhas que aparecem o tempo todo no sistema.
            Se você entender isso, o resto fica muito fácil.
          </div>

          <h3 class="ajuda-sub">O que é um Produto?</h3>
          <p class="ajuda-p">
            <b>Produto</b> é cada peça única do seu estoque. <b>Atenção:</b> "único" aqui significa <b>uma combinação específica de nome + cor + tamanho</b>.
          </p>
          <p class="ajuda-p">
            Por exemplo: se você tem 5 vestidos florais brancos no tamanho M e 3 no tamanho G,
            isso são <b>dois produtos diferentes</b> no sistema, cada um com sua própria quantidade. O nome pode ser o mesmo ("Vestido Floral"), mas como o tamanho muda, são cadastros separados.
          </p>
          <p class="ajuda-p">
            Isso é importante porque na hora da venda você vai escolher exatamente qual variação a cliente está levando, e o estoque desconta certinho da quantidade certa.
          </p>

          <h3 class="ajuda-sub">O que é uma Categoria?</h3>
          <p class="ajuda-p">
            <b>Categoria</b> é o <b>tipo</b> da peça: Vestido, Camiseta, Calça, Saia, Blusa, Casaco, etc.
            Serve só para você filtrar e organizar o estoque depois.
          </p>
          <p class="ajuda-p">
            Você cria a categoria <b>uma vez</b> e ela fica disponível na lista pra todos os próximos produtos que você cadastrar.
          </p>

          <h3 class="ajuda-sub">O que é uma Marca?</h3>
          <p class="ajuda-p">
            <b>Marca</b> é o fabricante da peça: ZARA, Renner, LULEG, Hering, Marca Própria, etc. Cada marca tem uma <b>margem de lucro padrão</b> — a porcentagem que você gosta de aplicar em cima do custo pra chegar no preço de venda.
          </p>
          <p class="ajuda-p">
            Por exemplo: se você cadastra a marca "ZARA" com margem 80%, sempre que você for cadastrar um produto da ZARA pode clicar em "Calcular" no campo de preço — o sistema pega o custo e multiplica por 1,80 automaticamente. Custo R$ 50 → vende a R$ 90. Custo R$ 100 → vende a R$ 180.
          </p>
          <p class="ajuda-p">
            Diferentes marcas costumam ter margens diferentes. Marcas mais caras geralmente têm margem menor (porque o custo já é alto), marcas populares têm margem maior. Configurar isso uma vez economiza muito tempo no cadastro.
          </p>

          <h3 class="ajuda-sub">O que é SKU?</h3>
          <p class="ajuda-p">
            <b>SKU</b> é um código interno único pra identificar cada produto. O sistema cria automaticamente no formato <b>LW-0001, LW-0002, LW-0003</b>... e você não precisa se preocupar com isso. Serve só pra busca rápida e pra colar na etiqueta de preço se você quiser.
          </p>
          <p class="ajuda-p">
            <b>SKU é diferente de Código de Barras.</b> O código de barras vem na etiqueta original da peça (do fabricante) e é lido pela câmera. O SKU é seu, interno do seu sistema.
          </p>

          <div class="ajuda-tip">
            💡 <strong>Resumindo:</strong> Você primeiro cadastra <b>Categorias</b> e <b>Marcas</b> (faz uma vez só). Depois cadastra os <b>Produtos</b> usando essas categorias e marcas. Pronto, agora pode vender.
          </div>
        </section>

        <!-- ===== PRIMEIROS PASSOS ===== -->
        <section class="ajuda-sec" id="sec-inicio">
          <h2 class="ajuda-sec-title">🚀 Primeiros Passos</h2>

          <div class="ajuda-destaque">
            <strong>Bem-vinda ao Lagom Gestão!</strong> Esta é a ordem certa para configurar o sistema do zero. Não pula etapa — cada uma depende da anterior.
          </div>

          <div class="ajuda-steps">
            <div class="ajuda-step">
              <div class="ajuda-step-num">1</div>
              <div>
                <strong>Cadastre suas Categorias</strong>
                <p>Vá em <b>Estoque</b>, clique em <b>⚙ Gerenciar</b> no topo, aba <b>Categorias</b>. Adicione os tipos de peça que você vende: Vestido, Camiseta, Calça, Blusa, Saia, etc.</p>
                <p><b>Por que primeiro?</b> Porque quando você for cadastrar um produto, vai precisar escolher uma categoria dele numa lista. Se a lista estiver vazia, você não consegue salvar.</p>
              </div>
            </div>

            <div class="ajuda-step">
              <div class="ajuda-step-num">2</div>
              <div>
                <strong>Cadastre suas Marcas</strong>
                <p>Mesmo lugar (<b>⚙ Gerenciar</b>), aba <b>Marcas</b>. Para cada marca, defina o nome e a <b>margem de lucro padrão</b> (em %). Exemplo: ZARA — 80%, LULEG — 220%, Renner — 100%.</p>
                <p><b>Como decidir a margem?</b> Olha o histórico: o quanto você costuma cobrar de uma peça dessa marca dividido pelo que você pagou, menos 1, vezes 100. Se compra a R$ 50 e vende a R$ 150 → margem 200%. Não tem certeza? Coloca 100% como padrão e ajusta depois.</p>
              </div>
            </div>

            <div class="ajuda-step">
              <div class="ajuda-step-num">3</div>
              <div>
                <strong>Cadastre seus Produtos</strong>
                <p>Em <b>Estoque</b>, clique no <b>botão dourado</b> no canto inferior direito da tela (📦). Preencha cada peça com nome, tamanho, cor, preço e quantidade. Se quiser, escaneia o código de barras com a câmera.</p>
                <p><b>Lembra:</b> cada combinação de cor + tamanho é um cadastro separado. Camiseta Branca M e Camiseta Branca G são dois produtos.</p>
              </div>
            </div>

            <div class="ajuda-step">
              <div class="ajuda-step-num">4</div>
              <div>
                <strong>Cadastre suas Clientes</strong>
                <p>Vá em <b>Clientes</b> na barra lateral, clique no <b>+</b>, coloque nome e telefone (WhatsApp). Endereço é opcional.</p>
                <p><b>Por que cadastrar?</b> Pra você poder vender no fiado (Anotado) — só dá pra registrar dívida pra uma cliente cadastrada. E pra acompanhar o histórico de quem compra com você.</p>
              </div>
            </div>

            <div class="ajuda-step">
              <div class="ajuda-step-num">5</div>
              <div>
                <strong>Faça sua Primeira Venda</strong>
                <p>Em <b>Vendas</b>, clique em <b>+ Novo Pedido</b>, escolhe o tipo (balcão, expressa ou cliente cadastrada), adiciona as peças e finaliza com a forma de pagamento. Pronto, sistema rodando!</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ===== ESTOQUE ===== -->
        <section class="ajuda-sec" id="sec-estoque">
          <h2 class="ajuda-sec-title">📦 Estoque</h2>
          <p class="ajuda-p">
            O Estoque é o coração do sistema. Ali ficam <b>todas</b> as peças disponíveis pra venda, com nome, foto, tamanho, cor, preço e quantidade. Quando a quantidade chega a zero, a peça continua cadastrada mas aparece como "sem estoque" — você pode repor a qualquer momento.
          </p>

          <h3 class="ajuda-sub">Como ler a tela do Estoque</h3>
          <p class="ajuda-p">
            Cada peça aparece como um <b>cartão</b> com:
          </p>
          <ul class="ajuda-list">
            <li><b>Foto</b> da peça (se você adicionou uma).</li>
            <li><b>Nome</b> e <b>SKU</b> (código interno).</li>
            <li><b>Marca</b> (badge colorida no canto).</li>
            <li><b>Tamanho</b> e <b>Cor</b>.</li>
            <li><b>Preço de venda</b>.</li>
            <li><b>Quantidade em estoque</b> (em destaque).</li>
            <li>Botões <b>+ Repor</b> e <b>🗑 Deletar</b>.</li>
          </ul>
          <p class="ajuda-p">
            No topo, um contador mostra quantos produtos diferentes você tem cadastrados. Logo abaixo, os <b>filtros</b> permitem buscar uma peça específica.
          </p>

          <h3 class="ajuda-sub">Cadastrar um Produto Novo (passo a passo detalhado)</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Clique no <b>botão dourado</b> com ícone de código de barras no canto inferior direito.</li>
            <li>Uma janela abre com o formulário. Preencha campo por campo:
              <ul class="ajuda-list ajuda-list--sub">
                <li><b>Código de Barras</b> (opcional): se a peça tem etiqueta com código de barras, clica no 📷 ao lado e escaneia. Senão, deixa em branco ou digita manualmente. Esse campo é o que permite usar o scanner pra adicionar a peça à venda depois — sem código de barras, vai precisar buscar pelo nome.</li>
                <li><b>Nome da Peça</b> (obrigatório): seja descritiva. Ex: "Vestido Floral Branco", "Camiseta Básica Preta", "Calça Jeans Skinny Azul". Quanto mais específico, mais fácil achar depois.</li>
                <li><b>SKU</b> (opcional): código interno. Clica no ↻ pra gerar um automático (LW-0001, LW-0002...). Se você já tem um sistema de códigos próprio, pode digitar.</li>
                <li><b>Categoria</b> (obrigatório): escolha da lista (Vestido, Camiseta...). Se faltar uma, clica no <b>+</b> ao lado pra criar na hora.</li>
                <li><b>Marca</b> (opcional, mas recomendado): escolha da lista. Com a marca selecionada, você consegue usar o "Calcular" pra preço automático.</li>
                <li><b>Tamanho</b> (obrigatório): Único, PP, P, M, G, GG, XGG ou numeração (34, 36, 38...).</li>
                <li><b>Cor</b> (obrigatório): escolha da lista de cores, incluindo Off-white, Jeans e Vinho.</li>
                <li><b>Preço de Custo</b> (opcional): quanto <b>você pagou</b> pela peça do fornecedor. Esse valor não aparece pra cliente, é só pra controle. Necessário se você quer usar o botão "Calcular" do preço de venda.</li>
                <li><b>Preço de Venda</b> (obrigatório): quanto a cliente vai pagar. Pode digitar direto, ou — se preencheu marca + custo — clicar em <b>Calcular</b> pra aplicar a margem da marca automaticamente.</li>
                <li><b>Quantidade</b> (obrigatório): quantas unidades dessa peça você tem agora. Se vai chegando aos poucos, começa com o que tem na mão e usa o "Repor" depois.</li>
                <li><b>Imagem</b> (opcional, mas recomendado): pode colar um link de imagem (da internet, Drive, Instagram) ou fazer upload de uma foto direto do celular. Ter foto facilita demais identificar a peça na hora da venda.</li>
              </ul>
            </li>
            <li>Clique em <b>Salvar Produto</b>. A peça aparece imediatamente no estoque, e fica disponível pra venda.</li>
          </ol>

          <div class="ajuda-tip">
            💡 <strong>Dica de produtividade:</strong> antes de cadastrar 50 peças, configure todas as suas marcas e categorias primeiro. Depois você passa só clicando, sem precisar criar marca nova no meio do caminho.
          </div>

          <h3 class="ajuda-sub">Filtrar Produtos no Estoque</h3>
          <p class="ajuda-p">Os filtros no topo servem pra achar uma peça rápido quando você tem muita coisa cadastrada. Funcionam em conjunto: você pode combinar todos.</p>
          <ul class="ajuda-list">
            <li><b>Campo de busca:</b> digite parte do nome ou SKU da peça. Resultado aparece conforme você digita.</li>
            <li><b>Tamanho:</b> mostra só peças daquele tamanho específico. Útil quando a cliente já sabe o tamanho dela.</li>
            <li><b>Cor:</b> mostra só peças daquela cor.</li>
            <li><b>Categoria:</b> mostra só peças daquele tipo (ex: só Vestidos).</li>
            <li><b>Marca:</b> mostra só peças daquela marca.</li>
          </ul>
          <p class="ajuda-p">
            Exemplo: cliente quer um vestido floral, tamanho M, da ZARA. Você marca categoria=Vestido, tamanho=M, marca=ZARA — o estoque mostra exatamente o que ela quer ver.
          </p>

          <h3 class="ajuda-sub">Repor Estoque</h3>
          <p class="ajuda-p">Quando chega mercadoria nova de um produto que <b>já existe no sistema</b>:</p>
          <ol class="ajuda-list ajuda-list--num">
            <li>Acha a peça no estoque (pode usar os filtros).</li>
            <li>Clica em <b>+ Repor</b> no cartão.</li>
            <li>Digita a quantidade <b>a adicionar</b> (não o total novo). Ex: tinha 3, chegaram mais 5 → digita 5, não 8.</li>
            <li>Clica em <b>+ Adicionar</b>. O estoque vira 8 automaticamente.</li>
          </ol>
          <p class="ajuda-p">
            <b>Nunca repita o cadastro de uma peça que já existe.</b> Se você cadastrar de novo, vai aparecer duas vezes no estoque e bagunçar tudo. Sempre repõe.
          </p>

          <h3 class="ajuda-sub">Deletar um Produto</h3>
          <p class="ajuda-p">Pra remover uma peça do estoque pra sempre:</p>
          <ol class="ajuda-list ajuda-list--num">
            <li>Acha o produto no estoque.</li>
            <li>Clica em <b>🗑 Deletar</b> no cartão.</li>
            <li>Confirma a exclusão.</li>
          </ol>
          <p class="ajuda-p ajuda-warn">
            ⚠️ <b>Esta ação não tem como desfazer.</b> Só delete peças que <b>não foram vendidas ainda</b> — peças vendidas precisam ficar no sistema pra manter o histórico das vendas funcionando. Se quer apenas "esconder" uma peça esgotada, basta deixar quantidade em zero.
          </p>
        </section>

        <!-- ===== MARCAS, CATEGORIAS E OPÇÕES ===== -->
        <section class="ajuda-sec" id="sec-marcas">
          <h2 class="ajuda-sec-title">🏷️ Marcas, Categorias e Opções</h2>
          <p class="ajuda-p">
            Marcas, Categorias, Cores e Tamanhos são listas que você configura <b>uma vez</b> e usa pra sempre. Ficam acessíveis em <b>Estoque → ⚙ Gerenciar</b>, no topo da tela.
          </p>

          <h3 class="ajuda-sub">Por que separar Marca de Categoria?</h3>
          <p class="ajuda-p">
            Porque são coisas diferentes. <b>Categoria</b> diz <b>o que é</b> a peça (vestido, camiseta...). <b>Marca</b> diz <b>quem fez</b> a peça (ZARA, Renner...). Você pode ter "Vestido da ZARA" e "Vestido da Renner" — mesma categoria, marcas diferentes. Ou "Camiseta da ZARA" e "Vestido da ZARA" — mesma marca, categorias diferentes.
          </p>

          <h3 class="ajuda-sub">Adicionar uma Marca</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Vá em <b>Estoque → ⚙ Gerenciar</b>.</li>
            <li>Clica na aba <b>Marcas</b> (já vem selecionada).</li>
            <li>No formulário no rodapé, digita o <b>Nome da Marca</b> (ex: ZARA) e a <b>Margem (%)</b> (ex: 80).</li>
            <li>Clica em <b>Adicionar</b>. A marca aparece na lista e já pode ser usada nos próximos produtos.</li>
          </ol>

          <h3 class="ajuda-sub">Como funciona a Margem de Lucro</h3>
          <p class="ajuda-p">
            A margem é uma porcentagem que se aplica em cima do <b>preço de custo</b> (quanto você pagou pela peça) pra chegar no <b>preço de venda</b>. A fórmula é simples:
          </p>
          <div class="ajuda-destaque">
            <b>Preço de Venda = Custo × (1 + Margem ÷ 100)</b>
          </div>
          <p class="ajuda-p">
            Exemplos práticos:
          </p>
          <ul class="ajuda-list">
            <li>Custo R$ 50, margem 50% → 50 × 1,50 = <b>R$ 75</b>.</li>
            <li>Custo R$ 50, margem 100% → 50 × 2,00 = <b>R$ 100</b>.</li>
            <li>Custo R$ 50, margem 220% → 50 × 3,20 = <b>R$ 160</b>.</li>
            <li>Custo R$ 100, margem 80% → 100 × 1,80 = <b>R$ 180</b>.</li>
          </ul>
          <p class="ajuda-p">
            <b>Como usar na prática:</b> no formulário de novo produto, selecione a marca, preencha o <b>Preço de Custo</b>, e clique em <b>Calcular</b> no campo Preço de Venda. O sistema aplica a margem dessa marca automaticamente. Você ainda pode ajustar o valor manualmente depois.
          </p>

          <h3 class="ajuda-sub">Adicionar uma Categoria</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Vá em <b>Estoque → ⚙ Gerenciar</b>.</li>
            <li>Clica na aba <b>Categorias</b>.</li>
            <li>Digita o <b>Nome da Categoria</b> (ex: Blazer, Macacão, Saia).</li>
            <li>Clica em <b>Adicionar</b>.</li>
          </ol>
          <p class="ajuda-p">
            Categoria não tem margem nem nada — é só um rótulo organizacional. Pode também ser criada direto do formulário de novo produto (botão "+" ao lado do campo Categoria).
          </p>

          <h3 class="ajuda-sub">Adicionar Cor ou Tamanho</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Vá em <b>Estoque → ⚙ Gerenciar</b>.</li>
            <li>Clica na aba <b>Cores</b> ou <b>Tamanhos</b>.</li>
            <li>Digita o nome da opção, por exemplo <b>Jeans</b> ou <b>Único</b>.</li>
            <li>Clica em <b>Adicionar</b>. A opção já aparece no cadastro e no filtro do estoque.</li>
          </ol>

          <h3 class="ajuda-sub">Deletar uma Marca, Categoria, Cor ou Tamanho</h3>
          <p class="ajuda-p">
            Na mesma tela <b>⚙ Gerenciar</b>, clica em <b>Excluir</b> ao lado da opção. Produtos antigos continuam salvos com o valor que já tinham; a exclusão só remove a opção das próximas listas.
          </p>
        </section>

        <!-- ===== VENDAS ===== -->
        <section class="ajuda-sec" id="sec-vendas">
          <h2 class="ajuda-sec-title">🛒 Vendas</h2>
          <p class="ajuda-p">
            A tela de Vendas é o seu caixa. Cada venda vira um "pedido" que você cria, adiciona as peças, aplica desconto se quiser e finaliza com a forma de pagamento. Quando finalizado, o pedido sai da lista de ativos e o estoque já está descontado.
          </p>

          <h3 class="ajuda-sub">Os Três Tipos de Venda</h3>
          <p class="ajuda-p">
            Antes de criar o pedido, você escolhe o tipo. A diferença entre eles é <b>se a cliente está identificada</b>:
          </p>

          <div class="ajuda-metodos">
            <div class="ajuda-metodo">
              <div class="ajuda-metodo-icon">🏪</div>
              <div>
                <strong>Venda Balcão</strong>
                <p><b>Quando usar:</b> cliente está na loja, vai pagar na hora (Pix, cartão ou dinheiro). Você <b>não precisa</b> cadastrar ela.</p>
                <p><b>Característica:</b> pedido fica anônimo, não entra no histórico de nenhuma cliente.</p>
              </div>
            </div>
            <div class="ajuda-metodo">
              <div class="ajuda-metodo-icon">⚡</div>
              <div>
                <strong>Venda Expressa</strong>
                <p><b>Quando usar:</b> venda rapidíssima, tipo "vendi uma camiseta básica e acabou". Bem parecido com Balcão.</p>
                <p><b>Característica:</b> também anônima, mas com fluxo mais rápido.</p>
              </div>
            </div>
            <div class="ajuda-metodo">
              <div class="ajuda-metodo-icon">👤</div>
              <div>
                <strong>Cliente Cadastrada</strong>
                <p><b>Quando usar:</b> cliente regular que você quer registrar o histórico, <b>ou</b> quando ela vai pagar fiado (Anotado).</p>
                <p><b>Característica:</b> você seleciona uma cliente da lista. A venda entra no histórico dela. Se finalizar como "Anotado", o valor vai pro caderninho dela.</p>
              </div>
            </div>
          </div>

          <div class="ajuda-tip">
            💡 <strong>Regra de ouro:</strong> se vai vender no fiado, <b>tem que ser Cliente Cadastrada</b>. Senão o sistema não sabe quem deve.
          </div>

          <h3 class="ajuda-sub">Criar um Novo Pedido</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Em <b>Vendas</b>, clique em <b>+ Novo Pedido</b> no topo.</li>
            <li>Escolha o tipo (Balcão, Expressa ou Cliente Cadastrada).</li>
            <li>Se for Cliente Cadastrada: escolha a cliente da lista (busca por nome).</li>
            <li>Clique em <b>Criar Pedido</b>. O pedido aparece na lista à esquerda e abre automaticamente no painel direito.</li>
          </ol>

          <h3 class="ajuda-sub">Adicionar Peças ao Pedido</h3>
          <p class="ajuda-p">Com o pedido aberto, você tem três jeitos de adicionar peças:</p>

          <div class="ajuda-metodos">
            <div class="ajuda-metodo">
              <div class="ajuda-metodo-icon">📷</div>
              <div>
                <strong>1. Escanear Código de Barras</strong>
                <p>É o mais rápido. Clique no 📷 ao lado da busca, aponta a câmera para a etiqueta da peça. Se o sistema achar uma combinação única (mesmo código de barras), já pergunta "adicionar essa peça?" — você confirma e pronto.</p>
                <p><b>Funciona se</b> você cadastrou o código de barras na hora do cadastro do produto.</p>
              </div>
            </div>
            <div class="ajuda-metodo">
              <div class="ajuda-metodo-icon">🔍</div>
              <div>
                <strong>2. Buscar por Nome ou SKU</strong>
                <p>Digite parte do nome ou o SKU (LW-0001) no campo de busca. O catálogo abaixo filtra na hora. Clica no cartão da peça desejada.</p>
              </div>
            </div>
            <div class="ajuda-metodo">
              <div class="ajuda-metodo-icon">👆</div>
              <div>
                <strong>3. Clicar no Catálogo</strong>
                <p>Se a cliente está olhando direto na sua tela ou se você sabe onde está a peça, é só clicar no cartão dela no catálogo (mostra as primeiras peças disponíveis).</p>
              </div>
            </div>
          </div>

          <p class="ajuda-p">
            <b>Depois de clicar numa peça,</b> aparece uma confirmação ("Adicionar essa peça ao pedido?"). Clica em <b>✓ Sim, Adicionar</b>. A peça entra na lista de itens do pedido, e <b>o estoque é descontado na hora</b> — então se você se enganou, é só remover o item (clica no ✕ ao lado dele), que a peça volta automaticamente pro estoque.
          </p>

          <h3 class="ajuda-sub">Aplicar Desconto</h3>
          <p class="ajuda-p">Desconto é em porcentagem (%) sobre o total do pedido. Não é em reais.</p>
          <ol class="ajuda-list ajuda-list--num">
            <li>No painel direito do pedido, ache o campo <b>Desconto (%)</b>.</li>
            <li>Digite o percentual: 10 = 10%, 25 = 25%, 50 = metade do preço.</li>
            <li>Clica em <b>Aplicar</b>. O total atualiza imediatamente: "Subtotal R$ 200 − 10% = R$ 180".</li>
          </ol>
          <p class="ajuda-p">
            Pra <b>remover</b> o desconto: digita 0 e clica Aplicar.
          </p>

          <h3 class="ajuda-sub">Finalizar a Venda</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Confira os itens listados, a soma e o desconto.</li>
            <li>Selecione a forma de pagamento:
              <ul class="ajuda-list ajuda-list--sub">
                <li><b>Pix:</b> cliente pagou ou vai pagar agora via Pix.</li>
                <li><b>Cartão:</b> débito ou crédito na maquininha.</li>
                <li><b>Dinheiro:</b> pagou em espécie.</li>
                <li><b>Anotado:</b> ficou devendo (vai pro caderninho). <b>Só funciona com cliente cadastrada.</b></li>
              </ul>
            </li>
            <li>Clica em <b>✓ Finalizar Venda</b>. O pedido vai pra histórico e some da lista de pedidos ativos.</li>
          </ol>

          <div class="ajuda-tip">
            💡 <strong>Anotado vai direto pro Caderninho:</strong> ao finalizar como Anotado com uma cliente cadastrada selecionada, o valor total do pedido é somado automaticamente à dívida dela. Você consulta isso depois em <b>Clientes</b> ou no <b>Caderninho</b>.
          </div>

          <h3 class="ajuda-sub">Cancelar um Pedido</h3>
          <p class="ajuda-p">
            Cancelou venda? Clica em <b>✕ Cancelar Pedido</b> no painel direito. <b>Todas</b> as peças que você tinha adicionado <b>voltam pro estoque automaticamente</b>. É reversível. Use sem medo.
          </p>

          <h3 class="ajuda-sub">Remover um Item Específico</h3>
          <p class="ajuda-p">
            Pra tirar só uma peça do pedido (não cancelar tudo), clica no <b>✕</b> ao lado dela na lista de itens. Aquela peça volta pro estoque, o resto do pedido continua intacto.
          </p>

          <h3 class="ajuda-sub">Pedido Aberto e Pedido Fechado</h3>
          <p class="ajuda-p">
            Enquanto você está montando a venda, o pedido fica "ativo" — aparece na lista à esquerda em destaque. Você pode abrir vários pedidos ao mesmo tempo (atender duas clientes em paralelo, por exemplo) e ir alternando entre eles. Cada um tem seu próprio carrinho.
          </p>
          <p class="ajuda-p">
            Quando você finaliza, o pedido vai pro histórico e some da lista de ativos. Se cancelar, também some — mas sem entrar no histórico (estoque volta).
          </p>
        </section>

        <!-- ===== CLIENTES ===== -->
        <section class="ajuda-sec" id="sec-clientes">
          <h2 class="ajuda-sec-title">👤 Clientes</h2>
          <p class="ajuda-p">
            A aba <b>Clientes</b> é a sua agenda. Aqui ficam os nomes, telefones e — o mais importante — quanto cada cliente está devendo (saldo do caderninho) e o que ela já comprou.
          </p>

          <h3 class="ajuda-sub">Por que cadastrar clientes?</h3>
          <p class="ajuda-p">
            Você <b>não precisa</b> cadastrar todo mundo. Cadastra só:
          </p>
          <ul class="ajuda-list">
            <li>Quem compra <b>fiado</b> (porque pra vender no Anotado, precisa cliente cadastrada).</li>
            <li>Quem é <b>cliente regular</b> e você quer guardar o histórico (saber o que ela compra, quando, etc.).</li>
            <li>Quem você pode querer mandar mensagem depois (WhatsApp salvo).</li>
          </ul>
          <p class="ajuda-p">
            Cliente de passagem que comprou uma vez e pagou na hora? Não precisa cadastrar — usa Venda Balcão.
          </p>

          <h3 class="ajuda-sub">Cadastrar uma Cliente Nova</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Vá em <b>Clientes</b> na barra lateral.</li>
            <li>Clica no botão <b>+</b> no canto inferior direito.</li>
            <li>Preencha:
              <ul class="ajuda-list ajuda-list--sub">
                <li><b>Nome</b> (obrigatório).</li>
                <li><b>Telefone / WhatsApp</b> (obrigatório, no formato com DDD: 11 99999-9999).</li>
                <li><b>Endereço</b> (opcional).</li>
              </ul>
            </li>
            <li>Clica em <b>Salvar</b>.</li>
          </ol>

          <h3 class="ajuda-sub">Buscar uma Cliente</h3>
          <p class="ajuda-p">
            Campo de busca no topo: digite parte do nome ou número de telefone. Filtra na hora.
          </p>

          <h3 class="ajuda-sub">Acompanhar o Saldo Devedor</h3>
          <p class="ajuda-p">
            Cada cliente aparece com o saldo devedor atual já visível no cartão. <b>Cor vermelha</b> = deve dinheiro. <b>Cor neutra ou zerado</b> = em dia.
          </p>
          <p class="ajuda-p">
            Clica no cartão da cliente pra abrir o detalhe, onde você vê:
          </p>
          <ul class="ajuda-list">
            <li><b>Histórico de compras</b> — todas as vendas que ela fez, com data e valor.</li>
            <li><b>Total em dívida</b> (saldo do caderninho).</li>
            <li><b>Botão de pagamento</b> pra abater quando ela pagar.</li>
          </ul>

          <h3 class="ajuda-sub">Registrar Pagamento de Dívida</h3>
          <p class="ajuda-p">
            Quando a cliente vem pagar (parcial ou total):
          </p>
          <ol class="ajuda-list ajuda-list--num">
            <li>Abre o cartão da cliente.</li>
            <li>Clica em <b>Registrar Pagamento</b>.</li>
            <li>Digita o valor que ela pagou (não precisa ser o total — pode pagar parcial).</li>
            <li>Confirma. O saldo devedor diminui na hora.</li>
          </ol>
          <p class="ajuda-p">
            Exemplo: cliente deve R$ 200, paga R$ 80 hoje → saldo vira R$ 120. Daí ela paga mais R$ 120 semana que vem → saldo vira 0, ela tá quite.
          </p>
        </section>

        <!-- ===== CADERNINHO ===== -->
        <section class="ajuda-sec" id="sec-caderninho">
          <h2 class="ajuda-sec-title">📓 Caderninho</h2>
          <p class="ajuda-p">
            O Caderninho é o <b>resumão das dívidas</b>. Em vez de você abrir cliente por cliente pra ver quem deve, o Caderninho te mostra <b>só quem tem dívida em aberto</b> numa lista única, ordenada.
          </p>

          <h3 class="ajuda-sub">Como o Caderninho é alimentado</h3>
          <p class="ajuda-p">
            <b>Automaticamente.</b> Você não precisa fazer nada. Toda vez que uma venda é finalizada com forma de pagamento <b>Anotado</b> (e tem uma cliente cadastrada selecionada), o valor entra no caderninho dela. Quando ela paga, o valor sai.
          </p>

          <h3 class="ajuda-sub">O que aparece</h3>
          <ul class="ajuda-list">
            <li>Lista das clientes com saldo devedor maior que zero.</li>
            <li>Valor total que cada uma deve.</li>
            <li>Última atualização (quando deveu mais ou pagou).</li>
          </ul>

          <h3 class="ajuda-sub">Para que serve no dia a dia</h3>
          <ul class="ajuda-list">
            <li><b>Cobrar as devedoras:</b> abre o caderninho de manhã e já vê quem precisa lembrar de pagar.</li>
            <li><b>Decidir se vende fiado de novo:</b> antes de aceitar mais um Anotado da cliente X, dá uma olhada quanto ela já deve. Tá com dívida alta? Talvez não seja boa hora pra mais fiado.</li>
            <li><b>Conferência de fim de mês:</b> visão geral de quanto dinheiro tá "no ar" esperando ser pago.</li>
          </ul>

          <div class="ajuda-tip">
            💡 <strong>Dica:</strong> consulte o Caderninho antes de fazer uma nova venda fiada pra qualquer cliente — você vê na hora se ela já tem saldo em aberto.
          </div>
        </section>

        <!-- ===== SCANNER ===== -->
        <section class="ajuda-sec" id="sec-scanner">
          <h2 class="ajuda-sec-title">📷 Scanner de Código de Barras</h2>
          <p class="ajuda-p">
            O scanner funciona <b>direto pela câmera do celular</b>, sem precisar instalar nenhum aplicativo separado. Ele lê os códigos de barras das etiquetas e preenche o campo de código no sistema.
          </p>

          <h3 class="ajuda-sub">Onde o scanner aparece</h3>
          <ul class="ajuda-list">
            <li><b>Estoque → Novo Produto:</b> botão 📷 ao lado do campo "Código de Barras". Use ao cadastrar a peça pela primeira vez — o código fica salvo e da próxima vez você só escaneia pra adicionar à venda.</li>
            <li><b>Vendas → Pedido Ativo:</b> botão 📷 ao lado do campo de busca. Use durante a venda — o sistema já procura a peça e oferece pra adicionar ao pedido.</li>
          </ul>

          <h3 class="ajuda-sub">Como usar (passo a passo)</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Clica no botão 📷.</li>
            <li>Da <b>primeira vez</b>, o navegador pergunta se pode usar a câmera. Clica em <b>Permitir</b> (importante: precisa permitir uma vez só).</li>
            <li>A câmera abre. Aponta para o código de barras da etiqueta.</li>
            <li>Mantém firme por 1-2 segundos. O scanner detecta sozinho — não precisa apertar nada.</li>
            <li>Bipa? Pronto, o código foi preenchido no campo certo.</li>
          </ol>

          <h3 class="ajuda-sub">Se a câmera não abrir</h3>
          <p class="ajuda-p">
            Pode ser que você tenha negado a permissão antes. Vá nas configurações do navegador, ache "Permissões do site" pro lagom-gestao, e libera a câmera. Ou, mais simples: <b>digita o código manualmente</b> no campo que aparece junto.
          </p>

          <div class="ajuda-tip">
            💡 <strong>Dica:</strong> mantenha a câmera entre <b>15 e 20 cm</b> do código, com <b>boa iluminação</b>. Em ambientes escuros, o scanner demora mais (ou nem lê). Funciona em iPhone (Safari), Android (Chrome) e Samsung Internet.
          </div>
        </section>

        <!-- ===== ROTINA DO DIA A DIA ===== -->
        <section class="ajuda-sec" id="sec-dia-a-dia">
          <h2 class="ajuda-sec-title">☀️ Rotina do Dia a Dia</h2>
          <p class="ajuda-p">Pra te ajudar a pegar o ritmo, uma sugestão de rotina pra usar o sistema:</p>

          <h3 class="ajuda-sub">Quando chega mercadoria nova</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Confere a nota fiscal ou romaneio com o que chegou.</li>
            <li>Pra cada peça <b>nova</b> (que ainda não existe no sistema): <b>cadastra</b> em Estoque.</li>
            <li>Pra cada peça <b>repetida</b> (que já existe): usa <b>+ Repor</b> no cartão dela.</li>
          </ol>

          <h3 class="ajuda-sub">Quando uma cliente entra na loja</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Pergunta se ela tem ficha cadastrada. Se já tiver, busca em <b>Clientes</b> antes da venda (pra conferir se tem dívida).</li>
            <li>Quando ela for fechar, vai em <b>Vendas → + Novo Pedido</b>.</li>
            <li>Escolhe o tipo de venda (Balcão se vai pagar na hora; Cliente Cadastrada se for fiado).</li>
            <li>Adiciona as peças (scanner ou busca).</li>
            <li>Aplica desconto se for o caso.</li>
            <li>Finaliza com a forma de pagamento.</li>
          </ol>

          <h3 class="ajuda-sub">Quando uma cliente vem pagar dívida</h3>
          <ol class="ajuda-list ajuda-list--num">
            <li>Vá em <b>Clientes</b>, busca o nome dela.</li>
            <li>Abre o cartão, clica em <b>Registrar Pagamento</b>.</li>
            <li>Digita o valor que ela pagou. Confirma.</li>
          </ol>

          <h3 class="ajuda-sub">Final do dia / Final da semana</h3>
          <ul class="ajuda-list">
            <li>Dá uma olhada no <b>Caderninho</b> pra ver quem ainda deve.</li>
            <li>Confere o <b>Estoque</b> pra ver o que está acabando (filtra por baixa quantidade).</li>
          </ul>
        </section>

        <!-- ===== FAQ ===== -->
        <section class="ajuda-sec" id="sec-faq">
          <h2 class="ajuda-sec-title">❓ Perguntas Frequentes</h2>

          <div class="faq-list">

            <details class="faq-item">
              <summary class="faq-pergunta">O sistema funciona no meu celular?</summary>
              <p class="faq-resp">Sim. Roda no navegador (Chrome no Android, Safari no iPhone, Samsung Internet). Não precisa baixar nada — é só acessar o link <b>lagom-gestao.vercel.app</b>. Funciona igualzinho no computador também.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Os dados ficam salvos mesmo se eu fechar?</summary>
              <p class="faq-resp">Sim, fica tudo salvo na nuvem em tempo real. Pode fechar o celular, virar a tela, trocar de aparelho — quando abrir de novo, tá tudo lá igual. Não precisa "salvar" nada manualmente.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Posso usar em dois celulares ao mesmo tempo?</summary>
              <p class="faq-resp">Sim. Você pode estar atendendo no caixa e outra pessoa cadastrando produto no estoque ao mesmo tempo. As mudanças aparecem em todos os aparelhos automaticamente.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">O que acontece com o estoque quando faço uma venda?</summary>
              <p class="faq-resp">Desconta automaticamente. Adicionou uma camiseta M branca ao pedido? Já saiu 1 da quantidade do estoque. Cancelou o pedido depois? Voltou 1. Removeu o item do carrinho? Voltou 1.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Como faço pra cadastrar muitas peças de uma vez?</summary>
              <p class="faq-resp">Não tem importação em massa por enquanto, mas pra agilizar: (1) configure todas as marcas e categorias antes de começar, (2) gere SKU automático com o botão ↻, (3) use o scanner pra preencher o código de barras rapidinho, (4) use o "Calcular" do preço pra não ter que fazer conta de cabeça.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">O que é SKU?</summary>
              <p class="faq-resp">SKU é um código <b>interno</b> da peça, criado pelo seu sistema. Vem no formato LW-0001, LW-0002 e por aí vai. Serve pra você achar a peça rapidinho pela busca. Diferente do <b>código de barras</b>, que é o código da etiqueta do fabricante e é lido pela câmera.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Posso adicionar foto das peças?</summary>
              <p class="faq-resp">Sim, e é super recomendado. No cadastro do produto, você pode (1) colar um link de uma imagem que está na internet ou Google Drive, ou (2) fazer upload direto de uma foto do celular. Ter foto ajuda demais a identificar a peça na hora da venda.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Como funciona a margem de lucro da marca?</summary>
              <p class="faq-resp">Cada marca tem uma margem padrão em % (configurada uma vez). No formulário de novo produto, ao informar o <b>preço de custo</b> e clicar em <b>Calcular</b>, o sistema aplica a margem da marca selecionada: <b>Preço de Venda = Custo × (1 + Margem ÷ 100)</b>. Exemplo: custo R$ 50, margem 80% → venda R$ 90. Você pode ajustar o preço depois manualmente se quiser.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">O pedido "Anotado" vai direto pro Caderninho?</summary>
              <p class="faq-resp">Sim. Quando você finaliza uma venda com forma de pagamento "Anotado" e tem uma <b>cliente cadastrada</b> selecionada, o valor entra no saldo devedor dela automaticamente. Você vê isso em Clientes ou no Caderninho.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Posso vender fiado sem cliente cadastrada?</summary>
              <p class="faq-resp">Não. Sem cliente cadastrada, o sistema não tem onde registrar a dívida. Se a cliente ainda não tá cadastrada e vai pagar depois, primeiro cadastra ela (Clientes → +) e depois cria o pedido como "Cliente Cadastrada".</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Tem como ver o histórico de vendas?</summary>
              <p class="faq-resp">Por cliente, sim — clica no cartão da cliente e vê as compras dela. Um relatório geral de vendas (faturamento por dia/mês) está na fila pra entrar no sistema em breve.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Errei o preço de uma peça. Como corrigir?</summary>
              <p class="faq-resp">A edição direta do produto ainda não está disponível — por enquanto a saída é deletar e recadastrar com o valor certo (cuidado: só se ela ainda não foi vendida). Edição é uma das próximas funcionalidades a entrar.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">A cliente pagou parcial. Como registro?</summary>
              <p class="faq-resp">Em <b>Clientes</b>, abre o cartão dela, clica em <b>Registrar Pagamento</b> e digita só o valor que ela pagou agora. O saldo restante continua em aberto. Pode fazer isso quantas vezes precisar até quitar.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Posso ter mais de um pedido aberto ao mesmo tempo?</summary>
              <p class="faq-resp">Sim. Cada pedido novo aparece na lista da esquerda. Você pode estar montando dois pedidos em paralelo (uma cliente provando, outra escolhendo) e alterna clicando entre eles. Cada um tem seu próprio carrinho.</p>
            </details>

            <details class="faq-item">
              <summary class="faq-pergunta">Como vejo o que tem em estoque baixo?</summary>
              <p class="faq-resp">Por enquanto, é olhar manualmente no Estoque — o cartão de cada peça mostra a quantidade. Alerta automático de estoque baixo é uma das próximas features.</p>
            </details>

          </div>
        </section>

        <!-- Rodapé da ajuda -->
        <div class="ajuda-footer">
          <p>Dúvidas? Fale com o suporte pelo WhatsApp. <span class="ajuda-footer-icon">✦</span></p>
          <p class="ajuda-footer-versao">Lagom Gestão • versão 1.1</p>
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
