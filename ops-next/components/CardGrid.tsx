'use client';

import { openModal } from '../../comm-us/ui.js';

type Service = {
  id: string;
  badge: string;
  title: string;
  excerpt: string;
  modal: {
    title: string;
    summary: string;
    body: string[];
    links?: { label: string; url: string }[];
  };
};

type CardGridProps = {
  services: Service[];
  title: string;
  openLabel: string;
};

function createHoneypot(): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'website';
  input.className = 'hidden-input';
  input.setAttribute('aria-hidden', 'true');
  return input;
}

function openServiceModal(service: Service) {
  openModal({
    title: service.modal.title,
    description: service.modal.summary,
    content: (body: HTMLElement) => {
      const list = document.createElement('ul');
      list.style.display = 'grid';
      list.style.gap = '12px';
      list.style.padding = '0';
      list.style.listStyle = 'none';
      service.modal.body.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      body.appendChild(list);
      if (service.modal.links?.length) {
        const linkWrap = document.createElement('div');
        linkWrap.style.display = 'grid';
        linkWrap.style.gap = '8px';
        service.modal.links.forEach((link) => {
          const anchor = document.createElement('a');
          anchor.href = link.url;
          anchor.textContent = link.label;
          anchor.className = 'link-btn';
          anchor.setAttribute('role', 'button');
          linkWrap.appendChild(anchor);
        });
        body.appendChild(linkWrap);
      }
    },
    footer: undefined
  });
}

export function CardGrid({ services, title, openLabel }: CardGridProps) {
  return (
    <section id="services">
      <h2 style={{ fontSize: '1.75rem' }}>{title}</h2>
      <div className="card-grid">
        {services.map((service) => (
          <article className="card" key={service.id} id={service.id}>
            <span className="badge">{service.badge}</span>
            <h3>{service.title}</h3>
            <p>{service.excerpt}</p>
            <button
              type="button"
              onClick={() => openServiceModal(service)}
              ref={(button) => {
                if (button && !button.nextElementSibling?.classList.contains('hidden-input')) {
                  button.insertAdjacentElement('afterend', createHoneypot());
                }
              }}
            >
              {openLabel}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
