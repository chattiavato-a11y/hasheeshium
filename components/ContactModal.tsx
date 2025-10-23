import { FormEvent, useEffect, useRef, useState } from 'react';
import { Language, useExperience } from '../contexts/ExperienceContext';
import useDraggable from '../hooks/useDraggable';

interface ContactModalProps {
  language: Language;
  onClose: () => void;
}

const copy = {
  en: {
    title: 'Contact Us',
    intro: 'Tell us about the service you are interested in and an OPS specialist will connect shortly.',
    commitments: [
      'Requests are sanitized, encrypted, and logged for compliance.',
      'Critical alerts route to 24/7 cyber responders.',
      'Chattia can co-pilot live during your engagement.'
    ],
    urgency: 'Priority',
    priorities: ['Standard (24h)', 'Fast-track (4h)', 'Critical (60 min)'],
    name: 'Name',
    email: 'Email',
    comments: 'Comments',
    submit: 'Send',
    cancel: 'Cancel',
    successTitle: 'Request sent',
    successBody: 'Thanks for contacting OPS. We will reply within one business day.'
  },
  es: {
    title: 'Contáctenos',
    intro: 'Cuéntenos en qué servicio está interesado y un especialista OPS se comunicará pronto.',
    commitments: [
      'Las solicitudes se sanitizan, cifran y registran para cumplimiento.',
      'Alertas críticas se enrutan a respondedores cibernéticos 24/7.',
      'Chattia puede copilotar en vivo durante la interacción.'
    ],
    urgency: 'Prioridad',
    priorities: ['Estándar (24h)', 'Prioritario (4h)', 'Crítico (60 min)'],
    name: 'Nombre',
    email: 'Correo electrónico',
    comments: 'Comentarios',
    submit: 'Enviar',
    cancel: 'Cancelar',
    successTitle: 'Solicitud enviada',
    successBody: 'Gracias por contactar a OPS. Responderemos en un día hábil.'
  }
};

const ContactModal = ({ language, onClose }: ContactModalProps) => {
  const { openModal } = useExperience();
  const labels = copy[language];
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header" ref={headerRef}>
          <h3 id="contact-modal-title">{labels.title}</h3>
          <button type="button" className="close-modal" aria-label={labels.cancel} onClick={onClose}>
            ×
          </button>
        </div>
        {submitted ? (
          <div className="modal-success-panel">
            <div className="modal-success-icon" aria-hidden="true">
              <i className="fa-solid fa-circle-check" />
            </div>
            <p className="modal-success">{labels.successTitle}</p>
            <p>{labels.successBody}</p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn"
                onClick={() => {
                  onClose();
                  openModal('chatbot');
                }}
              >
                {language === 'en' ? 'Chat with Chattia' : 'Hablar con Chattia'}
              </button>
              <button type="button" className="modal-btn cta" onClick={onClose}>
                OK
              </button>
            </div>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <p className="modal-content-body">{labels.intro}</p>
            <ul className="modal-checklist">
              {labels.commitments.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="modal-grid">
              <label className="modal-field">
                <span>{labels.name}</span>
                <input type="text" name="name" required />
              </label>
              <label className="modal-field">
                <span>{labels.email}</span>
                <input type="email" name="email" required />
              </label>
            </div>
            <label className="modal-field">
              <span>{labels.comments}</span>
              <textarea name="comments" rows={4} required />
            </label>
            <fieldset className="modal-fieldset">
              <legend>{labels.urgency}</legend>
              <div className="modal-radio-group">
                {labels.priorities.map((priority) => (
                  <label key={priority}>
                    <input type="radio" name="priority" value={priority} defaultChecked={priority === labels.priorities[0]} />
                    <span>{priority}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="modal-actions">
              <button type="button" className="modal-btn" onClick={onClose}>
                {labels.cancel}
              </button>
              <button type="submit" className="modal-btn cta">
                {labels.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
