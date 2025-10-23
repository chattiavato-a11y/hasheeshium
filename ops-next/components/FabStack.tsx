'use client';

import { useEffect, useState } from 'react';
import { renderIcon } from '../../shared/lib/icons/index.js';

type FabStackProps = {
  labels: {
    join: string;
    contact: string;
    chat: string;
  };
};

function createHoneypot(): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'website';
  input.className = 'hidden-input';
  input.setAttribute('aria-hidden', 'true');
  return input;
}

export function FabStack({ labels }: FabStackProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 901px)');
    const sync = () => setVisible(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  if (!visible) return null;

  const attach = (button: HTMLButtonElement | null) => {
    if (button && !button.nextElementSibling?.classList.contains('hidden-input')) {
      button.insertAdjacentElement('afterend', createHoneypot());
    }
  };

  return (
    <div className="fab-stack">
      <button
        type="button"
        className="fab-button"
        onClick={() => import('../../comm-us/join.js').then((m) => m.openJoinModal())}
        ref={attach}
      >
        <span dangerouslySetInnerHTML={{ __html: renderIcon('join') }} />
        <span>{labels.join}</span>
      </button>
      <button
        type="button"
        className="fab-button"
        onClick={() => import('../../comm-us/contact.js').then((m) => m.openContactModal())}
        ref={attach}
      >
        <span dangerouslySetInnerHTML={{ __html: renderIcon('contact') }} />
        <span>{labels.contact}</span>
      </button>
      <button
        type="button"
        className="fab-button"
        onClick={() => import('../../chatbot/widget.js').then((m) => m.openChattia())}
        ref={attach}
      >
        <span dangerouslySetInnerHTML={{ __html: renderIcon('chat') }} />
        <span>{labels.chat}</span>
      </button>
    </div>
  );
}
