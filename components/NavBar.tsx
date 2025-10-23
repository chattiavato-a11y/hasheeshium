import { MouseEvent } from 'react';
import { useExperience } from '../contexts/ExperienceContext';
import { ServiceKey } from '../lib/services';

const navItems: { key: ServiceKey; labels: { en: string; es: string } }[] = [
  { key: 'ops', labels: { en: 'Business Operations', es: 'Operaciones Empresariales' } },
  { key: 'cc', labels: { en: 'Contact Center', es: 'Centro de Contacto' } },
  { key: 'it', labels: { en: 'IT Support', es: 'Soporte IT' } },
  { key: 'pro', labels: { en: 'Professionals', es: 'Profesionales' } }
];

const NavBar = () => {
  const { language, toggleLanguage, theme, toggleTheme } = useExperience();

  const handleNavClick = (key: ServiceKey) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const target = document.getElementById(`service-${key}`);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.focus({ preventScroll: true });
    }
  };

  return (
    <nav className="ops-nav" aria-label="OPS Navigation">
      <span className="ops-logo">OPS</span>
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
      <div className="toggles">
        <button type="button" className="toggle-btn" onClick={toggleLanguage}>
          {language === 'en' ? 'ES' : 'EN'}
        </button>
        <button type="button" className="toggle-btn" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
