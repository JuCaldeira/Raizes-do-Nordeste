const container = document.getElementById("produtos");
const favoritos = document.getElementById("favoritos");
const principalHero = document.getElementById("principalHero");
const tituloPrincipal = document.getElementById("tituloPrincipal");
const principalFooter = document.getElementById("principalFooter");
const carrinhoFeedback = document.getElementById("carrinhoFeedback");
const nomesUnidadesAtualizados = {
  "Unidade 1": "Mandacaru - Boa Viagem • PE",
  "Unidade 2": "Asa Branca - Rio Vermelho • BA",
  "Unidade 3": "Panela de Barro - Aldeota • CE",
  "Unidade 4": "Sertão - Tambaú • PB",
  "Unidade 5": "Gonzagão - Ponta Negra • RN",
  "Unidade 6": "Jangada - Paulista • SP",
  "Unidade 7": "Brasa - Copacabana • RJ",
  "Unidade 8": "Carcará - Batista Campos • PA",
  "Unidade 9": "Casa de Mainha - Asa Sul • DF",
  "Unidade 10": "Xote - Batel • PR",
};

let carrinho = JSON.parse(localStorage.getItem("cart")) || [];
let cardapioAtual = [];
let produtosAtuais = [];
let carrinhoFeedbackTimer;
let categoriasCardapioAtual = null;
let categoriasCardapioPlaceholder = null;
let categoriasCardapioPontoFixo = 0;

// Separa o nome e a localidade da unidade selecionada.
function separarNomeUnidade(unidade) {
  const [nome, localizacao = ""] = unidade.split(" - ");

  return {
    nome,
    localizacao,
  };
}

// Formata valores monetarios para exibição.
function formatarPreco(preco) {
  return preco.toFixed(2).replace(".", ",");
}

// Renderiza os produtos agrupados por categoria.
function renderProdutos() {
  container.innerHTML = "";

  const categorias = document.createElement("nav");
  categorias.classList.add("categorias-cardapio");
  categorias.dataset.totalCategorias = cardapioAtual.length;
  categorias.setAttribute("aria-label", "Categorias do cardapio");

  cardapioAtual.forEach((grupo, index) => {
    const grupoId = `categoria-${index}`;
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = grupo.nome;
    botao.addEventListener("click", () => {
      categorias
        .querySelectorAll("button")
        .forEach((botaoCategoria) =>
          botaoCategoria.classList.remove("categoria-ativa"),
        );
      botao.classList.add("categoria-ativa");
      rolarParaCategoria(grupoId, categorias);
    });
    categorias.appendChild(botao);
  });

  container.appendChild(categorias);
  prepararFixacaoCategorias(categorias);

  cardapioAtual.forEach((grupo, index) => {
    const section = document.createElement("section");
    section.classList.add("menu-grupo");
    section.id = `categoria-${index}`;

    section.innerHTML = `
      <h2>${grupo.nome}</h2>
      <div class="menu-itens"></div>
    `;

    const lista = section.querySelector(".menu-itens");

    grupo.itens.forEach((produto) => {
      const div = document.createElement("article");
      div.classList.add("card", "menu-item");
      const imagemProduto = produto.imagem || "../assets/principal-hero-bg.png";

      div.innerHTML = `
        <div class="menu-item-media">
          <img
            class="menu-item-imagem"
            src="${imagemProduto}"
            alt="${produto.nome}"
          >
          <div class="menu-item-acoes">
            <button type="button" onclick="adicionarAoCarrinho(${produto.id})">+</button>
          </div>
        </div>
        <div class="menu-item-info">
          <strong class="menu-item-preco">R$ ${formatarPreco(produto.preco)}</strong>
          <h3>${produto.nome}</h3>
          <p>${produto.descricao}</p>
        </div>
      `;

      lista.appendChild(div);
    });

    container.appendChild(section);
  });
}

// Calcula a altura da navegação principal.
function obterAlturaNavPrincipal() {
  const altura = parseFloat(
    getComputedStyle(document.body).getPropertyValue("--principal-nav-height"),
  );

  return Number.isNaN(altura) ? 0 : altura;
}

// Atualiza a posicao fixa da barra de categorias.
function atualizarPontoFixoCategorias() {
  if (!categoriasCardapioAtual) {
    return;
  }

  const estavaFixa = categoriasCardapioAtual.classList.contains(
    "categorias-cardapio-fixa",
  );

  if (estavaFixa) {
    categoriasCardapioAtual.classList.remove("categorias-cardapio-fixa");
  }

  categoriasCardapioPontoFixo =
    categoriasCardapioAtual.getBoundingClientRect().top +
    window.scrollY -
    obterAlturaNavPrincipal();

  if (estavaFixa) {
    categoriasCardapioAtual.classList.add("categorias-cardapio-fixa");
  }
}

