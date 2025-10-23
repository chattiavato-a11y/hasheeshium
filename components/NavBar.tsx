import { MouseEvent } from 'react';
import { useExperience } from '../contexts/ExperienceContext';
import { ServiceKey } from '../lib/services';

const navItems: { key: ServiceKey; labels: { en: string; es: string } }[] = [
  { key: 'ops', labels: { en: 'Operations', es: 'Gestión' } },
  { key: 'cc', labels: { en: 'Contact Center', es: 'Centro de Contacto' } },
  { key: 'it', labels: { en: 'IT Support', es: 'Soporte IT' } },
  { key: 'pro', labels: { en: 'Professionals', es: 'Profesionales' } }
];

const NavBar = () => {
  const { language, toggleLanguage, theme, toggleTheme, openModal } = useExperience();

  const handleNavClick = (key: ServiceKey) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const target = document.getElementById(`service-${key}`);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.focus({ preventScroll: true });
    }
  };

  return (
    <header className="nav-shell">
      <nav className="ops-nav" aria-label="OPS Navigation">
        <div className="nav-brand">
          <span className="ops-logo">OPS</span>
          <span className="nav-subtitle">{language === 'en' ? 'Online Support' : 'Soporte en Línea'}</span>
        </div>
        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item.key}
              className="nav-link"
              href={`#service-${item.key}`}
              onClick={handleNavClick(item.key)}
            >
              {item.labels[language]}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button type="button" className="toggle-pill" onClick={toggleLanguage}>
            <i className="fa-solid fa-language" aria-hidden="true" />
            <span>{language === 'en' ? 'ES' : 'EN'}</span>
          </button>
          <button type="button" className="toggle-pill" onClick={toggleTheme}>
            <i className={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} aria-hidden="true" />
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
          <button type="button" className="nav-cta" onClick={() => openModal('chatbot')}>
            <i className="fa-solid fa-sparkles" aria-hidden="true" />
            <span>{language === 'en' ? 'Meet Chattia' : 'Conoce Chattia'}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
