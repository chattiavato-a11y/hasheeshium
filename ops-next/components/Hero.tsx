'use client';

type HeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
};

function createHoneypot(): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'website';
  input.className = 'hidden-input';
  input.setAttribute('aria-hidden', 'true');
  return input;
}

export function Hero(props: HeroProps) {
  const handleScroll = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <span className="badge">{props.eyebrow}</span>
      <h1>{props.title}</h1>
      <p>{props.subtitle}</p>
      <button
        type="button"
        onClick={handleScroll}
        ref={(button) => {
          if (button && !button.nextElementSibling?.classList.contains('hidden-input')) {
            button.insertAdjacentElement('afterend', createHoneypot());
          }
        }}
      >
        {props.primaryCta}
      </button>
    </section>
  );
}