// Alterna a fixaçãpo das categorias durante a rolagem.
function atualizarFixacaoCategorias() {
  if (!categoriasCardapioAtual || !categoriasCardapioPlaceholder) {
    return;
  }

  const deveFixar = window.scrollY >= categoriasCardapioPontoFixo;

  categoriasCardapioAtual.classList.toggle(
    "categorias-cardapio-fixa",
    deveFixar,
  );
  categoriasCardapioPlaceholder.classList.toggle(
    "categorias-cardapio-placeholder-visivel",
    deveFixar,
  );
  categoriasCardapioPlaceholder.style.height = deveFixar
    ? `${categoriasCardapioAtual.offsetHeight + 18}px`
    : "0px";
}

// Prepara as medidas usadas para fixar as categorias.
function prepararFixacaoCategorias(categorias) {
  categoriasCardapioAtual = categorias;
  categoriasCardapioPlaceholder = document.createElement("div");
  categoriasCardapioPlaceholder.classList.add(
    "categorias-cardapio-placeholder",
  );
  categorias.after(categoriasCardapioPlaceholder);

  requestAnimationFrame(() => {
    atualizarPontoFixoCategorias();
    atualizarFixacaoCategorias();
  });
}

// Rola a pagina ate a categoria escolhida.
function rolarParaCategoria(grupoId, categorias) {
  const grupo = document.getElementById(grupoId);

  if (!grupo) {
    return;
  }

  const margem = categorias.getBoundingClientRect().bottom + 22;
  const destino = grupo.getBoundingClientRect().top + window.scrollY - margem;

  window.scrollTo({
    top: destino,
    behavior: "smooth",
  });
}

// Carrega e exibe o cardapio da unidade selecionada.
function renderCardapioDaUnidade(unidade) {
  cardapioAtual = window.cardapiosPorUnidade[unidade] || [];
  produtosAtuais = cardapioAtual.flatMap((grupo) => grupo.itens);
  const unidadeInfo = separarNomeUnidade(unidade);

  document.body.classList.add("principal-cardapio-body");
  favoritos.classList.add("produtos-ocultos");
  principalHero.classList.add("principal-hero-cardapio");
  container.classList.remove("produtos-ocultos");
  principalFooter.classList.remove("principal-footer-oculto");
  tituloPrincipal.innerHTML = `
    <span class="principal-unidade-nome">${unidadeInfo.nome}</span>
    <span class="principal-unidade-local">${unidadeInfo.localizacao}</span>
  `;
  principalHero.querySelector("p").textContent = "Escolha seu pedido";

  renderProdutos();
  document.documentElement.classList.remove("principal-cardapio-preload");
}

// Adiciona o produto escolhido ao carrinho.
function adicionarAoCarrinho(id) {
  const produto = produtosAtuais.find((p) => p.id === id);

  if (!produto) {
    mostrarFeedbackCarrinho("Produto não encontrado");
    return;
  }

  carrinho.push(produto);

  localStorage.setItem("cart", JSON.stringify(carrinho));

  mostrarFeedbackCarrinho("Item adicionado");
}

function limparCarrinho() {
  carrinho = [];
  localStorage.setItem("cart", JSON.stringify(carrinho));
}

function irParaCarrinho() {
  window.location.href = "carrinho.html";
}

// Mostra uma mensagem breve sobre ações do carrinho.
function mostrarFeedbackCarrinho(mensagem) {
  if (!carrinhoFeedback) {
    return;
  }

  clearTimeout(carrinhoFeedbackTimer);
  carrinhoFeedback.textContent = mensagem;
  carrinhoFeedback.classList.remove("carrinho-feedback-status");
  carrinhoFeedback.classList.add("carrinho-feedback-visivel");

  carrinhoFeedbackTimer = setTimeout(() => {
    carrinhoFeedback.classList.remove("carrinho-feedback-visivel");
  }, 1000);
}

const unidadeSalva = localStorage.getItem("unidadeSelecionada");
const unidadeSelecionada =
  nomesUnidadesAtualizados[unidadeSalva] || unidadeSalva;

if (unidadeSelecionada) {
  localStorage.setItem("unidadeSelecionada", unidadeSelecionada);
  renderCardapioDaUnidade(unidadeSelecionada);
}

window.addEventListener("scroll", atualizarFixacaoCategorias);
window.addEventListener("resize", () => {
  atualizarPontoFixoCategorias();
  atualizarFixacaoCategorias();
});
