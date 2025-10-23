import { useExperience } from '../contexts/ExperienceContext';

const fabLabels = {
  en: {
    join: 'Join',
    contact: 'Contact',
    chat: 'Chat'
  },
  es: {
    join: 'Unirse',
    contact: 'Contacto',
    chat: 'Chat'
  }
};

const FabStack = () => {
  const { language, openModal } = useExperience();
  const labels = fabLabels[language];

  return (
    <div className="fab-stack" aria-label="Quick actions">
      <button type="button" className="fab-btn" title={labels.join} onClick={() => openModal('join')}>
        <i className="fa-solid fa-user-plus" aria-hidden="true" />
        <span className="visually-hidden">{labels.join}</span>
      </button>
      <button type="button" className="fab-btn" title={labels.contact} onClick={() => openModal('contact')}>
        <i className="fa-solid fa-envelope" aria-hidden="true" />
        <span className="visually-hidden">{labels.contact}</span>
      </button>
      <button type="button" className="fab-btn" title={labels.chat} onClick={() => openModal('chatbot')}>
        <i className="fa-solid fa-comments" aria-hidden="true" />
        <span className="visually-hidden">{labels.chat}</span>
      </button>
    </div>
  );
};

export default FabStack;
