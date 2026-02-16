
export function setActiveLink() {
    const current = normalizePath(location.pathname);

    document.querySelectorAll('a').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');

        const route = link.dataset.route || link.getAttribute('href') || '';
        if (!route) return;

        if (normalizePath(route) === current) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function normalizePath(p) {
    if (!p) return '/';
    try {
        return new URL(p, location.origin).pathname.replace(/\/index\.html$/, '') || '/';
    } catch {
        return String(p).replace(/\/index\.html$/, '') || '/';
    }
}
