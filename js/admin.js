// Cria um pedido ficticio
function criarPedidoFicticio(
  numero,
  diasAtras,
  unidade,
  pagamento,
  total,
  itens,
) {
  const data = new Date();
  data.setDate(data.getDate() - diasAtras);
  data.setHours(12, 0, 0, 0);

  return {
    numero: `#MOCK${String(numero).padStart(3, "0")}`,
    tipo: "mock",
    data: data.toISOString(),
    unidade,
    pagamento,
    total,
    itens: itens.map((item) =>
      typeof item === "string" ? { nome: item, quantidade: 1 } : item,
    ),
  };
}

// Modelos usados para variar unidades, produtos e formas de pagamento.
const modelosPedidos = [
  criarPedidoFicticio(1, 0, "Mandacaru - Boa Viagem • PE", "Pix", 126.4, [
    { nome: "Baião de Dois", quantidade: 2 },
    "Dadinhos de Tapioca",
  ]),
  criarPedidoFicticio(2, 0, "Brasa - Copacabana • RJ", "Cartao", 84.7, [
    "Carne de Sol à Baiana",
    "Cocada de Forno",
  ]),
  criarPedidoFicticio(3, 1, "Jangada - Paulista • SP", "Pix", 98.5, [
    { nome: "Dadinhos de Tapioca", quantidade: 2 },
    "Queijo Coalho",
  ]),
  criarPedidoFicticio(4, 2, "Asa Branca - Rio Vermelho • BA", "Cartao", 142.9, [
    { nome: "Acarajé", quantidade: 2 },
    "Vatapá",
  ]),
  criarPedidoFicticio(5, 3, "Carcará - Batista Campos • PA", "Pix", 76.3, [
    "Arroz de Cuxá",
    "Suco de Caju",
  ]),
  criarPedidoFicticio(6, 4, "Xote - Batel • PR", "Cartao", 119.8, [
    "Baião de Dois",
    "Cartola",
  ]),
  criarPedidoFicticio(7, 5, "Casa de Mainha - Asa Sul • DF", "Pix", 91.6, [
    "Carne Seca Acebolada",
    "Cocada",
  ]),
  criarPedidoFicticio(8, 6, "Panela de Barro - Aldeota • CE", "Cartao", 154.2, [
    { nome: "Baião de Dois", quantidade: 2 },
    "Dadinhos de Tapioca",
  ]),
  criarPedidoFicticio(9, 10, "Sertão - Tambaú • PB", "Pix", 67.9, [
    "Tapioca de Cuscuz",
    "Queijo Coalho",
  ]),
  criarPedidoFicticio(10, 25, "Gonzagão - Ponta Negra • RN", "Cartao", 133.5, [
    "Vatapá de Charque",
    "Cocada Branca",
  ]),
  criarPedidoFicticio(11, 38, "Mandacaru - Boa Viagem • PE", "Pix", 188.4, [
    { nome: "Baião de Dois", quantidade: 3 },
    "Dadinhos de Tapioca",
  ]),
  criarPedidoFicticio(12, 48, "Brasa - Copacabana • RJ", "Cartao", 105.2, [
    "Carne de Sol à Baiana",
    "Cartola",
  ]),
  criarPedidoFicticio(13, 63, "Carcará - Batista Campos • PA", "Pix", 73.8, [
    "Arroz de Cuxá",
    "Cocada",
  ]),
  criarPedidoFicticio(
    14,
    73,
    "Casa de Mainha - Asa Sul • DF",
    "Cartao",
    162.7,
    [{ nome: "Carne Seca Acebolada", quantidade: 2 }, "Queijo Coalho"],
  ),
  criarPedidoFicticio(15, 91, "Xote - Batel • PR", "Pix", 94.3, [
    "Baião de Dois",
    "Pé de Moleque",
  ]),
  criarPedidoFicticio(
    16,
    101,
    "Asa Branca - Rio Vermelho • BA",
    "Cartao",
    147.6,
    [{ nome: "Acarajé", quantidade: 2 }, "Vatapá"],
  ),
  criarPedidoFicticio(17, 120, "Jangada - Paulista • SP", "Pix", 82.1, [
    "Dadinhos de Tapioca",
    "Bolinho de Mandioca",
  ]),
  criarPedidoFicticio(
    18,
    130,
    "Panela de Barro - Aldeota • CE",
    "Cartao",
    128.9,
    ["Baião de Dois", "Cocada de Forno"],
  ),
  criarPedidoFicticio(19, 145, "Sertão - Tambaú • PB", "Pix", 111.4, [
    "Tapioca de Cuscuz",
    "Carne Seca Acebolada",
  ]),
  criarPedidoFicticio(20, 155, "Gonzagão - Ponta Negra • RN", "Cartao", 139.2, [
    "Vatapá de Charque",
    "Queijo Coalho",
  ]),
];

