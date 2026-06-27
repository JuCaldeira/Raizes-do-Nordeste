let usuarioMeusDados = JSON.parse(localStorage.getItem("user")) || {};
let acaoDadosPopup = null;

const camposMeusDados = [
  "nome",
  "sobrenome",
  "cpf",
  "telefone",
  "endereco",
  "bairro",
  "cidade",
  "estado",
  "email",
];

// Preenche o formulário com os dados do cliente autenticado.
function preencherMeusDados() {
  camposMeusDados.forEach((campo) => {
    document.getElementById(campo).value = usuarioMeusDados[campo] || "";
  });
}

// Exibe mensagens e confirmações mantendo o padrão visual do projeto.
function mostrarDadosPopup(mensagem, opcoes = {}) {
  const popup = document.getElementById("dadosPopup");
  const icone = document.getElementById("dadosPopupIcone");
  const cancelar = document.getElementById("dadosPopupCancelar");
  const confirmar = document.getElementById("dadosPopupConfirmar");

  acaoDadosPopup = opcoes.aoConfirmar || null;
  document.getElementById("dadosPopupMensagem").textContent = mensagem;
  icone.classList.toggle(
    "cadastro-popup-icone-sucesso",
    opcoes.tipo === "sucesso",
  );
  icone.classList.toggle(
    "cadastro-popup-icone-confirmacao",
    opcoes.tipo === "confirmacao",
  );
  cancelar.classList.toggle(
    "cadastro-popup-cancelar-visivel",
    !!opcoes.mostrarCancelar,
  );
  confirmar.textContent = opcoes.textoConfirmar || "OK";
  confirmar.onclick = confirmarDadosPopup;
  popup.classList.add("login-popup-visivel");
}

// Fecha o popup e descarta qualquer ação que estivesse aguardando confirmação.
function fecharDadosPopup() {
  acaoDadosPopup = null;
  document.getElementById("dadosPopup").classList.remove("login-popup-visivel");
}

// Fecha o popup e executa a ação confirmada, quando houver.
function confirmarDadosPopup() {
  const acao = acaoDadosPopup;

  acaoDadosPopup = null;
  document.getElementById("dadosPopup").classList.remove("login-popup-visivel");

  if (typeof acao === "function") {
    acao();
  }
}

// Atualiza o usuário logado e o cadastro correspondente.
function salvarMeusDados(event) {
  event.preventDefault();

  const emailAnterior = usuarioMeusDados.email;
  const emailAtualizado = document
    .getElementById("email")
    .value.trim()
    .toLowerCase();
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const emailEmUso = usuarios.some(
    (usuario) =>
      usuario.email === emailAtualizado && usuario.email !== emailAnterior,
  );

  if (emailEmUso || emailAtualizado === "admin@raizes.com.br") {
    mostrarDadosPopup("Este e-mail já está sendo utilizado.");
    return;
  }

  usuarioMeusDados = {
    ...usuarioMeusDados,
    nome: document.getElementById("nome").value.trim(),
    sobrenome: document.getElementById("sobrenome").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    endereco: document.getElementById("endereco").value.trim(),
    bairro: document.getElementById("bairro").value.trim(),
    cidade: document.getElementById("cidade").value.trim(),
    estado: document.getElementById("estado").value.trim(),
    email: emailAtualizado,
  };

  const usuariosAtualizados = usuarios.map((usuario) =>
    usuario.email === emailAnterior ? { ...usuarioMeusDados } : usuario,
  );

  localStorage.setItem("usuarios", JSON.stringify(usuariosAtualizados));
  localStorage.setItem("user", JSON.stringify(usuarioMeusDados));

  mostrarDadosPopup("Dados atualizados com sucesso!", {
    tipo: "sucesso",
    aoConfirmar() {
      window.location.href = "principal.html";
    },
  });
}

// Solicita confirmação antes de excluir definitivamente a conta local.
function solicitarExclusaoConta() {
  mostrarDadosPopup(
    "Tem certeza que deseja excluir sua conta e os dados associados?",
    {
      tipo: "confirmacao",
      mostrarCancelar: true,
      textoConfirmar: "Excluir",
      aoConfirmar: excluirConta,
    },
  );
}

// Remove o cadastro e os dados locais associados antes de encerrar a sessão.
function excluirConta() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuariosRestantes = usuarios.filter(
    (usuario) => usuario.email !== usuarioMeusDados.email,
  );

  localStorage.setItem("usuarios", JSON.stringify(usuariosRestantes));
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  localStorage.removeItem("unidadeSelecionada");
  localStorage.removeItem("ultimoPedido");
  localStorage.removeItem("historicoPedidos");
  window.location.href = "../index.html";
}

document.getElementById("dadosPopup").addEventListener("click", (event) => {
  if (event.target.id === "dadosPopup") {
    fecharDadosPopup();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fecharDadosPopup();
  }
});

preencherMeusDados();
