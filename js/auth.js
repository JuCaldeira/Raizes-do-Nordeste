// Protege as páginas internas e direciona cada tipo de usuário para sua área.
(function protegerAreaLogada() {
  const usuario = JSON.parse(localStorage.getItem("user")) || null;
  const paginaAtual = window.location.pathname.split("/").pop();
  const paginaAdministrativa = paginaAtual === "admin.html";

  if (!usuario) {
    window.location.replace("entrar.html");
    return;
  }

  if (usuario.tipo === "admin" && !paginaAdministrativa) {
    window.location.replace("admin.html");
    return;
  }

  if (usuario.tipo !== "admin" && paginaAdministrativa) {
    window.location.replace("principal.html");
  }
})();
