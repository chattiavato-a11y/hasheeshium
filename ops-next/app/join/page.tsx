'use client';

export default function JoinPage() {
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
        <span className="badge">OPS Guild</span>
        <h1>Join the OPS Guild</h1>
        <p>Validate your interest locally and export the payload securely without leaving the static experience.</p>
        <button
          type="button"
          onClick={() => import('../../../comm-us/join.js').then((module) => module.openJoinModal())}
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
          Open Join Form
        </button>
      </section>
    </main>
  );
}
