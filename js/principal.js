const usuarioLogado = JSON.parse(localStorage.getItem("user")) || {};
const nomeUsuario = usuarioLogado.nome || "Julio";
const totalEtapasPedido = 4;
const duracaoPadraoEtapa = 60000;

document.getElementById("saudacaoUsuario").textContent =
  `Bem-vindo ${nomeUsuario}`;

// Abre ou fecha o menu do usuario.
function alternarMenuUsuario() {
  const menu = document.getElementById("userMenu");
  const botao = document.querySelector(".principal-botao-usuario");
  const menuAberto = menu.classList.toggle("principal-user-menu-open");

  botao.setAttribute("aria-expanded", menuAberto);
}

// Remove a sessão local e retorna para a tela inicial.
function fazerLogoff() {
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  localStorage.removeItem("unidadeSelecionada");
  localStorage.removeItem("ultimoPedido");
  window.location.href = "../index.html";
}

// Abre a área em que o cliente consulta e corrige seus dados cadastrais.
function irParaMeusDados() {
  window.location.href = "meus-dados.html";
}

// Salva a unidade escolhida e abre seu cardapio.
function selecionarUnidade(unidade) {
  const unidadeAnterior = localStorage.getItem("unidadeSelecionada");

  if (
    unidadeAnterior &&
    unidadeAnterior !== unidade &&
    typeof limparCarrinho === "function"
  ) {
    limparCarrinho();
  }

  localStorage.setItem("unidadeSelecionada", unidade);

  document
    .getElementById("userMenu")
    .classList.remove("principal-user-menu-open");
  document
    .querySelector(".principal-botao-usuario")
    .setAttribute("aria-expanded", "false");

  if (typeof renderCardapioDaUnidade === "function") {
    renderCardapioDaUnidade(unidade);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
}

// Atualiza o botão de status conforme exista pedido ativo.
function atualizarBotaoStatusPedido() {
  const botaoStatusPedido = document.getElementById("botaoStatusPedido");
  const pedido = atualizarStatusPedidoEmSegundoPlano();

  if (!botaoStatusPedido) {
    return;
  }

  if (pedido && pedido.pedidoAtivo !== false) {
    botaoStatusPedido.classList.remove("principal-acao-oculta");
    return;
  }

  botaoStatusPedido.classList.remove("principal-acao-oculta");
}

// Avança o status do pedido ativo conforme o tempo decorrido.
function atualizarStatusPedidoEmSegundoPlano() {
  const pedido = JSON.parse(localStorage.getItem("ultimoPedido")) || null;

  if (!pedido) {
    return null;
  }

  const inicioAcompanhamento =
    pedido.inicioAcompanhamento ||
    new Date(pedido.data).getTime() ||
    Date.now();
  const duracaoEtapa = pedido.duracaoEtapa || duracaoPadraoEtapa;
  const tempoDecorrido = Date.now() - inicioAcompanhamento;
  const etapaAtual = Math.min(
    Math.floor(tempoDecorrido / duracaoEtapa),
    totalEtapasPedido - 1,
  );

  pedido.inicioAcompanhamento = inicioAcompanhamento;
  pedido.duracaoEtapa = duracaoEtapa;
  pedido.etapaAtual = etapaAtual;
  pedido.pedidoAtivo = etapaAtual < totalEtapasPedido - 1;
  localStorage.setItem("ultimoPedido", JSON.stringify(pedido));

  return pedido;
}

// Abre a pagina de status quando existe pedido ativo.
function irParaStatusPedido() {
  const pedido = atualizarStatusPedidoEmSegundoPlano();

  if (!pedido || pedido.pedidoAtivo === false) {
    atualizarBotaoStatusPedido();
    mostrarFeedbackStatusPedido("Sem pedidos ativos");
    return;
  }

  window.location.href = "status-pedido.html";
}

// Mostra os pontos de fidelidade do usuario no menu.
function atualizarPontosFidelidadeMenu() {
  const pontosEl = document.getElementById("pontosFidelidadeMenu");
  const usuarioAtual = JSON.parse(localStorage.getItem("user")) || {};
  const pontos = usuarioAtual.pontosFidelidade || 0;

  if (!pontosEl) {
    return;
  }

  pontosEl.textContent = pontos === 1 ? "1 ponto" : `${pontos} pontos`;
}

// Mostra uma mensagem breve relacionada ao status do pedido.
function mostrarFeedbackStatusPedido(mensagem) {
  if (!carrinhoFeedback) {
    return;
  }

  mostrarFeedbackCarrinho(mensagem);
  carrinhoFeedback.classList.add("carrinho-feedback-status");
}

document.addEventListener("click", function (event) {
  const areaUsuario = document.querySelector(".principal-user");

  if (!areaUsuario.contains(event.target)) {
    document
      .getElementById("userMenu")
      .classList.remove("principal-user-menu-open");
    document
      .querySelector(".principal-botao-usuario")
      .setAttribute("aria-expanded", "false");
  }
});

atualizarBotaoStatusPedido();
atualizarPontosFidelidadeMenu();
setInterval(atualizarBotaoStatusPedido, 1000);
