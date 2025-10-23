'use client';

import { useEffect, useState } from 'react';
import { renderIcon } from '../../shared/lib/icons/index.js';

type Props = {
  copy: {
    title: string;
    subtitle: string;
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

export function MobileActions({ copy }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 901px)');
    const sync = () => setVisible(!media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const attach = (button: HTMLButtonElement | null) => {
    if (button && !button.nextElementSibling?.classList.contains('hidden-input')) {
      button.insertAdjacentElement('afterend', createHoneypot());
    }
  };

  if (!visible) return null;

  return (
    <div className="mobile-actions">
      <header>
        <strong>{copy.title}</strong>
        <span className="hint">{copy.subtitle}</span>
      </header>
      <div className="accordion">
        <button
          type="button"
          onClick={() => import('../../comm-us/join.js').then((m) => m.openJoinModal())}
          ref={attach}
        >
          <span dangerouslySetInnerHTML={{ __html: renderIcon('join') }} />
          <span>{copy.join}</span>
        </button>
        <button
          type="button"
          onClick={() => import('../../comm-us/contact.js').then((m) => m.openContactModal())}
          ref={attach}
        >
          <span dangerouslySetInnerHTML={{ __html: renderIcon('contact') }} />
          <span>{copy.contact}</span>
        </button>
        <button
          type="button"
          onClick={() => import('../../chatbot/widget.js').then((m) => m.openChattia())}
          ref={attach}
        >
          <span dangerouslySetInnerHTML={{ __html: renderIcon('chat') }} />
          <span>{copy.chat}</span>
        </button>
      </div>
    </div>
  );
}
