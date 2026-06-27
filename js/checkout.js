const checkoutLista = document.getElementById("checkoutLista");
const quantidadeItensEl = document.getElementById("quantidadeItens");
const subtotalPedidoEl = document.getElementById("subtotalPedido");
const totalPedidoEl = document.getElementById("totalPedido");
const totalPedidoFixoEl = document.getElementById("totalPedidoFixo");
const taxaEntregaEl = document.getElementById("taxaEntrega");
const descontoFidelidadeEl = document.getElementById("descontoFidelidade");
const descontoCupomEl = document.getElementById("descontoCupom");
const pontosFidelidadeCheckoutEl = document.getElementById(
  "pontosFidelidadeCheckout",
);
const recompensasListaEl = document.getElementById("recompensasLista");
const recompensaFeedbackEl = document.getElementById("recompensaFeedback");
const cupomPedidoEl = document.getElementById("cupomPedido");
const cupomFeedbackEl = document.getElementById("cupomFeedback");
const cuponsDisponiveisEl = document.getElementById("cuponsDisponiveis");
const cuponsVencidosEl = document.getElementById("cuponsVencidos");
const pagamentoDetalhe = document.getElementById("pagamentoDetalhe");
const checkoutPopup = document.getElementById("checkoutPopup");
const checkoutPopupIcone = document.getElementById("checkoutPopupIcone");
const checkoutPopupMensagem = document.getElementById("checkoutPopupMensagem");
const chavePix = "00020126580014BR.GOV.BCB.PIX0136.raizes-do-nordeste";
const limiteEntregaGratis = 100;

const carrinho = JSON.parse(localStorage.getItem("cart")) || [];
let usuarioLogado = JSON.parse(localStorage.getItem("user")) || {};
let recompensaSelecionada = null;
let cupomSelecionado = null;

const recompensasFidelidade = [
  {
    id: "desconto-5",
    pontos: 50,
    descontoPercentual: 5,
    titulo: "5% de desconto",
  },
  {
    id: "desconto-10",
    pontos: 100,
    descontoPercentual: 10,
    titulo: "10% de desconto",
  },
  {
    id: "desconto-15",
    pontos: 150,
    descontoPercentual: 15,
    titulo: "15% de desconto",
  },
];

const cupons = [
  {
    codigo: "NORDESTE 10",
    titulo: "10% OFF",
    descricao: "10% de desconto em qualquer pedido.",
    tipo: "percentual",
    valor: 10,
    validade: "2026-09-30",
    ativo: true,
  },
  {
    codigo: "BEM VINDO",
    titulo: "10% OFF",
    descricao: "",
    tipo: "percentual",
    valor: 10,
    primeiraCompra: true,
    ativo: true,
  },
  {
    codigo: "FRETE GRATIS",
    titulo: "Frete gratis",
    descricao: "Remove a taxa de entrega do pedido.",
    tipo: "frete",
    valor: 0,
    validade: "2026-08-31",
    ativo: true,
  },
  {
    codigo: "CLIENTE VIP",
    titulo: "25% OFF",
    descricao: "Disponivel para clientes com 500 pontos ou mais.",
    tipo: "percentual",
    valor: 25,
    pontosMinimos: 500,
    validade: "2026-12-31",
    ativo: true,
  },
  {
    codigo: "SAO JOAO 20",
    titulo: "20% OFF",
    descricao: "Cupom promocional de Sao Joao.",
    tipo: "percentual",
    valor: 20,
    validade: "2026-05-10",
    ativo: true,
  },
];

// Formata valores monetarios para exibição.
function formatarPreco(preco) {
  return preco.toFixed(2).replace(".", ",");
}

// Soma os valores dos itens do carrinho.
function calcularTotal() {
  return carrinho.reduce((total, item) => total + item.preco, 0);
}