// Gera 327 vendas ficticias distribuidas igualmente pelos ultimos seis meses.
const pedidosSalvos = Array.from({ length: 327 }, (_, indice) => {
  const modelo = modelosPedidos[indice % modelosPedidos.length];
  const hoje = new Date();
  const mesesAtras = indice % 6;
  const limiteDia = mesesAtras === 0 ? Math.max(hoje.getDate(), 1) : 28;
  const diaDoMes = ((indice * 7) % limiteDia) + 1;
  const data = new Date(
    hoje.getFullYear(),
    hoje.getMonth() - mesesAtras,
    diaDoMes,
    12,
    0,
    0,
    0,
  );
  const variacaoValor = 0.85 + ((indice * 13) % 31) / 100;

  return {
    ...modelo,
    numero: `#MOCK${String(indice + 1).padStart(3, "0")}`,
    data: data.toISOString(),
    pagamento: indice % 5 < 3 ? "Pix" : "Cartao",
    total: Number((modelo.total * variacaoValor).toFixed(2)),
    itens: modelo.itens.map((item) => ({ ...item })),
  };
});

const operacoesSensiveis = [
  {
    data: "2026-06-27T12:40:00",
    operador: "Adm Matriz",
    unidade: "Mandacaru",
    tipo: "Desconto manual",
    pedido: "#875472",
    impacto: -18.4,
    motivo: "Reclamação do cliente",
    status: "Revisado",
  },
  {
    data: "2026-06-27T11:15:00",
    operador: "Gerente PE",
    unidade: "Boa Viagem",
    tipo: "Cancelamento",
    pedido: "#875390",
    impacto: -84.7,
    motivo: "Pedido duplicado",
    status: "Aprovado",
  },
  {
    data: "2026-06-26T18:22:00",
    operador: "Adm Matriz",
    unidade: "Aldeota",
    tipo: "Ajuste de valor",
    pedido: "#875201",
    impacto: -12.9,
    motivo: "Correção de cobranca",
    status: "Revisado",
  },
  {
    data: "2026-06-26T16:10:00",
    operador: "Gerente RN",
    unidade: "Ponta Negra",
    tipo: "Estorno",
    pedido: "#875166",
    impacto: -54.1,
    motivo: "Produto indisponível",
    status: "Aprovado",
  },
  {
    data: "2026-06-25T20:05:00",
    operador: "Adm Matriz",
    unidade: "Copacabana",
    tipo: "Desconto manual",
    pedido: "#874980",
    impacto: -25,
    motivo: "Cupom aplicado em contingência",
    status: "Pendente",
  },
];

// Formata um valor numerico como moeda brasileira.
function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Retorna a quantidade de um item, considerando os formatos usados no carrinho.
function obterQuantidade(item) {
  return Number(item.quantidade || item.qtd || 1);
}

// Calcula os indicadores gerais e inicia a renderização dos graficos do painel.
function prepararDados() {
  const faturamento = pedidosSalvos.reduce(
    (total, pedido) => total + Number(pedido.total || 0),
    0,
  );
  document.getElementById("adminFaturamento").textContent =
    formatarMoeda(faturamento);
  document.getElementById("adminPedidos").textContent = pedidosSalvos.length;
  document.getElementById("adminTicket").textContent = formatarMoeda(
    pedidosSalvos.length ? faturamento / pedidosSalvos.length : 0,
  );
  renderizarPagamentos();
  renderizarRanking();
  renderizarVendasPorUnidade();
  renderizarVendasPorRegiao();
  renderizarAuditoria();
  desenharGraficoVendas();
}

