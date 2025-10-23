'use client';

export default function ContactPage() {
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
        <span className="badge">OPS Response</span>
        <h1>Contact OPS Online Support</h1>
        <p>Capture your engagement request with local validation, honeypot defense, and exportable payloads.</p>
        <button
          type="button"
          onClick={() => import('../../../comm-us/contact.js').then((module) => module.openContactModal())}
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
          Open Contact Form
        </button>
      </section>
    </main>
  );
}