// Calcula a taxa de entrega conforme subtotal e cupom aplicado.
function calcularTaxaEntrega() {
  const subtotal = calcularTotal();

  if (cupomSelecionado && cupomSelecionado.tipo === "frete") {
    return 0;
  }

  if (subtotal === 0 || subtotal >= limiteEntregaGratis) {
    return 0;
  }

  return subtotal * 0.1;
}

// Soma itens e entrega para definir a base dos descontos.
function calcularBaseDesconto(
  subtotal = calcularTotal(),
  taxaEntrega = calcularTaxaEntrega(),
) {
  return subtotal + taxaEntrega;
}

// Calcula o desconto da recompensa de fidelidade selecionada.
function calcularDescontoFidelidade(baseDesconto = calcularBaseDesconto()) {
  if (!recompensaSelecionada) {
    return 0;
  }

  return baseDesconto * (recompensaSelecionada.descontoPercentual / 100);
}

// Calcula o desconto concedido pelo cupom selecionado.
function calcularDescontoCupom(baseDesconto = calcularBaseDesconto()) {
  if (!cupomSelecionado) {
    return 0;
  }

  const subtotal = calcularTotal();

  if (
    cupomSelecionado.pedidoMinimo &&
    subtotal < cupomSelecionado.pedidoMinimo
  ) {
    return 0;
  }

  if (cupomSelecionado.tipo === "frete") {
    return 0;
  }

  if (cupomSelecionado.tipo === "percentual") {
    return baseDesconto * (cupomSelecionado.valor / 100);
  }

  return Math.min(cupomSelecionado.valor, baseDesconto);
}

// Calcula o total final considerando a entrega e os descontos.
function calcularTotalComDesconto() {
  const subtotal = calcularTotal();
  const taxaEntrega = calcularTaxaEntrega();
  const baseDesconto = calcularBaseDesconto(subtotal, taxaEntrega);
  const descontoFidelidade = calcularDescontoFidelidade(baseDesconto);
  const descontoCupom = calcularDescontoCupom(baseDesconto);

  return Math.max(baseDesconto - descontoFidelidade - descontoCupom, 0);
}

// Formata a data.
function formatarData(data) {
  return data.split("-").reverse().join("/");
}

// Verifica se um cupom com validade ja expirou.
function cupomEstaVencido(cupom) {
  if (!cupom.validade) {
    return false;
  }

  const validade = new Date(`${cupom.validade}T23:59:59`);
  return Date.now() > validade.getTime();
}

// Confere se o usuario ainda esta na primeira compra.
function usuarioEstaNaPrimeiraCompra() {
  return (usuarioLogado.pedidosRealizados || 0) === 0;
}

// Verifica se o cupom de frete perdeu utilidade pelo frete gratis automatico.
function cupomFreteEstaSemBeneficio(cupom) {
  return cupom.tipo === "frete" && calcularTotal() >= limiteEntregaGratis;
}

// Mostra o motivo que impede o uso de um cupom.
function cupomEstaBloqueado(cupom) {
  if (cupomFreteEstaSemBeneficio(cupom)) {
    return `Pedido ja possui frete gratis a partir de R$ ${formatarPreco(
      limiteEntregaGratis,
    )}.`;
  }

  if (cupom.primeiraCompra && !usuarioEstaNaPrimeiraCompra()) {
    return "Disponivel apenas na primeira compra.";
  }

  if (
    cupom.pontosMinimos &&
    (usuarioLogado.pontosFidelidade || 0) < cupom.pontosMinimos
  ) {
    return `Disponivel com ${cupom.pontosMinimos} pontos ou mais.`;
  }

  return "";
}

