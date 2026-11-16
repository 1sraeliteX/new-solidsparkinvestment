    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('ssi-theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);

    function updateThemeButton() {
      const isLight = root.getAttribute('data-theme') === 'light';
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      themeToggle.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
      themeToggle.innerHTML = isLight
        ? '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
        : '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13z"/></svg>';
    }

    updateThemeButton();
    themeToggle.addEventListener('click', () => {
      const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('ssi-theme', nextTheme);
      updateThemeButton();
    });

    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    const accountMenuWrap = document.getElementById('account-menu-wrap');
    const accountMenuToggle = document.getElementById('account-menu-toggle');
    if (accountMenuWrap && accountMenuToggle) {
      accountMenuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = accountMenuWrap.classList.toggle('is-open');
        accountMenuToggle.setAttribute('aria-expanded', String(isOpen));
      });

      accountMenuWrap.querySelectorAll('.account-menu-link').forEach((link) => {
        link.addEventListener('click', () => {
          accountMenuWrap.classList.remove('is-open');
          accountMenuToggle.setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('click', (event) => {
        if (!accountMenuWrap.contains(event.target)) {
          accountMenuWrap.classList.remove('is-open');
          accountMenuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const aboutScrollTop = document.getElementById('about-scroll-top');
    aboutScrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
