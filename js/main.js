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

  let collapseFab = null;
  const fabCluster = document.querySelector('.fab-cluster');
  if (fabCluster) {
    const fabMainButton = fabCluster.querySelector('.fab-main');
    const fabActions = fabCluster.querySelector('.fab-actions');

    const setFabExpanded = (expanded) => {
      fabCluster.dataset.expanded = expanded ? 'true' : 'false';
      if (fabMainButton) {
        fabMainButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
      if (fabActions) {
        fabActions.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      }
    };

    setFabExpanded(false);
    collapseFab = () => setFabExpanded(false);

    const toggleFab = () => {
      const isExpanded = fabCluster.dataset.expanded === 'true';
      setFabExpanded(!isExpanded);
    };

    if (fabMainButton) {
      fabMainButton.addEventListener('click', toggleFab);
    }

    document.addEventListener('click', (event) => {
      if (!fabCluster.contains(event.target)) {
        setFabExpanded(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setFabExpanded(false);
      }
    });
  }

  const chatPanel = document.getElementById('chatbot-panel');
  const chatForm = document.getElementById('chatbot-form');
  const chatInput = document.getElementById('chatbot-input');
  const chatBody = chatPanel ? chatPanel.querySelector('.chatbot-body') : null;
  const chatToggles = Array.from(document.querySelectorAll('[data-chat-toggle]'));

  const setChatOpen = (isOpen) => {
    if (!chatPanel) {
      return;
    }

    if (isOpen) {
      chatPanel.removeAttribute('hidden');
      chatPanel.setAttribute('aria-hidden', 'false');
      if (chatInput) {
        window.requestAnimationFrame(() => chatInput.focus());
      }
    } else {
      chatPanel.setAttribute('hidden', '');
      chatPanel.setAttribute('aria-hidden', 'true');
    }
  };

  setChatOpen(false);

  if (chatToggles.length) {
    chatToggles.forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const isOpen = chatPanel && !chatPanel.hasAttribute('hidden');
        setChatOpen(!isOpen);
        if (typeof collapseFab === 'function') {
          collapseFab();
        }
      });
    });
  }

  if (chatPanel) {
    document.addEventListener('click', (event) => {
      const clickedToggle = chatToggles.some((toggle) => toggle.contains(event.target));
      if (clickedToggle) {
        return;
      }

      if (!chatPanel.contains(event.target) && !chatPanel.hasAttribute('hidden')) {
        setChatOpen(false);
      }
    });
  }

  const appendChatMessage = (text, role) => {
    if (!chatBody) {
      return;
    }
    const bubble = document.createElement('div');
    bubble.className = `chatbot-message ${role}`;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    bubble.appendChild(paragraph);
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = chatInput.value.trim();
      if (!message) {
        return;
      }

      appendChatMessage(message, 'user');
      chatInput.value = '';

      window.setTimeout(() => {
        appendChatMessage(
          'Thanks for your note! The OPS team will follow up shortly. You can also book a discovery call or hire remote professionals via the quick actions.',
          'bot'
        );
      }, 400);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && chatPanel && !chatPanel.hasAttribute('hidden')) {
      setChatOpen(false);
    }
  });
})();