// Renderiza itens, subtotal, descontos, entrega e total do pedido.
function renderResumoPedido() {
  checkoutLista.innerHTML = "";

  if (carrinho.length === 0) {
    checkoutLista.innerHTML = `
      <div class="checkout-vazio">
        <h2>Seu carrinho está; vazio</h2>
        <p>Volte ao cardápio para escolher os itens do pedido.</p>
        <button type="button" onclick="voltarCardapio()">Ver cardápio</button>
      </div>
    `;
    document.querySelector(".checkout-resumo button").disabled = true;
    return;
  }

  carrinho.forEach((item) => {
    const article = document.createElement("article");
    article.classList.add("checkout-item");
    const imagemProduto = item.imagem || "../assets/principal-hero-bg.png";

    article.innerHTML = `
      <img src="${imagemProduto}" alt="${item.nome}">
      <div>
        <h3>${item.nome}</h3>
        <p>${item.descricao || "Item do cardápio selecionado."}</p>
      </div>
      <strong>R$ ${formatarPreco(item.preco)}</strong>
    `;

    checkoutLista.appendChild(article);
  });

  const total = calcularTotal();
  const taxaEntrega = calcularTaxaEntrega();
  const baseDesconto = calcularBaseDesconto(total, taxaEntrega);
  const descontoFidelidade = calcularDescontoFidelidade(baseDesconto);
  const descontoCupom = calcularDescontoCupom(baseDesconto);
  const totalComDesconto = calcularTotalComDesconto();

  quantidadeItensEl.textContent = carrinho.length;
  subtotalPedidoEl.textContent = `R$ ${formatarPreco(total)}`;
  taxaEntregaEl.textContent =
    taxaEntrega > 0 ? `R$ ${formatarPreco(taxaEntrega)}` : "Grátis";
  descontoFidelidadeEl.textContent = `R$ ${formatarPreco(descontoFidelidade)}`;
  descontoCupomEl.textContent = `R$ ${formatarPreco(descontoCupom)}`;
  totalPedidoEl.textContent = `R$ ${formatarPreco(totalComDesconto)}`;

  if (totalPedidoFixoEl) {
    totalPedidoFixoEl.textContent = `R$ ${formatarPreco(totalComDesconto)}`;
  }
}

// Renderiza as recompensas disponiveis conforme os pontos do usuario.
function renderRecompensas() {
  const pontos = usuarioLogado.pontosFidelidade || 0;

  pontosFidelidadeCheckoutEl.textContent =
    pontos === 1 ? "1 ponto" : `${pontos} pontos`;
  recompensasListaEl.innerHTML = "";

  const opcaoSemRecompensa = document.createElement("label");
  opcaoSemRecompensa.classList.add("checkout-recompensa-opcao");
  opcaoSemRecompensa.innerHTML = `
    <input type="radio" name="recompensa" value="" checked>
    <span>
      <strong>Não usar recompensa</strong>
      <small>Acumule pontos neste pedido.</small>
    </span>
  `;
  recompensasListaEl.appendChild(opcaoSemRecompensa);

  recompensasFidelidade.forEach((recompensa) => {
    const disponivel = pontos >= recompensa.pontos;
    const label = document.createElement("label");
    label.classList.add("checkout-recompensa-opcao");
    label.classList.toggle("checkout-recompensa-indisponivel", !disponivel);
    label.innerHTML = `
      <input
        type="radio"
        name="recompensa"
        value="${recompensa.id}"
        ${disponivel ? "" : "disabled"}
      >
      <span>
        <strong>${recompensa.titulo}</strong>
        <small>${recompensa.pontos} pontos para resgatar</small>
      </span>
    `;

    recompensasListaEl.appendChild(label);
  });

  document.querySelectorAll("input[name='recompensa']").forEach((input) => {
    input.addEventListener("change", selecionarRecompensa);
  });
}

// Aplica ou remove a recompensa selecionada.
function selecionarRecompensa(event) {
  const recompensaId = event.target.value;
  recompensaSelecionada =
    recompensasFidelidade.find((item) => item.id === recompensaId) || null;

  if (recompensaSelecionada) {
    recompensaFeedbackEl.textContent = `${recompensaSelecionada.titulo} aplicado neste pedido.`;
  } else {
    recompensaFeedbackEl.textContent =
      "Ganhe 1 ponto a cada R$ 1,00 em pedidos finalizados.";
  }

  renderResumoPedido();
}

