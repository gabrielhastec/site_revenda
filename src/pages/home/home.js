/* ==================================================
   home.js – Casa das Máquinas
   Carrega produtos em destaque do JSON e aplica animações
================================================== */

import { http } from '/src/js/api/http.js';

document.addEventListener('DOMContentLoaded', async () => {
  await carregarDestaques();
  observarElementos();
});

async function carregarDestaques() {
  const container = document.getElementById('destaques-container');
  if (!container) return;

  try {
    const produtos = await http.get('/src/data/products.json');
    // Pega apenas os 3 primeiros produtos como destaque
    const destaques = produtos.slice(0, 3);

    container.innerHTML = destaques.map(p => `
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <img src="${p.imagem}" class="card-img-top" alt="${p.nome}" style="height: 250px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title fw-bold">${p.nome}</h5>
            <p class="card-text text-muted">${p.descricao}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="h5 fw-bold text-primary">R$ ${p.preco.toLocaleString('pt-BR')}</span>
              <a href="/produtos" class="btn btn-outline-primary">Ver detalhes</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar destaques:', error);
    container.innerHTML = '<p class="text-center">Erro ao carregar produtos em destaque.</p>';
  }
}

function observarElementos() {
  const elements = document.querySelectorAll('.card, .hero-stats div');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => {
    el.classList.add('hidden');
    observer.observe(el);
  });
}
