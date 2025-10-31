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
  let expandFab = null;
  const fabCluster = document.querySelector('.fab-cluster');
  if (fabCluster) {
    const fabMainButton = fabCluster.querySelector('.fab-main');
    const fabActions = fabCluster.querySelector('.fab-actions');

    const setFabExpanded = (expanded) => {
      fabCluster.dataset.expanded = expanded ? 'true' : 'false';
      if (fabMainButton) {
        fabMainButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        fabMainButton.setAttribute(
          'aria-label',
          expanded ? 'Close quick actions' : 'Open quick actions'
        );
      }
      if (fabActions) {
        fabActions.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      }
    };

    setFabExpanded(false);
    expandFab = () => setFabExpanded(true);
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

  const joinFormTriggers = Array.from(document.querySelectorAll('[data-trigger-join-form]'));
  if (joinFormTriggers.length) {
    joinFormTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        const joinUsLink = fabCluster ? fabCluster.querySelector('.fab-action[href="apply.html"]') : null;

        if (typeof expandFab === 'function') {
          expandFab();
          if (joinUsLink) {
            window.requestAnimationFrame(() => joinUsLink.focus());
          }
        }

        if (joinUsLink) {
          event.preventDefault();
          window.setTimeout(() => {
            window.location.href = joinUsLink.href;
          }, 150);
        }
      });
    });
  }

  const chatPanel = document.getElementById('chatbot-panel');
  const chatForm = document.getElementById('chatbot-form');
  const chatInput = document.getElementById('chatbot-input');
  const chatBody = chatPanel ? chatPanel.querySelector('.chatbot-body') : null;
  const chatToggles = Array.from(document.querySelectorAll('[data-chat-toggle]'));

  const resetChatPanelPosition = () => {
    if (!chatPanel) {
      return;
    }

    chatPanel.style.left = '';
    chatPanel.style.top = '';
    chatPanel.style.right = '';
    chatPanel.style.bottom = '';
    chatPanel.style.insetInlineEnd = '';
    chatPanel.style.insetBlockEnd = '';
    chatPanel.style.transform = '';
  };

  const setChatOpen = (isOpen) => {
    if (!chatPanel) {
      return;
    }

    if (isOpen) {
      resetChatPanelPosition();
      chatPanel.removeAttribute('hidden');
      chatPanel.setAttribute('aria-hidden', 'false');
      if (chatInput) {
        window.requestAnimationFrame(() => chatInput.focus());
      }
      chatPanel.dispatchEvent(new Event('chatpanelopen'));
    } else {
      chatPanel.setAttribute('hidden', '');
      chatPanel.setAttribute('aria-hidden', 'true');
      resetChatPanelPosition();
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
    const PANEL_MARGIN = 16;
    document.addEventListener('click', (event) => {
      const clickedToggle = chatToggles.some((toggle) => toggle.contains(event.target));
      if (clickedToggle) {
        return;
      }

      if (!chatPanel.contains(event.target) && !chatPanel.hasAttribute('hidden')) {
        setChatOpen(false);
      }
    });

    const chatHeader = chatPanel.querySelector('.chatbot-header');
    const clampValue = (value, min, max) => {
      if (min > max) {
        return (min + max) / 2;
      }
      return Math.min(Math.max(value, min), max);
    };

    const resolveBounds = (max, margin) => {
      if (max >= margin) {
        return { min: margin, max };
      }
      const fallback = Math.max(0, max);
      return { min: fallback, max: fallback };
    };

    const ensurePixelPosition = () => {
      if (chatPanel.style.left && chatPanel.style.top) {
        return;
      }
      const rect = chatPanel.getBoundingClientRect();
      chatPanel.style.left = `${rect.left}px`;
      chatPanel.style.top = `${rect.top}px`;
      chatPanel.style.right = 'auto';
      chatPanel.style.bottom = 'auto';
      chatPanel.style.insetInlineEnd = 'auto';
      chatPanel.style.insetBlockEnd = 'auto';
      chatPanel.style.transform = 'none';
    };

    const keepPanelInView = () => {
      if (!chatPanel.style.left || !chatPanel.style.top) {
        return;
      }

      const margin = PANEL_MARGIN;
      const panelWidth = chatPanel.offsetWidth;
      const panelHeight = chatPanel.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const maxLeft = viewportWidth - panelWidth - margin;
      const maxTop = viewportHeight - panelHeight - margin;
      const horizontal = resolveBounds(maxLeft, margin);
      const vertical = resolveBounds(maxTop, margin);
      const currentLeft = parseFloat(chatPanel.style.left);
      const currentTop = parseFloat(chatPanel.style.top);

      const nextLeft = clampValue(currentLeft, horizontal.min, horizontal.max);
      const nextTop = clampValue(currentTop, vertical.min, vertical.max);

      chatPanel.style.left = `${nextLeft}px`;
      chatPanel.style.top = `${nextTop}px`;
    };

    const centerChatPanel = () => {
      const rect = chatPanel.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const maxLeft = viewportWidth - rect.width - PANEL_MARGIN;
      const maxTop = viewportHeight - rect.height - PANEL_MARGIN;
      const horizontal = resolveBounds(maxLeft, PANEL_MARGIN);
      const vertical = resolveBounds(maxTop, PANEL_MARGIN);

      const desiredLeft = (viewportWidth - rect.width) / 2;
      const desiredTop = (viewportHeight - rect.height) / 2;

      const nextLeft = clampValue(desiredLeft, horizontal.min, horizontal.max);
      const nextTop = clampValue(desiredTop, vertical.min, vertical.max);

      chatPanel.style.left = `${nextLeft}px`;
      chatPanel.style.top = `${nextTop}px`;
      chatPanel.style.right = 'auto';
      chatPanel.style.bottom = 'auto';
      chatPanel.style.insetInlineEnd = 'auto';
      chatPanel.style.insetBlockEnd = 'auto';
      chatPanel.style.transform = 'none';
    };

    window.addEventListener('resize', keepPanelInView);
    chatPanel.addEventListener('chatpanelopen', () => {
      window.requestAnimationFrame(() => {
        centerChatPanel();
        keepPanelInView();
      });
    });

    if (chatHeader && 'PointerEvent' in window) {
      const dragState = {
        pointerId: null,
        offsetX: 0,
        offsetY: 0,
        dragging: false,
      };

      const endDrag = () => {
        if (!dragState.dragging) {
          return;
        }

        dragState.dragging = false;
        if (dragState.pointerId !== null) {
          try {
            chatHeader.releasePointerCapture(dragState.pointerId);
          } catch (error) {
            /* noop */
          }
        }
        dragState.pointerId = null;
        chatPanel.classList.remove('is-dragging');
        keepPanelInView();
      };

      const handlePointerMove = (event) => {
        if (!dragState.dragging || event.pointerId !== dragState.pointerId) {
          return;
        }

        event.preventDefault();

        const margin = PANEL_MARGIN;
        const panelWidth = chatPanel.offsetWidth;
        const panelHeight = chatPanel.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const maxLeft = viewportWidth - panelWidth - margin;
        const maxTop = viewportHeight - panelHeight - margin;
        const horizontal = resolveBounds(maxLeft, margin);
        const vertical = resolveBounds(maxTop, margin);
        const desiredLeft = event.clientX - dragState.offsetX;
        const desiredTop = event.clientY - dragState.offsetY;

        const nextLeft = clampValue(desiredLeft, horizontal.min, horizontal.max);
        const nextTop = clampValue(desiredTop, vertical.min, vertical.max);

        chatPanel.style.left = `${nextLeft}px`;
        chatPanel.style.top = `${nextTop}px`;
      };

      const handlePointerDown = (event) => {
        if (event.button !== undefined && event.button !== 0 && event.pointerType !== 'touch') {
          return;
        }

        if (event.target.closest('button, a, input, textarea, select')) {
          return;
        }

        ensurePixelPosition();

        dragState.dragging = true;
        dragState.pointerId = event.pointerId;
        const rect = chatPanel.getBoundingClientRect();
        dragState.offsetX = event.clientX - rect.left;
        dragState.offsetY = event.clientY - rect.top;

        try {
          chatHeader.setPointerCapture(event.pointerId);
        } catch (error) {
          /* noop */
        }

        chatPanel.classList.add('is-dragging');
      };

      chatHeader.addEventListener('pointerdown', handlePointerDown);
      chatHeader.addEventListener('pointermove', handlePointerMove);
      chatHeader.addEventListener('pointerup', endDrag);
      chatHeader.addEventListener('pointercancel', endDrag);
      chatHeader.addEventListener('lostpointercapture', endDrag);
    }
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
