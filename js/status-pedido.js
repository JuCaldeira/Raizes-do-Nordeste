let pedido = JSON.parse(localStorage.getItem("ultimoPedido")) || null;
const numeroPedidoEl = document.getElementById("numeroPedido");
const statusAtualEl = document.getElementById("statusAtual");
const statusLinhaTempo = document.getElementById("statusLinhaTempo");
const pagamentoPedidoEl = document.getElementById("pagamentoPedido");
const totalPedidoStatusEl = document.getElementById("totalPedidoStatus");
const itensPedidoEl = document.getElementById("itensPedido");

const etapasPedido = [
  {
    titulo: "Pedido recebido",
    descricao: "Recebemos seu pedido e enviamos para a cozinha.",
    icone: "bi bi-clipboard-check",
  },
  {
    titulo: "Pedido em preparo",
    descricao: "Os pratos estão sendo preparados com cuidado.",
    icone: "bi bi-fire",
  },
  {
    titulo: "Saiu para entrega",
    descricao: "Seu pedido saiu do restaurante e está a caminho.",
    icone: "bi bi-bicycle",
  },
  {
    titulo: "Pedido entregue",
    descricao: "Entrega finalizada. Bom apetite!",
    icone: "bi bi-check-circle-fill",
  },
];

let etapaAtual = pedido ? pedido.etapaAtual || 0 : 0;
const duracaoPadraoEtapa = 60000;

// Formata valores monetarios para exibição.
function formatarPreco(preco) {
  return preco.toFixed(2).replace(".", ",");
}

// Retorna o numero do pedido atual ou um identificador padrao.
function obterNumeroPedido() {
  if (!pedido) {
    return "#0000";
  }

  if (pedido.numero) {
    return pedido.numero;
  }

  const origemNumero = pedido.data
    ? new Date(pedido.data).getTime()
    : pedido.inicioAcompanhamento;

  if (!origemNumero || Number.isNaN(origemNumero)) {
    return "#0000";
  }

  pedido.numero = `#${String(origemNumero).slice(-6)}`;
  localStorage.setItem("ultimoPedido", JSON.stringify(pedido));
  return pedido.numero;
}

// Salva o estado atual do pedido no armazenamento local.
function salvarStatusPedido() {
  if (!pedido) {
    return;
  }

  pedido.etapaAtual = etapaAtual;
  pedido.pedidoAtivo = etapaAtual < etapasPedido.length - 1;
  localStorage.setItem("ultimoPedido", JSON.stringify(pedido));
}

// Atualiza a etapa do pedido de acordo com o tempo passado.
function atualizarStatusPeloTempo() {
  if (!pedido) {
    return;
  }

  const inicioAcompanhamento =
    pedido.inicioAcompanhamento ||
    new Date(pedido.data).getTime() ||
    Date.now();
  const duracaoEtapa = pedido.duracaoEtapa || duracaoPadraoEtapa;
  const tempoDecorrido = Date.now() - inicioAcompanhamento;

  etapaAtual = Math.min(
    Math.floor(tempoDecorrido / duracaoEtapa),
    etapasPedido.length - 1,
  );

  pedido.inicioAcompanhamento = inicioAcompanhamento;
  pedido.duracaoEtapa = duracaoEtapa;
  salvarStatusPedido();
}

// Renderiza a tela vazia quando nao ha pedido ativo.
function renderPedidoVazio() {
  numeroPedidoEl.textContent = "#0000";
  statusAtualEl.textContent = "Sem pedido ativo";
  pagamentoPedidoEl.textContent = "-";
  totalPedidoStatusEl.textContent = "R$ 0,00";
  itensPedidoEl.innerHTML = "";

  statusLinhaTempo.innerHTML = `
    <div class="status-vazio">
      <h2>Nenhum pedido em acompanhamento</h2>
      <p>Finalize um pedido para acompanhar o status por aqui.</p>
      <button type="button" onclick="voltarCardapio()">Ver cardápio</button>
    </div>
  `;
}

// Mostra os dados principais do pedido em acompanhamento.
function renderResumoPedido() {
  if (!pedido) {
    renderPedidoVazio();
    return;
  }

  numeroPedidoEl.textContent = obterNumeroPedido();
  pagamentoPedidoEl.textContent = pedido.pagamento || "-";
  totalPedidoStatusEl.textContent = `R$ ${formatarPreco(pedido.total || 0)}`;

  itensPedidoEl.innerHTML = "";

  pedido.itens.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("status-item");
    div.innerHTML = `
      <span>${item.nome}</span>
      <strong>R$ ${formatarPreco(item.preco)}</strong>
    `;
    itensPedidoEl.appendChild(div);
  });
}

// Renderiza a linha do tempo das etapas do pedido.
function renderLinhaTempo() {
  if (!pedido) {
    return;
  }

  statusAtualEl.textContent = etapasPedido[etapaAtual].titulo;
  statusLinhaTempo.innerHTML = "";

  etapasPedido.forEach((etapa, index) => {
    const article = document.createElement("article");
    article.classList.add("status-etapa");

    if (index < etapaAtual) {
      article.classList.add("status-etapa-concluida");
    }

    if (index === etapaAtual) {
      article.classList.add("status-etapa-ativa");
    }

    article.innerHTML = `
      <div class="status-etapa-marcador">
        <i class="${etapa.icone}" aria-hidden="true"></i>
      </div>
      <div>
        <h3>${etapa.titulo}</h3>
        <p>${etapa.descricao}</p>
      </div>
    `;

    statusLinhaTempo.appendChild(article);
  });
}

// Inicia e mantem o acompanhamento visual do pedido.
function iniciarAcompanhamento() {
  if (!pedido) {
    renderPedidoVazio();
    return;
  }

  atualizarStatusPeloTempo();
  renderResumoPedido();
  renderLinhaTempo();

  const intervalo = setInterval(() => {
    atualizarStatusPeloTempo();
    renderLinhaTempo();

    if (etapaAtual >= etapasPedido.length - 1) {
      clearInterval(intervalo);
    }
  }, 1000);
}

// Volta para a pagina principal do cardapio.
function voltarCardapio() {
  window.location.href = "principal.html";
}

renderResumoPedido();
iniciarAcompanhamento();
