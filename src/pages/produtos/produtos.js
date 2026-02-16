/* ==================================================
   produtos.js – Casa das Máquinas
   Carrega produtos do JSON, aplica filtros e ordenação
================================================== */

import { http } from '/src/js/api/http.js';

let produtos = []; // Armazena todos os produtos carregados
let filtroAtual = 'todos';
let ordenacaoAtual = '';

document.addEventListener('DOMContentLoaded', async () => {
  await carregarProdutos();

  // Event listeners para filtros
  document.querySelectorAll('#filtros .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filtros .btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filtroAtual = btn.dataset.filter;
      aplicarFiltrosEOrdenacao();
    });
  });

  // Event listener para ordenação
  document.getElementById('ordenar').addEventListener('change', (e) => {
    ordenacaoAtual = e.target.value;
    aplicarFiltrosEOrdenacao();
  });
});

async function carregarProdutos() {
  const container = document.getElementById('produtos-container');
  try {
    produtos = await http.get('/src/data/products.json');
    renderizarProdutos(produtos);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    container.innerHTML = '<p class="text-center text-danger">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
  }
}

function aplicarFiltrosEOrdenacao() {
  let produtosFiltrados = [...produtos];

  // Aplicar filtro
  if (filtroAtual !== 'todos') {
    produtosFiltrados = produtosFiltrados.filter(p => p.categoria === filtroAtual);
  }

  // Aplicar ordenação
  if (ordenacaoAtual === 'preco-crescente') {
    produtosFiltrados.sort((a, b) => a.preco - b.preco);
  } else if (ordenacaoAtual === 'preco-decrescente') {
    produtosFiltrados.sort((a, b) => b.preco - a.preco);
  } else if (ordenacaoAtual === 'nome') {
    produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  renderizarProdutos(produtosFiltrados);
}

function renderizarProdutos(produtosParaRender) {
  const container = document.getElementById('produtos-container');
  if (!container) return;

  if (produtosParaRender.length === 0) {
    container.innerHTML = '<p class="text-center">Nenhum produto encontrado.</p>';
    return;
  }

  container.innerHTML = produtosParaRender.map(p => `
    <div class="col-md-4 produto-item">
      <div class="card border-0 shadow-sm h-100 ${!p.estoque ? 'out-of-stock' : ''}">
        <div class="position-relative">
          <img src="${p.imagem}" class="card-img-top" alt="${p.nome}">
          ${!p.estoque ? '<span class="position-absolute top-0 start-0 bg-secondary text-white p-2 m-3 rounded">Sem estoque</span>' : ''}
          ${p.estoque ? '<span class="position-absolute top-0 start-0 bg-success text-white p-2 m-3 rounded">Em estoque</span>' : ''}
        </div>
        <div class="card-body">
          <h5 class="card-title fw-bold">${p.nome}</h5>
          <p class="card-text text-muted small">${p.descricao}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="h5 fw-bold text-primary">R$ ${p.preco.toLocaleString('pt-BR')}</span>
              <small class="d-block text-muted">ou ${p.parcelas}x de R$ ${(p.preco / p.parcelas).toFixed(2)}</small>
            </div>
            <a href="/contato?produto=${encodeURIComponent(p.nome)}" class="btn btn-outline-primary btn-sm ${!p.estoque ? 'disabled' : ''}">Consultar</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}
