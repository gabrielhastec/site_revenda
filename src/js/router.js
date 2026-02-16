
export const routes = {
  '/': '/src/pages/home/home.html',
  '/home': '/src/pages/home/home.html',
  '/produtos': '/src/pages/produtos/produtos.html',
  '/oferta': '/src/pages/oferta/oferta.html',
  '/contato': '/src/pages/contato/contato.html',
};

export async function navigate(path = location.pathname) {
  const cleanPath = path === '' ? '/' : path.replace(/\/index\.html$/i, '');

  const pagePath = routes[cleanPath] || routes['/'];
  await loadPage(pagePath);
  history.pushState(null, '', cleanPath);
}

export async function loadPage(pagePath) {
  const app = document.getElementById('app');
  if (!app) return;

  // Inicia transição de saída
  app.style.transition = 'opacity 0.2s';
  app.style.opacity = '0';
  
  try {
    const res = await fetch(pagePath);
    if (!res.ok) throw new Error(`Erro ao carregar ${pagePath}`);
    
    const html = await res.text();
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove CSS e JS de páginas anteriores
    document.querySelectorAll('[data-page-css], [data-page-js]').forEach(el => el.remove());

    // Extrai CSS
    const cssLinks = temp.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
      const newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = link.href;
      newLink.dataset.pageCss = 'true';
      document.head.appendChild(newLink);
    });

    // Extrai JS
    const scripts = temp.querySelectorAll('script[type="module"]');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      newScript.type = 'module';
      newScript.src = script.src;
      newScript.dataset.pageJs = 'true';
      document.body.appendChild(newScript);
    });
    
    // Atualiza o conteúdo
    app.innerHTML = temp.innerHTML;

    // Força reflow e transição de entrada
    requestAnimationFrame(() => {
      app.style.opacity = '1';
    });

    // Atualiza título da página
    const title = temp.querySelector('title')?.innerText;
    if (title) document.title = title;
    else document.title = 'Casa das Máquinas';

  }catch (err) {
    console.error('Erro ao carregar página:', err);
    app.innerHTML = `
      <div class="container py-5 text-center">
        <h2>Erro ao carregar página</h2>
        <p>Tente novamente mais tarde.</p>
        <a href="/" class="btn btn-primary">Voltar ao início</a>
      </div>
    `;
    app.style.opacity = '1';
  }
}

// Trata navegação com botões voltar/avançar
window.addEventListener('popstate', () => {
  currentPath = ''; // força recarregar
  navigate();
});
