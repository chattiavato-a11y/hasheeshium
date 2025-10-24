/// <reference path="../../types/chattia-widget.d.ts" />
'use client';

export default function ChattiaPage() {
  return (
    <main
      style={{
        paddingTop: 'var(--space-7)',
        paddingBottom: 'var(--space-7)',
        width: 'min(100% - 2 * var(--space-6), var(--max-content-width))',
        margin: '0 auto'
      }}
    >
      <section className="hero">
        <span className="badge">Chattia</span>
        <h1>Meet Chattia</h1>
        <p>On-device retrieval, STT/TTS via Web Speech API, and guild shortcuts without external calls.</p>
        <button
          type="button"
          onClick={() => import('../../../chatbot/widget.js').then((module) => module.openChattia())}
          ref={(button) => {
            if (button && !button.nextElementSibling?.classList.contains('hidden-input')) {
              const input = document.createElement('input');
              input.type = 'text';
              input.name = 'website';
              input.className = 'hidden-input';
              input.setAttribute('aria-hidden', 'true');
              button.insertAdjacentElement('afterend', input);
            }
          }}
        >
          Launch Chattia
        </button>
      </section>
    </main>
  );
}