function formatarDataHora(data) {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderizarAuditoria() {
  const resumoEl = document.getElementById("auditoriaResumo");
  const tabelaEl = document.getElementById("auditoriaTabela");
  const metricas = [
    ["Cancelamentos", 12],
    ["Descontos manuais", 18],
    ["Ajustes de valor", 9],
    ["Estornos", 7],
  ];

  resumoEl.innerHTML = metricas
    .map(
      ([rotulo, valor]) => `
        <div class="admin-auditoria-metrica">
          <span>${rotulo}</span>
          <strong>${valor}</strong>
        </div>`,
    )
    .join("");

  tabelaEl.innerHTML = operacoesSensiveis
    .map(
      (operacao) => `
        <tr>
          <td>${formatarDataHora(operacao.data)}</td>
          <td>${operacao.operador}</td>
          <td>${operacao.unidade}</td>
          <td><span class="admin-auditoria-tipo">${operacao.tipo}</span></td>
          <td>${operacao.pedido}</td>
          <td>${formatarMoeda(operacao.impacto)}</td>
          <td>${operacao.motivo}</td>
          <td><span class="admin-auditoria-status">${operacao.status}</span></td>
        </tr>`,
    )
    .join("");
}

// Agrupa os pedidos por forma de pagamento e mostra sua participacao percentual.
function renderizarPagamentos() {
  const totais = {};

  pedidosSalvos.forEach((pedido) => {
    const forma = pedido.pagamento || "Não informado";
    totais[forma] = (totais[forma] || 0) + 1;
  });

  const container = document.getElementById("graficoPagamentos");
  const entradas = Object.entries(totais).sort((a, b) => b[1] - a[1]);

  if (!entradas.length) {
    container.innerHTML =
      '<p class="admin-sem-dados">Sem dados disponíveis.</p>';
    return;
  }

  container.innerHTML = entradas
    .map(([forma, quantidade], indice) => {
      const percentual = Math.round((quantidade / pedidosSalvos.length) * 100);
      return `<div class="admin-pagamento-item">
        <span class="admin-pagamento-cor cor-${(indice % 4) + 1}"></span>
        <span>${forma}</span><strong>${percentual}%</strong>
      </div>`;
    })
    .join("");
}

// Agrupa os itens vendidos e exibe os cinco produtos com maior quantidade.
function renderizarRanking() {
  const totais = {};
  pedidosSalvos.forEach((pedido) => {
    (pedido.itens || []).forEach((item) => {
      const nome = item.nome || item.titulo || "Produto";
      totais[nome] = (totais[nome] || 0) + obterQuantidade(item);
    });
  });

  const ranking = Object.entries(totais)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maior = ranking[0]?.[1] || 1;
  const container = document.getElementById("rankingProdutos");

  if (!ranking.length) {
    container.innerHTML =
      '<p class="admin-sem-dados">Sem dados disponíveis.</p>';
    return;
  }

  container.innerHTML = ranking
    .map(
      ([nome, quantidade]) => `
        <div class="admin-financeiro-item">
          <span class="admin-financeiro-nome">${nome}</span>
          <div class="admin-financeiro-track"><span style="width: ${(quantidade / maior) * 100}%"></span></div>
          <strong>${quantidade}</strong>
        </div>`,
    )
    .join("");
}

// Cria uma lista de barras com o faturamento acumulado de cada unidade.
function renderizarVendasPorUnidade() {
  const vendas = {};

  pedidosSalvos.forEach((pedido) => {
    const unidadeCompleta = pedido.unidade || "Unidade não informada";
    const unidade = unidadeCompleta.split(" - ")[0];
    vendas[unidade] = (vendas[unidade] || 0) + Number(pedido.total || 0);
  });

  renderizarRankingFinanceiro("vendasPorUnidade", vendas);
}

// Identifica a regiao pelo estado da unidade e soma seu faturamento.
function renderizarVendasPorRegiao() {
  const regioesPorEstado = {
    AC: "Norte",
    AL: "Nordeste",
    AP: "Norte",
    AM: "Norte",
    BA: "Nordeste",
    CE: "Nordeste",
    DF: "Centro-Oeste",
    ES: "Sudeste",
    GO: "Centro-Oeste",
    MA: "Nordeste",
    MT: "Centro-Oeste",
    MS: "Centro-Oeste",
    MG: "Sudeste",
    PA: "Norte",
    PB: "Nordeste",
    PR: "Sul",
    PE: "Nordeste",
    PI: "Nordeste",
    RJ: "Sudeste",
    RN: "Nordeste",
    RS: "Sul",
    RO: "Norte",
    RR: "Norte",
    SC: "Sul",
    SP: "Sudeste",
    SE: "Nordeste",
    TO: "Norte",
  };
  const vendas = {};

  pedidosSalvos.forEach((pedido) => {
    const estadoEncontrado = (pedido.unidade || "").match(/([A-Z]{2})$/);
    const regiao = estadoEncontrado
      ? regioesPorEstado[estadoEncontrado[1]]
      : "Não identificada";
    vendas[regiao] = (vendas[regiao] || 0) + Number(pedido.total || 0);
  });

  renderizarRankingFinanceiro("vendasPorRegiao", vendas);
}

// Renderiza barras proporcionais para qualquer conjunto de valores financeiros.
function renderizarRankingFinanceiro(containerId, valores) {
  const entradas = Object.entries(valores).sort((a, b) => b[1] - a[1]);
  const container = document.getElementById(containerId);
  const maiorValor = entradas[0]?.[1] || 1;

  if (!entradas.length) {
    container.innerHTML =
      '<p class="admin-sem-dados">Sem dados disponíveis.</p>';
    return;
  }

  container.innerHTML = entradas
    .map(
      ([nome, valor]) => `
        <div class="admin-financeiro-item">
          <span class="admin-financeiro-nome">${nome}</span>
          <div class="admin-financeiro-track"><span style="width: ${(valor / maiorValor) * 100}%"></span></div>
          <strong>${formatarMoeda(valor)}</strong>
        </div>`,
    )
    .join("");
}

// Monta os totais de faturamento de cada um dos ultimos seis meses.
function dadosUltimosSeisMeses() {
  const meses = [];
  const hoje = new Date();

  for (let atraso = 5; atraso >= 0; atraso -= 1) {
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - atraso, 1);
    const fim = new Date(hoje.getFullYear(), hoje.getMonth() - atraso + 1, 0);
    fim.setHours(23, 59, 59, 999);
    const total = pedidosSalvos
      .filter((pedido) => {
        const dataPedido = new Date(pedido.data).getTime();
        return dataPedido >= inicio.getTime() && dataPedido <= fim.getTime();
      })
      .reduce((soma, pedido) => soma + Number(pedido.total || 0), 0);

    meses.push({
      label: inicio
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", ""),
      total,
    });
  }
  return meses;
}

