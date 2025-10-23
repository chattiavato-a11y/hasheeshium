import { FormEvent, useEffect, useRef, useState } from 'react';
import { Language } from '../contexts/ExperienceContext';
import useDraggable from '../hooks/useDraggable';

interface ContactModalProps {
  language: Language;
  onClose: () => void;
}

const copy = {
  en: {
    title: 'Contact Us',
    intro: 'Tell us about the service you are interested in and an OPS specialist will connect shortly.',
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
          <div className="modal-content-body">
            <p className="modal-success">{labels.successTitle}</p>
            <p>{labels.successBody}</p>
            <div className="modal-actions">
              <button type="button" className="modal-btn cta" onClick={onClose}>
                OK
              </button>
            </div>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <p className="modal-content-body">{labels.intro}</p>
            <label className="modal-field">
              <span>{labels.name}</span>
              <input type="text" name="name" required />
            </label>
            <label className="modal-field">
              <span>{labels.email}</span>
              <input type="email" name="email" required />
            </label>
            <label className="modal-field">
              <span>{labels.comments}</span>
              <textarea name="comments" rows={3} required />
            </label>
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