// Renderiza a lista de cupons disponiveis e vencidos.
function renderCupons() {
  cuponsDisponiveisEl.innerHTML = "";
  cuponsVencidosEl.innerHTML = "";

  cupons.forEach((cupom) => {
    const vencido = cupomEstaVencido(cupom);
    const motivoBloqueio = cupomEstaBloqueado(cupom);
    const mostrarMotivoBloqueio = motivoBloqueio && !cupom.pontosMinimos;
    const div = document.createElement("div");
    div.classList.add("checkout-cupom-card");
    div.classList.toggle("checkout-cupom-vencido", vencido || !!motivoBloqueio);
    div.innerHTML = `
      <div>
        <strong>${cupom.codigo}</strong>
        <span>${cupom.titulo}</span>
        ${cupom.descricao ? `<small>${cupom.descricao}</small>` : ""}
        ${mostrarMotivoBloqueio ? `<small>${motivoBloqueio}</small>` : ""}
        ${cupom.validade ? `<small>Validade: ${formatarData(cupom.validade)}</small>` : ""}
      </div>
      <button
        type="button"
        onclick="preencherCupom('${cupom.codigo}')"
        ${vencido || motivoBloqueio ? "disabled" : ""}
      >
        Usar
      </button>
    `;

    if (vencido) {
      cuponsVencidosEl.appendChild(div);
      return;
    }

    cuponsDisponiveisEl.appendChild(div);
  });
}

// Preenche o campo de cupom e tenta aplicar o codigo.
function preencherCupom(codigo) {
  cupomPedidoEl.value = codigo;
  aplicarCupom();
}

// Limpa o cupom aplicado quando o codigo digitado muda.
function atualizarCupomAoDigitar() {
  const codigoDigitado = cupomPedidoEl.value.trim().toUpperCase();

  if (!cupomSelecionado) {
    return;
  }

  if (codigoDigitado === cupomSelecionado.codigo) {
    return;
  }

  cupomSelecionado = null;
  cupomFeedbackEl.textContent = codigoDigitado
    ? "Cupom alterado. Clique em Aplicar para validar o novo código."
    : "Escolha um cupom disponível ou digite o código.";
  renderResumoPedido();
}

// Valida e aplica o cupom informado pelo usuario.
function aplicarCupom() {
  const codigo = cupomPedidoEl.value.trim().toUpperCase();
  const cupom = cupons.find((item) => item.codigo === codigo);

  if (!codigo) {
    cupomSelecionado = null;
    cupomFeedbackEl.textContent = "Digite ou escolha um cupom para aplicar.";
    renderResumoPedido();
    return;
  }

  if (!cupom) {
    cupomSelecionado = null;
    cupomFeedbackEl.innerHTML = "Cupom não encontrado.";
    renderResumoPedido();
    return;
  }

  if (!cupom.ativo) {
    cupomSelecionado = null;
    cupomFeedbackEl.innerHTML = "Cupom indisponível no momento.";
    renderResumoPedido();
    return;
  }

  if (cupomEstaVencido(cupom)) {
    cupomSelecionado = null;
    cupomFeedbackEl.textContent = `Cupom vencido. Ele expirou em ${formatarData(cupom.validade)}.`;
    renderResumoPedido();
    return;
  }

  const motivoBloqueio = cupomEstaBloqueado(cupom);

  if (motivoBloqueio) {
    cupomSelecionado = null;
    cupomFeedbackEl.textContent = cupom.pontosMinimos
      ? "Cupom indisponivel para sua pontuacao atual."
      : motivoBloqueio;
    renderResumoPedido();
    return;
  }

  if (cupom.pedidoMinimo && calcularTotal() < cupom.pedidoMinimo) {
    cupomSelecionado = null;
    cupomFeedbackEl.textContent = `Este cupom exige pedido minimo de R$ ${formatarPreco(
      cupom.pedidoMinimo,
    )}.`;
    renderResumoPedido();
    return;
  }

  cupomSelecionado = cupom;
  cupomFeedbackEl.textContent =
    cupom.tipo === "frete"
      ? `Cupom ${cupom.codigo} aplicado: frete gratis.`
      : `Cupom ${cupom.codigo} aplicado: ${cupom.titulo}.`;
  renderResumoPedido();
}

