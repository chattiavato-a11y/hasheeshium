import { useEffect, useState } from 'react';
import { useExperience } from '../contexts/ExperienceContext';

const storageKey = 'ops-cookie-consent';

const copy = {
  en: {
    message:
      'OPS Online Support uses cookies to secure sessions and measure experience quality. Approve analytics cookies to help us improve.',
    accept: 'Accept & continue',
    manage: 'Manage preferences'
  },
  es: {
    message:
      'OPS Online Support utiliza cookies para asegurar sesiones y medir la calidad de la experiencia. Apruebe las cookies analíticas para ayudarnos a mejorar.',
    accept: 'Aceptar y continuar',
    manage: 'Gestionar preferencias'
  }
};

const CookieConsent = () => {
  const { language, openModal } = useExperience();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(storageKey);
    setVisible(stored !== 'accepted');
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, 'accepted');
    }

    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  const labels = copy[language];

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label={labels.message}>
      <p>{labels.message}</p>
      <div className="cookie-actions">
        <button type="button" className="cookie-btn primary" onClick={handleAccept}>
          {labels.accept}
        </button>
        <button
          type="button"
          className="cookie-btn"
          onClick={() => {
            openModal('cookies');
          }}
        >
          {labels.manage}
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
