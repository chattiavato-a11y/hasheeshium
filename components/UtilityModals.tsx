import { useExperience } from '../contexts/ExperienceContext';
import ChatbotModal from './ChatbotModal';
import ContactModal from './ContactModal';
import JoinModal from './JoinModal';
import PolicyModal from './PolicyModal';

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

  if (activeModal === 'terms' || activeModal === 'cookies' || activeModal === 'policy') {
    return <PolicyModal variant={activeModal} onClose={closeModal} />;
  }

  return null;
};

export default UtilityModals;