// Desenha no canvas o gráfico de barras do faturamento mensal.
function desenharGraficoVendas() {
  const canvas = document.getElementById("graficoVendas");
  const contexto = canvas.getContext("2d");
  const dados = dadosUltimosSeisMeses();
  const escala = window.devicePixelRatio || 1;
  const largura = canvas.clientWidth;
  const altura = canvas.clientHeight;
  canvas.width = largura * escala;
  canvas.height = altura * escala;
  contexto.scale(escala, escala);
  contexto.clearRect(0, 0, largura, altura);

  const margem = { top: 18, right: 10, bottom: 32, left: 48 };
  const areaLargura = largura - margem.left - margem.right;
  const areaAltura = altura - margem.top - margem.bottom;
  const maximo = Math.max(...dados.map((mes) => mes.total), 100);

  contexto.font = "12px Arial";
  contexto.strokeStyle = "#eadfd5";
  contexto.fillStyle = "#7c6f64";
  contexto.lineWidth = 1;

  for (let linha = 0; linha <= 4; linha += 1) {
    const y = margem.top + (areaAltura / 4) * linha;
    contexto.beginPath();
    contexto.moveTo(margem.left, y);
    contexto.lineTo(largura - margem.right, y);
    contexto.stroke();
    contexto.fillText(
      `R$ ${Math.round(maximo - (maximo / 4) * linha)}`,
      2,
      y + 4,
    );
  }

  const espaco = areaLargura / dados.length;
  dados.forEach((mes, indice) => {
    const barraLargura = Math.min(42, espaco * 0.58);
    const barraAltura = (mes.total / maximo) * areaAltura;
    const x = margem.left + espaco * indice + (espaco - barraLargura) / 2;
    const y = margem.top + areaAltura - barraAltura;
    contexto.fillStyle = mes.total ? "#c2410c" : "#eadfd5";
    contexto.beginPath();
    contexto.roundRect(x, y, barraLargura, Math.max(barraAltura, 3), 5);
    contexto.fill();
    contexto.fillStyle = "#7c6f64";
    contexto.textAlign = "center";
    contexto.fillText(mes.label, x + barraLargura / 2, altura - 9);
  });
  contexto.textAlign = "left";
}

// Abre ou fecha o menu do usuario administrador.
function alternarMenuAdmin() {
  const menu = document.getElementById("adminMenu");
  const botao = document.getElementById("adminMenuButton");
  const aberto = menu.classList.toggle("principal-user-menu-open");
  botao.setAttribute("aria-expanded", aberto);
}

// Encerra a sessão administrativa e retorna para a pagina inicial.
function sairDoAdmin() {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
}

document
  .getElementById("adminMenuButton")
  .addEventListener("click", alternarMenuAdmin);
document.getElementById("adminLogout").addEventListener("click", sairDoAdmin);
window.addEventListener("resize", desenharGraficoVendas);
prepararDados();
