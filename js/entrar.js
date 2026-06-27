// Alterna a exibicao da senha no campo de login.
function mostrarSenha() {
  const senha = document.getElementById("senha");
  senha.type = senha.type === "password" ? "text" : "password";
}

// Exibe o popup de erro do login com a mensagem recebida.
function mostrarLoginPopup(mensagem) {
  const popup = document.getElementById("loginPopup");
  const popupMensagem = document.getElementById("loginPopupMensagem");

  popupMensagem.textContent = mensagem;
  popup.classList.add("login-popup-visivel");
}

// Fecha o popup de mensagem do login.
function fecharLoginPopup() {
  document.getElementById("loginPopup").classList.remove("login-popup-visivel");
}

// Valida usuario e senha antes de entrar no sistema.
function login(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    mostrarLoginPopup("Preencha todos os campos.");
    return;
  }

  const admin = {
    email: "admin@raizes.com.br",
    senha: "Admin@123",
    nome: "Adm",
    tipo: "admin",
  };

  if (email === admin.email) {
    if (senha !== admin.senha) {
      mostrarLoginPopup("E-mail ou senha incorretos.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(admin));
    window.location.href = "admin.html";
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioEncontrado = usuarios.find(
    (usuario) => usuario.email === email && usuario.senha === senha,
  );

  if (!usuarioEncontrado) {
    mostrarLoginPopup("E-mail ou senha incorretos.");
    return;
  }

  const usuarioLogado = {
    ...usuarioEncontrado,
    tipo: "cliente",
    pontosFidelidade: usuarioEncontrado.pontosFidelidade || 0,
  };

  localStorage.setItem("user", JSON.stringify(usuarioLogado));
  window.location.href = "principal.html";
}

document.getElementById("loginPopup").addEventListener("click", (event) => {
  if (event.target.id === "loginPopup") {
    fecharLoginPopup();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fecharLoginPopup();
  }
});
