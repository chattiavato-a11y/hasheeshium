import { useEffect, useRef } from 'react';
import { useExperience } from '../contexts/ExperienceContext';
import { ServiceSummary } from '../lib/services';
import useDraggable from '../hooks/useDraggable';

interface ServiceModalProps {
  service: ServiceSummary;
  onClose: () => void;
}

const labels = {
  en: {
    learn: 'Learn More',
    ask: 'Ask Chattia',
    contact: 'Contact Us',
    join: 'Join the OPS guild',
    cancel: 'Cancel',
    close: 'Close',
    compliance: 'Aligned to NIST CSF, CISA, PCI DSS 4.0'
  },
  es: {
    learn: 'Más información',
    ask: 'Preguntar Chattia',
    contact: 'Contáctanos',
    join: 'Únete al gremio OPS',
    cancel: 'Cancelar',
    close: 'Cerrar',
    compliance: 'Alineado a NIST CSF, CISA y PCI DSS 4.0'
  }
};

const ServiceModal = ({ service, onClose }: ServiceModalProps) => {
  const { language, openModal } = useExperience();
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const copy = labels[language];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useDraggable(modalRef, headerRef);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        ref={modalRef}
        className="ops-modal service-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${service.key}-modal-title`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-x" aria-label={copy.close} onClick={onClose}>
          ×
        </button>
        <header className="modal-header" ref={headerRef}>
          <img className="modal-img" src={service.modal.image} alt={service.modal.imageAlt[language]} />
          <div className="modal-header-copy">
            <span className="modal-badge">{service.badge[language]}</span>
            <div className="modal-title" id={`${service.key}-modal-title`}>
              {service.modal.title[language]}
            </div>
            <p className="modal-spotlight">{service.spotlight[language]}</p>
            <p className="modal-description">{service.description[language]}</p>
          </div>
        </header>
        <div className="modal-body">
          <div className="modal-content-body">{service.modal.content[language]}</div>
          <div className="modal-video">
            <strong>{language === 'en' ? 'Experience burst' : 'Explosión experiencial'}</strong>
            <p>{service.modal.video[language]}</p>
          </div>
          <ul className="modal-feature-list">
            {service.modal.features[language].map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <div className="modal-footnotes">
            <span className="modal-footnote-accent">OPS CySec Core</span>
            <span>{copy.compliance}</span>
          </div>
        </div>
        <div className="modal-actions">
          <a className="modal-btn" href={service.modal.learnHref} target="_blank" rel="noreferrer">
            {copy.learn}
          </a>
          <button
            type="button"
            className="modal-btn"
            onClick={() => {
              openModal('chatbot');
              onClose();
            }}
          >
            {copy.ask}
          </button>
          <button
            type="button"
            className="modal-btn"
            onClick={() => {
              openModal('join');
              onClose();
            }}
          >
            {copy.join}
          </button>
          <button
            type="button"
            className="modal-btn cta"
            onClick={() => {
              openModal('contact');
              onClose();
            }}
          >
            {copy.contact}
          </button>
          <button type="button" className="modal-btn" onClick={onClose}>
            {copy.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