// Atualiza os pontos de fidelidade apos finalizar o pedido.
function salvarPontosFidelidade(pontosGanhos) {
  const pontosAtuais = usuarioLogado.pontosFidelidade || 0;
  const pontosUsados = recompensaSelecionada ? recompensaSelecionada.pontos : 0;
  const pontosAtualizados =
    Math.max(pontosAtuais - pontosUsados, 0) + pontosGanhos;
  const pedidosRealizados = (usuarioLogado.pedidosRealizados || 0) + 1;

  usuarioLogado = {
    ...usuarioLogado,
    pontosFidelidade: pontosAtualizados,
    pedidosRealizados,
  };
  localStorage.setItem("user", JSON.stringify(usuarioLogado));

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuariosAtualizados = usuarios.map((usuario) => {
    if (usuario.email !== usuarioLogado.email) {
      return usuario;
    }

    return {
      ...usuario,
      pontosFidelidade: pontosAtualizados,
      pedidosRealizados,
    };
  });

  localStorage.setItem("usuarios", JSON.stringify(usuariosAtualizados));
}

// Renderiza os detalhes da forma de pagamento selecionada.
function renderDetalhePagamento() {
  const pagamentoMarcado = document.querySelector(
    "input[name='pagamento']:checked",
  );

  if (!pagamentoMarcado) {
    pagamentoDetalhe.innerHTML = "";
    return;
  }

  const pagamentoSelecionado = pagamentoMarcado.value;

  if (pagamentoSelecionado === "Pix") {
    pagamentoDetalhe.innerHTML = `
      <h3>Pagamento via Pix</h3>
      <p>Ao confirmar, use a chave abaixo para concluir o pagamento.</p>
      <div class="checkout-pix-area">
        <div class="checkout-pix-chave" id="chavePix">${chavePix}</div>
        <button class="checkout-pix-copiar" type="button" onclick="copiarChavePix()">
          Copiar
        </button>
      </div>
      <span class="checkout-pix-feedback" id="pixFeedback" role="status"></span>
    `;
    return;
  }

  pagamentoDetalhe.innerHTML = `
    <h3>Pagamento no cartão</h3>
    <p>
      O pagamento será solicitado por um serviço externo.
      Nenhum dado real de cartão será armazenado neste sistema.
    </p>

    <div class="checkout-bandeiras">
      <span>Bandeiras aceitas</span>
      <img
        src="../assets/bandeiras.jpg"
        alt="Bandeiras aceitas: Mastercard, Visa, Elo, American Express e Hipercard"
      >
      <p>Mastercard, Visa, Elo, American Express e Hipercard.</p>
    </div>
  `;
}

