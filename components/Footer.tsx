import { useExperience } from '../contexts/ExperienceContext';

const Footer = () => {
  const { language, openModal } = useExperience();

  return (
    <footer className="site-footer">
      <div className="footer-meta">© 2025 OPS Online Support</div>
      <nav className="footer-links" aria-label={language === 'en' ? 'Site policies' : 'Políticas del sitio'}>
        <button type="button" className="footer-link" onClick={() => openModal('terms')}>
          {language === 'en' ? 'Terms & Conditions' : 'Términos y Condiciones'}
        </button>
        <button type="button" className="footer-link" onClick={() => openModal('cookies')}>
          {language === 'en' ? 'Cookies Consent' : 'Consentimiento de Cookies'}
        </button>
        <button type="button" className="footer-link" onClick={() => openModal('policy')}>
          {language === 'en' ? 'Website Policy' : 'Política del Sitio Web'}
        </button>
      </nav>
    </footer>
  );
};

export default Footer;
