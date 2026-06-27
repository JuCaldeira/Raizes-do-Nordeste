// Alterna a visibilidade da senha informada durante o cadastro.
function mostrarSenha() {
  const senha = document.getElementById("senha");
  senha.type = senha.type === "password" ? "text" : "password";
}

let acaoConfirmadaCadastro = null;
const chaveLeituraLgpd = "documentosLgpdAbertos";

// Recupera quais documentos obrigatórios foram abertos nesta aba.
function obterLeiturasLgpd() {
  try {
    return JSON.parse(sessionStorage.getItem(chaveLeituraLgpd)) || {};
  } catch {
    return {};
  }
}

// Libera o aceite somente depois que os dois documentos foram abertos.
function atualizarAceiteLgpd() {
  const aceiteLgpd = document.getElementById("aceite-lgpd");
  const leituras = obterLeiturasLgpd();
  const termosAbertos = leituras.termos === true;
  const privacidadeAberta = leituras.privacidade === true;
  const documentosAbertos = termosAbertos && privacidadeAberta;

  aceiteLgpd.disabled = !documentosAbertos;

  if (!documentosAbertos) {
    aceiteLgpd.checked = false;
  }
}

// Registra a abertura do documento antes de exibi-lo na mesma aba.
function registrarAberturaDocumentoLgpd(event) {
  const documento = event.currentTarget.dataset.documentoLgpd;
  const leituras = obterLeiturasLgpd();

  leituras[documento] = true;
  sessionStorage.setItem(chaveLeituraLgpd, JSON.stringify(leituras));
  atualizarAceiteLgpd();
}

// Configura o visual do popup de cadastro conforme o tipo de mensagem.
function configurarCadastroPopup(tipo) {
  const popupIcone = document.getElementById("cadastroPopupIcone");

  popupIcone.classList.toggle(
    "cadastro-popup-icone-sucesso",
    tipo === "sucesso",
  );
}

// Exibe o popup de cadastro com mensagem e opções de ação.
function mostrarCadastroPopup(mensagem, opcoes = {}) {
  const popup = document.getElementById("cadastroPopup");
  const popupMensagem = document.getElementById("cadastroPopupMensagem");

  acaoConfirmadaCadastro = opcoes.aoConfirmar || null;
  popupMensagem.textContent = mensagem;
  configurarCadastroPopup(opcoes.tipo || "erro");
  popup.classList.add("login-popup-visivel");
}

// Fecha o popup de cadastro sem executar ações adicionais.
function fecharCadastroPopup() {
  document
    .getElementById("cadastroPopup")
    .classList.remove("login-popup-visivel");
}

// Executa a ação confirmada no popup, quando existir.
function confirmarCadastroPopup() {
  const acao = acaoConfirmadaCadastro;

  acaoConfirmadaCadastro = null;
  fecharCadastroPopup();

  if (typeof acao === "function") {
    acao();
  }
}

// Cancela a ação pendente e fecha o popup.
function cancelarCadastroPopup() {
  acaoConfirmadaCadastro = null;
  fecharCadastroPopup();
}

// Valida e salva um novo usuario no armazenamento local.
function cadastrar(event) {
  event.preventDefault();
  const aceiteLgpd = document.getElementById("aceite-lgpd").checked;
  const leiturasLgpd = obterLeiturasLgpd();

  if (!leiturasLgpd.termos || !leiturasLgpd.privacidade) {
    mostrarCadastroPopup(
      "Leia os Termos de uso e a Política de Privacidade antes de continuar.",
    );
    atualizarAceiteLgpd();
    return;
  }

  if (!aceiteLgpd) {
    mostrarCadastroPopup(
      "Você precisa aceitar os Termos de uso e a Política de Privacidade.",
    );
    return;
  }

  const usuario = {
    nome: document.getElementById("nome").value.trim(),
    sobrenome: document.getElementById("sobrenome").value.trim(),
    cpf: document.getElementById("cpf").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    endereco: document.getElementById("endereco").value.trim(),
    bairro: document.getElementById("bairro").value.trim(),
    cidade: document.getElementById("cidade").value.trim(),
    estado: document.getElementById("estado").value.trim(),
    email: document.getElementById("email").value.trim().toLowerCase(),
    senha: document.getElementById("senha").value,
    pontosFidelidade: 0,
    aceiteLgpd: true,
    dataCadastro: new Date().toISOString(),
  };

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  if (usuario.email === "admin@raizes.com.br") {
    mostrarCadastroPopup("Este e-mail não está disponível para cadastro.");
    return;
  }

  const emailJaCadastrado = usuarios.some(
    (item) => item.email === usuario.email,
  );
  const cpfJaCadastrado = usuarios.some(
    (item) =>
      (item.cpf || "").replace(/\D/g, "") === usuario.cpf.replace(/\D/g, ""),
  );

  if (emailJaCadastrado) {
    mostrarCadastroPopup("Este e-mail já está cadastrado.");
    return;
  }

  if (cpfJaCadastrado) {
    mostrarCadastroPopup("Este CPF já está cadastrado.");
    return;
  }

  usuarios.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  mostrarCadastroPopup("Conta criada com sucesso!", {
    tipo: "sucesso",
    aoConfirmar() {
      window.location.href = "entrar.html";
    },
  });
}

document.getElementById("cadastroPopup").addEventListener("click", (event) => {
  if (event.target.id === "cadastroPopup") {
    cancelarCadastroPopup();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    cancelarCadastroPopup();
  }
});

document.querySelectorAll("[data-documento-lgpd]").forEach((link) => {
  link.addEventListener("click", registrarAberturaDocumentoLgpd);
});

atualizarAceiteLgpd();
