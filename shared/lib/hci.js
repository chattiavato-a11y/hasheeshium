const activeTraps = new Set();
let scrollLockCount = 0;

export function lockBodyScroll() {
  if (typeof document === "undefined") return;
  scrollLockCount += 1;
  document.body.setAttribute("aria-hidden", "true");
}

export function unlockBodyScroll() {
  if (typeof document === "undefined") return;
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.removeAttribute("aria-hidden");
  }
}

export function trapFocus(container) {
  if (!container) return () => {};
  const focusableSelectors = [
    'button',
    '[href]',
    'input',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])'
  ];
  const nodes = Array.from(container.querySelectorAll(focusableSelectors.join(','))).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  );
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (first) {
    first.focus({ preventScroll: true });
  }
  function handleKey(event) {
    if (event.key !== 'Tab') return;
    if (nodes.length === 0) {
      event.preventDefault();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  container.addEventListener('keydown', handleKey);
  activeTraps.add({ container, handleKey });
  return () => {
    container.removeEventListener('keydown', handleKey);
    activeTraps.forEach((item) => {
      if (item.container === container) {
        activeTraps.delete(item);
      }
    });
  };
}

export function bindModalLifecycle(backdrop, onClose) {
  if (!backdrop) return () => {};
  const handleKey = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };
  const handleClick = (event) => {
    if (event.target === backdrop) {
      onClose();
    }
  };
  backdrop.addEventListener('click', handleClick);
  window.addEventListener('keydown', handleKey);
  return () => {
    backdrop.removeEventListener('click', handleClick);
    window.removeEventListener('keydown', handleKey);
  };
}

export function makeDraggable(element, handle) {
  if (!element || !handle) return () => {};
  if (typeof window === 'undefined') return () => {};
  const media = window.matchMedia('(min-width: 901px)');
  if (!media.matches) {
    return () => {};
  }
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  function onPointerDown(event) {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    const rect = element.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    element.style.transition = 'none';
    handle.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!isDragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    element.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function onPointerUp(event) {
    if (!isDragging) return;
    isDragging = false;
    handle.releasePointerCapture(event.pointerId);
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    element.style.transition = '';
    element.style.left = `${initialLeft + dx}px`;
    element.style.top = `${initialTop + dy}px`;
    element.style.transform = 'translate(0, 0)';
    element.style.position = 'fixed';
  }

  handle.style.cursor = 'grab';
  handle.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  return () => {
    handle.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
