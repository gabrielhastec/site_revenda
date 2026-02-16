
import { navigate } from './router.js';
import { loadComponent } from './utils/dom.js';
import { setActiveLink } from './components/navbar.js';
import { delegateClick } from './utils/events.js';
import { scrollToTop } from './utils/animations.js';

(async function init() {
  // Carrega header e footer
  await Promise.all([
    loadComponent('header', '/src/components/header.html'),
    loadComponent('footer', '/src/components/footer.html')
  ]);

  // Delegação de cliques em links internos
  delegateClick(route => {
    navigate(route).then(() => {
      setActiveLink();
      scrollToTop();
    });
  });

  // Navegação inicial
  await navigate();
  setActiveLink();
})();
