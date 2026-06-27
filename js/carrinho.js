const lista = document.getElementById("listaCarrinho");
const totalEl = document.getElementById("total");

let carrinho = JSON.parse(localStorage.getItem("cart")) || [];

// Formata valores monetarios para o padrão exibido na tela.
function formatarPreco(preco) {
  return preco.toFixed(2).replace(".", ",");
}

// Renderiza os itens atuais do carrinho e atualiza o total.
function renderCarrinho() {
  lista.innerHTML = "";

  if (carrinho.length === 0) {
    totalEl.innerText = "Total: R$ 0,00";
    lista.innerHTML = `
      <div class="carrinho-vazio">
        <h2>Seu carrinho está vazio</h2>
        <p>Volte ao cardápio e escolha seus sabores favoritos.</p>
        <button type="button" onclick="voltar()">Ver cardápio</button>
      </div>
    `;
    return;
  }

  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco;

    const div = document.createElement("article");
    div.classList.add("carrinho-item");
    const imagemProduto = item.imagem || "../assets/principal-hero-bg.png";

    div.innerHTML = `
      <img src="${imagemProduto}" alt="${item.nome}">
      <div class="carrinho-item-info">
        <h3>${item.nome}</h3>
        <p>${item.descricao || "Item do cardápio selecionado."}</p>
      </div>
      <div class="carrinho-item-acoes">
        <strong>R$ ${formatarPreco(item.preco)}</strong>
        <button type="button" onclick="removerItem(${index})">Remover</button>
      </div>
    `;

    lista.appendChild(div);
  });

  totalEl.innerText = "Total: R$ " + formatarPreco(total);
}

// Remove um item do carrinho e salva a lista atualizada.
function removerItem(index) {
  carrinho.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(carrinho));
  renderCarrinho();
}

// Avanca para o checkout quando ha itens no carrinho.
function irParaPagamento() {
  if (carrinho.length === 0) {
    return;
  }

  window.location.href = "checkout.html";
}

// Volta para a pagina principal do cardapio.
function voltar() {
  window.location.href = "principal.html";
}

renderCarrinho();
