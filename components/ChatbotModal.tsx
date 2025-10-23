import { FormEvent, useEffect, useRef, useState } from 'react';
import { useExperience } from '../contexts/ExperienceContext';
import useDraggable from '../hooks/useDraggable';

interface ChatMessage {
  id: number;
  from: 'user' | 'bot';
  text: string;
}

const copy = {
  en: {
    title: 'OPS AI Chatbot',
    placeholder: 'Type your message…',
    empty: 'Share a question to start the conversation.',
    send: 'Send',
    theme: { light: 'Dark', dark: 'Light' },
    language: 'ES',
    human: 'I am human'
  },
  es: {
    title: 'Chatbot OPS AI',
    placeholder: 'Escribe tu mensaje…',
    empty: 'Comparte una pregunta para iniciar la conversación.',
    send: 'Enviar',
    theme: { light: 'Oscuro', dark: 'Claro' },
    language: 'EN',
    human: 'Soy humano'
  }
};

const replies = {
  en: [
    'I logged your request. An OPS specialist will follow up shortly.',
    'OPS pods operate 24/7 with NIST and PCI-aligned guardrails.',
    'Explore our service cards for more detail on each practice.'
  ],
  es: [
    'Registré tu solicitud. Un especialista OPS te contactará pronto.',
    'Los pods OPS operan 24/7 con controles alineados a NIST y PCI.',
    'Explora nuestras tarjetas de servicio para más detalle de cada práctica.'
  ]
};

let messageCounter = 0;

const ChatbotModal = () => {
  const { language, toggleLanguage, theme, toggleTheme, closeModal } = useExperience();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [verified, setVerified] = useState(false);
  const [pending, setPending] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const labels = copy[language];

  useEffect(() => {
    messageCounter = 0;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  useDraggable(containerRef, headerRef);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || pending || !verified) {
      return;
    }

    const text = input.trim();
    const userMessage: ChatMessage = { id: ++messageCounter, from: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setPending(true);

    setTimeout(() => {
      const options = replies[language];
      const reply = options[messageCounter % options.length];
      setMessages((prev) => [...prev, { id: ++messageCounter, from: 'bot', text: reply }]);
      setPending(false);
    }, 700);
  };

  return (
    <div id="chatbot-modal-backdrop" role="presentation" onClick={closeModal}>
      <div
        id="chatbot-container"
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatbot-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div id="chatbot-header" ref={headerRef}>
          <span id="chatbot-title">{labels.title}</span>
          <span>
            <button type="button" className="ctrl" onClick={toggleLanguage}>
              {labels.language}
            </button>
            &nbsp;|&nbsp;
            <button type="button" className="ctrl" onClick={toggleTheme}>
              {labels.theme[theme]}
            </button>
            <button type="button" id="chatbot-x" aria-label="Close" onClick={closeModal}>
              ×
            </button>
          </span>
        </div>
        <div id="chat-log" ref={logRef} aria-live="polite">
          {messages.length === 0 ? <p className="chatbot-empty">{labels.empty}</p> : null}
          {messages.map((message) => (
            <p key={message.id} className={`chat-msg ${message.from}`}>
              {message.text}
            </p>
          ))}
        </div>
        <div id="chatbot-form-container">
          <form id="chatbot-input-row" onSubmit={handleSubmit}>
            <input
              id="chatbot-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={labels.placeholder}
              aria-label={labels.placeholder}
            />
            <button
              id="chatbot-send"
              type="submit"
              disabled={!verified || pending}
              aria-label={labels.send}
            >
              {pending ? '…' : <i className="fa-solid fa-paper-plane" aria-hidden="true" />}
            </button>
          </form>
          <label className="human-check">
            <input
              type="checkbox"
              checked={verified}
              onChange={(event) => setVerified(event.target.checked)}
            />
            <span>{labels.human}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
