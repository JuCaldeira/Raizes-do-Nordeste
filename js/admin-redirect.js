// Impede que o administrador navegue pelas paginas publicas enquanto estiver logado.
(function manterAdminNoPainel() {
  const usuario = JSON.parse(localStorage.getItem("user")) || null;

  if (usuario?.tipo !== "admin") {
    return;
  }

  const estaEmPaginas = window.location.pathname.includes("/paginas/");
  window.location.replace(estaEmPaginas ? "admin.html" : "paginas/admin.html");
})();
