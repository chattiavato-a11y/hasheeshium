import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useExperience } from '../contexts/ExperienceContext';
import { ServiceKey } from '../lib/services';

const serviceLinks: { key: ServiceKey; labels: { en: string; es: string } }[] = [
  { key: 'ops', labels: { en: 'Business Operations', es: 'Operaciones Empresariales' } },
  { key: 'cc', labels: { en: 'Contact Center', es: 'Centro de Contacto' } },
  { key: 'it', labels: { en: 'IT Support', es: 'Soporte IT' } },
  { key: 'pro', labels: { en: 'Professionals', es: 'Profesionales' } }
];

const MobileDock = () => {
  const router = useRouter();
  const { language, toggleLanguage, theme, toggleTheme, openModal } = useExperience();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!panelRef.current) {
        return;
      }

      const target = event.target as Node;
      const servicesButton = document.getElementById('mobile-services-toggle');

      if (panelRef.current.contains(target)) {
        return;
      }

      if (servicesButton && servicesButton.contains(target)) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [language, theme]);

  const scrollToService = async (key: ServiceKey) => {
    const targetId = `service-${key}`;
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      if (element instanceof HTMLElement && typeof element.focus === 'function') {
        element.focus({ preventScroll: true });
      }

      return;
    }

    await router.push(`/#${targetId}`);
  };

  return (
    <div className="mobile-accordion-nav" aria-label="Mobile Navigation">
      <button type="button" className="mobile-accordion-btn" onClick={() => openModal('join')}>
        <i className="fa-solid fa-user-plus" aria-hidden="true" />
        <span className="mobile-label">{language === 'en' ? 'Join' : 'Unirse'}</span>
      </button>
      <button type="button" className="mobile-accordion-btn" onClick={() => openModal('contact')}>
        <i className="fa-solid fa-envelope" aria-hidden="true" />
        <span className="mobile-label">{language === 'en' ? 'Contact' : 'Contacto'}</span>
      </button>
      <button type="button" className="mobile-accordion-btn" onClick={() => openModal('chatbot')}>
        <i className="fa-solid fa-comments" aria-hidden="true" />
        <span className="mobile-label">Chattia</span>
      </button>
      <button
        type="button"
        id="mobile-services-toggle"
        className="mobile-accordion-btn"
        aria-expanded={open}
        aria-controls="mobile-panel-services"
        title={language === 'en' ? 'Services' : 'Servicios'}
        onClick={() => setOpen((value) => !value)}
      >
        <i className="fa-solid fa-cogs" aria-hidden="true" />
        <span className="visually-hidden">{language === 'en' ? 'Services menu' : 'Menú de servicios'}</span>
      </button>
      <div
        id="mobile-panel-services"
        ref={panelRef}
        className={`accordion-panel${open ? ' active' : ''}`}
      >
        {serviceLinks.map((item) => (
          <a
            key={item.key}
            href={`/#service-${item.key}`}
            onClick={async (event) => {
              event.preventDefault();
              await scrollToService(item.key);
              setOpen(false);
            }}
          >
            {item.labels[language]}
          </a>
        ))}
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setOpen(false);
          }}
        >
          <i className="fa-solid fa-house" aria-hidden="true" /> Home
        </button>
        <button
          type="button"
          onClick={() => {
            toggleLanguage();
            setOpen(false);
          }}
        >
          {language === 'en' ? 'ES' : 'EN'}
        </button>
        <button
          type="button"
          onClick={() => {
            toggleTheme();
            setOpen(false);
          }}
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </div>
  );
};

export default MobileDock;
