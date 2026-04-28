// 1. Animação de Scroll (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

// 2. Lógica do Carrinho
// 1. Carregar carrinho salvo ao abrir a página
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let total = carrinho.reduce((sum, item) => sum + item.preco, 0);

// 2. Chamar a interface logo de cara para mostrar o que já tinha no carrinho
document.addEventListener('DOMContentLoaded', () => {
    configurarBotoes();
    atualizarInterface(); // Mostra os itens salvos ao carregar a página
});

function configurarBotoes() {
    document.querySelectorAll('.btn-add-cart').forEach(botao => {
        botao.onclick = () => {
            const nome = botao.getAttribute('data-nome');
            const preco = parseFloat(botao.getAttribute('data-preco'));

            carrinho.push({ nome, preco });
            total += preco;

            // SALVAR NO NAVEGADOR
            localStorage.setItem('carrinho', JSON.stringify(carrinho));

            atualizarInterface();
        };
    });
}

function atualizarInterface() {
    const lista = document.getElementById('lista-carrinho');
    const displayTotal = document.getElementById('valor-total');
    const contador = document.getElementById('cart-count');

    if (lista) {
        lista.innerHTML = "";
        carrinho.forEach((item, index) => {
            // Criamos o item com um evento de clique que chama a função removerItem
            lista.innerHTML += `
                <li onclick="removerItem(${index})" title="Clique para remover" style="cursor:pointer;">
                    ${item.nome} - R$ ${item.preco.toFixed(2)} 
                    <small style="color:red; font-size:10px; margin-left:5px;">(remover)</small>
                </li>`;
        });
    }

    // Recalcula o total corretamente sempre
    total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    if (displayTotal) displayTotal.innerText = total.toFixed(2);

    if (contador) {
        contador.innerText = carrinho.length;
        contador.style.display = carrinho.length > 0 ? "flex" : "none";
    }
}


function finalizarPedido() {
    if (carrinho.length === 0) return alert("Carrinho vazio!");

    // Formatação da mensagem (usamos encodeURIComponent para não dar erro com espaços e acentos)
    const listaItens = carrinho.map(i => `- ${i.nome} (R$ ${i.preco.toFixed(2)})`).join('\n');
    const numero = "5511999999999";
    const msg = `Olá! Gostaria de fazer um pedido:\n${listaItens}\n\nTotal: R$ ${total.toFixed(2)}`;

    // O link correto do WhatsApp usa barra e cifrão
    const url = `https://wa.me{numero}?text=${encodeURIComponent(msg)}`;

    window.open(url, '_blank');
}



function removerItem(index) {
    // Remove o item específico do array usando o index
    carrinho.splice(index, 1);

    // Atualiza o LocalStorage com a nova lista
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // Atualiza a tela
    atualizarInterface();
}
const btnCarrinho = document.querySelector('.botao-abrir-carrinho');
const containerCarrinho = document.querySelector('.carrinho-container');

btnCarrinho.addEventListener('click', () => {
    // Alterna a classe para mostrar/esconder o carrinho
    containerCarrinho.classList.toggle('carrinho-aberto');
});

const container = document.getElementById('container');

fetch('teste.json')
  .then(response => response.json())
  .then(menu => {
    menu.forEach(item => {
      container.innerHTML += `
        <div class="menu-item">
          <h3>${item.nome}</h3>
          <p>${item.descricao}</p> <!-- Corrigido aqui </p> -->
          <p><strong>${item.preco}</strong></p>
        </div>
      `;
    });
  })
  .catch(error => console.error('Erro ao carregar o menu:', error));

