import { FormEvent, useEffect, useRef, useState } from 'react';
import { Language } from '../contexts/ExperienceContext';
import useDraggable from '../hooks/useDraggable';

interface JoinModalProps {
  language: Language;
  onClose: () => void;
}

const copy = {
  en: {
    title: 'Join Us',
    intro: 'Share your details and we will align you with current OPS opportunities.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    about: 'Tell us about yourself',
    submit: 'Submit',
    cancel: 'Cancel',
    successTitle: 'Profile submitted',
    successBody: 'Thanks for introducing yourself. Our talent team will reach out soon.'
  },
  es: {
    title: 'Únete a Nosotros',
    intro: 'Comparte tus datos y te alinearemos con las oportunidades actuales de OPS.',
    name: 'Nombre',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    about: 'Cuéntanos sobre ti',
    submit: 'Enviar',
    cancel: 'Cancelar',
    successTitle: 'Perfil enviado',
    successBody: 'Gracias por presentarte. Nuestro equipo de talento se comunicará pronto.'
  }
};

const JoinModal = ({ language, onClose }: JoinModalProps) => {
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
        aria-labelledby="join-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header" ref={headerRef}>
          <h3 id="join-modal-title">{labels.title}</h3>
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
              <span>{labels.phone}</span>
              <input type="tel" name="phone" required />
            </label>
            <label className="modal-field">
              <span>{labels.about}</span>
              <textarea name="about" rows={4} />
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

export default JoinModal;
