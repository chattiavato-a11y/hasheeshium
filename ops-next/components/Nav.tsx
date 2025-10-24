'use client';

import { useEffect, useState } from 'react';
import { getState, initState, onStateChange, toggleLang, toggleTheme } from '../../shared/lib/state.js';
import { renderIcon } from '../../shared/lib/icons/index.js';

function createHoneypot(): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'website';
  input.className = 'hidden-input';
  input.setAttribute('aria-hidden', 'true');
  return input;
}

export function Nav() {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    initState();
    const current = getState();
    setLang(current.lang as 'en' | 'es');
    setTheme(current.theme as 'light' | 'dark');
    const unsubscribe = onStateChange((next) => {
      setLang(next.lang as 'en' | 'es');
      setTheme(next.theme as 'light' | 'dark');
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function attachHoneypot(button: HTMLButtonElement) {
    const trap = createHoneypot();
    button.insertAdjacentElement('afterend', trap);
  }

  function handleJoin() {
    import('../../comm-us/join.js').then((module) => module.openJoinModal());
  }

  function handleContact() {
    import('../../comm-us/contact.js').then((module) => module.openContactModal());
  }

  function handleChat() {
    import('../../chatbot/widget.js').then((module) => module.openChattia());
  }

  useEffect(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('[data-honeypot]');
    buttons.forEach((btn) => attachHoneypot(btn));
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <a href="#top" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
          OPS Online Support
        </a>
        <div className="nav-actions">
          <button
            type="button"
            className="toggle-btn"
            aria-pressed={lang === 'es'}
            onClick={() => toggleLang()}
          >
            {lang === 'es' ? 'ES' : 'EN'}
          </button>
          <button
            type="button"
            className="toggle-btn"
            aria-pressed={theme === 'dark'}
            onClick={() => toggleTheme()}
          >
            {lang === 'es' ? 'Oscuro' : 'Dark'}
          </button>
          <button type="button" className="toggle-btn" data-honeypot onClick={handleJoin}>
            <span dangerouslySetInnerHTML={{ __html: renderIcon('join') }} />
            <span>{lang === 'es' ? 'Unirse' : 'Join'}</span>
          </button>
          <button type="button" className="toggle-btn" data-honeypot onClick={handleContact}>
            <span dangerouslySetInnerHTML={{ __html: renderIcon('contact') }} />
            <span>{lang === 'es' ? 'Contactar' : 'Contact'}</span>
          </button>
          <button type="button" className="toggle-btn" data-honeypot onClick={handleChat}>
            <span dangerouslySetInnerHTML={{ __html: renderIcon('chat') }} />
            <span>Chattia</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
