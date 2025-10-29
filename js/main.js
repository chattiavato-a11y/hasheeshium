(function () {
  const nav = document.querySelector('.ops-nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (nav) {
    const setNavState = () => {
      if (window.scrollY > 12) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    setNavState();
    window.addEventListener('scroll', setNavState, { passive: true });
  }

  if (navLinks.length) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter((section) => section);

    const activateLink = (hash) => {
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === hash) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries
            .filter((entry) => entry.isIntersecting)
            .forEach((entry) => {
              activateLink(`#${entry.target.id}`);
            });
        },
        {
          root: null,
          threshold: 0.35,
        }
      );

      sections.forEach((section) => observer.observe(section));
    }

    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const hash = link.getAttribute('href');
        const target = document.querySelector(hash);
        if (!target) {
          return;
        }

        event.preventDefault();

        if (reduceMotionQuery.matches) {
          target.scrollIntoView();
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        activateLink(hash);
      });
    });
  }
})();
