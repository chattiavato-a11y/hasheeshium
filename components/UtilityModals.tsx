import { useExperience } from '../contexts/ExperienceContext';
import ChatbotModal from './ChatbotModal';
import ContactModal from './ContactModal';
import JoinModal from './JoinModal';

const UtilityModals = () => {
  const { activeModal, closeModal, language } = useExperience();

  if (activeModal === 'contact') {
    return <ContactModal language={language} onClose={closeModal} />;
  }

  if (activeModal === 'join') {
    return <JoinModal language={language} onClose={closeModal} />;
  }

  if (activeModal === 'chatbot') {
    return <ChatbotModal />;
  }

  return null;
};

export default UtilityModals;