// Finaliza o pedido e salva seus dados para acompanhamento.
function confirmarPedido() {
  if (carrinho.length === 0) {
    return;
  }

  const pagamentoMarcado = document.querySelector(
    "input[name='pagamento']:checked",
  );

  if (!pagamentoMarcado) {
    mostrarPopupErro("Escolha uma forma de pagamento para continuar.");
    return;
  }

  const pagamento = pagamentoMarcado.value;
  const subtotal = calcularTotal();
  const taxaEntrega = calcularTaxaEntrega();
  const baseDesconto = calcularBaseDesconto(subtotal, taxaEntrega);
  const descontoFidelidade = calcularDescontoFidelidade(baseDesconto);
  const descontoCupom = calcularDescontoCupom(baseDesconto);
  const total = calcularTotalComDesconto();
  const pontosGanhos = Math.floor(total);

  const pedido = {
    numero: `#${Date.now().toString().slice(-6)}`,
    itens: carrinho,
    pagamento,
    statusPagamento: "autorizado",
    provedorPagamento: "Servico externo simulado",
    recompensa: recompensaSelecionada,
    cupom: cupomSelecionado,
    subtotal,
    taxaEntrega,
    descontoFidelidade,
    descontoCupom,
    pontosGanhos,
    pedidoAtivo: true,
    etapaAtual: 0,
    inicioAcompanhamento: Date.now(),
    duracaoEtapa: 60000,
    total,
    data: new Date().toISOString(),
    unidade: localStorage.getItem("unidadeSelecionada") || "Não informada",
  };

  const mensagemInicial = "Aguardando confirmação do banco";
  const mensagemAprovado =
    pagamento === "Pix"
      ? "Pagamento via Pix aprovado"
      : "Pagamento via cartão aprovado";

  mostrarPopupPagamento(mensagemInicial, false);

  salvarPontosFidelidade(pontosGanhos);
  localStorage.setItem("ultimoPedido", JSON.stringify(pedido));
  const historicoPedidos =
    JSON.parse(localStorage.getItem("historicoPedidos")) || [];
  historicoPedidos.push(pedido);
  localStorage.setItem("historicoPedidos", JSON.stringify(historicoPedidos));
  localStorage.removeItem("cart");

  setTimeout(() => {
    mostrarPopupPagamento(mensagemAprovado, true);

    setTimeout(() => {
      window.location.href = "status-pedido.html";
    }, 1400);
  }, 3000);
}

function voltarCarrinho() {
  window.location.href = "carrinho.html";
}

function voltarCardapio() {
  window.location.href = "principal.html";
}

// Mostra o popup de pagamento com estado de carregamento ou sucesso.
function mostrarPopupPagamento(mensagem, aprovado) {
  checkoutPopupMensagem.innerHTML = mensagem;
  checkoutPopupIcone.classList.remove("checkout-popup-icone-erro");
  checkoutPopupIcone.classList.toggle(
    "checkout-popup-icone-aprovado",
    aprovado,
  );
  checkoutPopup.classList.add("checkout-popup-visivel");
}

// Mostra um popup temporario de erro no checkout.
function mostrarPopupErro(mensagem) {
  checkoutPopupMensagem.innerHTML = mensagem;
  checkoutPopupIcone.classList.remove("checkout-popup-icone-aprovado");
  checkoutPopupIcone.classList.add("checkout-popup-icone-erro");
  checkoutPopup.classList.add("checkout-popup-visivel");

  setTimeout(() => {
    checkoutPopup.classList.remove("checkout-popup-visivel");
    checkoutPopupIcone.classList.remove("checkout-popup-icone-erro");
  }, 2500);
}

// Copia a chave Pix para a area de transferência.
function copiarChavePix() {
  const pixFeedback = document.getElementById("pixFeedback");

  navigator.clipboard
    .writeText(chavePix)
    .then(() => {
      pixFeedback.textContent = "Chave Pix copiada!";
    })
    .catch(() => {
      const campoTemporario = document.createElement("textarea");
      campoTemporario.value = chavePix;
      document.body.appendChild(campoTemporario);
      campoTemporario.select();
      document.execCommand("copy");
      campoTemporario.remove();
      pixFeedback.textContent = "Chave Pix copiada!";
    });
}

document.querySelectorAll("input[name='pagamento']").forEach((input) => {
  input.addEventListener("change", renderDetalhePagamento);
});

cupomPedidoEl.addEventListener("input", atualizarCupomAoDigitar);

renderResumoPedido();
renderRecompensas();
renderCupons();
renderDetalhePagamento();
