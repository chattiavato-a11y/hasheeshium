import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useExperience } from '../contexts/ExperienceContext';
import { services } from '../lib/services';
import useDraggable from '../hooks/useDraggable';

interface ChatMessage {
  id: number;
  from: 'user' | 'bot' | 'system';
  text: string;
  typing?: boolean;
}

const copy = {
  en: {
    title: 'OPS AI Chatbot',
    placeholder: 'Type your message…',
    empty: 'Share a question to start the conversation.',
    send: 'Send',
    theme: { light: 'Dark', dark: 'Light' },
    language: 'ES',
    human: 'I am human',
    welcome: 'Welcome to Chattia — OPS AI copilots every interaction with compliance guardrails.',
    clear: 'Reset',
    verify: 'Check the human box to engage Chattia.',
    ready: 'Ready to assist. Ask about services, pricing, or onboarding.',
    thinking: 'Chattia is synthesizing a response…',
    restored: 'Conversation cleared.',
    clearConfirm: 'Conversation reset. Ask the next question!'
  },
  es: {
    title: 'Chatbot OPS AI',
    placeholder: 'Escribe tu mensaje…',
    empty: 'Comparte una pregunta para iniciar la conversación.',
    send: 'Enviar',
    theme: { light: 'Oscuro', dark: 'Claro' },
    language: 'EN',
    human: 'Soy humano',
    welcome: 'Bienvenido a Chattia — OPS AI copilota cada interacción con salvaguardas de cumplimiento.',
    clear: 'Reiniciar',
    verify: 'Marca la casilla humana para hablar con Chattia.',
    ready: 'Lista para ayudar. Pregunta sobre servicios, precios u onboarding.',
    thinking: 'Chattia está sintetizando una respuesta…',
    restored: 'Conversación reiniciada.',
    clearConfirm: 'Conversación reiniciada. ¡Haz la siguiente pregunta!'
  }
};

const replies = {
  en: [
    'I logged your request and routed it to the correct OPS pod. A specialist will align within SLA windows.',
    'OPS pods blend human talent with AI copilots while honoring NIST, CISA, and PCI DSS controls.',
    'Explore the service cards for deeper playbooks or open the Contact form for a guided consultation.'
  ],
  es: [
    'Registré tu solicitud y la envié al pod OPS correcto. Un especialista responderá dentro del SLA.',
    'Los pods OPS combinan talento humano con copilotos IA respetando controles NIST, CISA y PCI DSS.',
    'Explora las tarjetas de servicio para playbooks detallados o abre el formulario de Contacto para una consulta guiada.'
  ]
};

const storageKey = 'ops-chattia-history';

const ChatbotModal = () => {
  const { language, toggleLanguage, theme, toggleTheme, closeModal } = useExperience();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [verified, setVerified] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const labels = copy[language];
  const initialWelcomeRef = useRef(labels.welcome);

  const serviceIndex = useMemo(() => {
    return services.map((service) => {
      const tokens = [
        service.title[language],
        service.description[language],
        service.spotlight[language],
        ...service.modal.features[language]
      ]
        .join(' ')
        .toLowerCase();

      return { service, tokens };
    });
  }, [language]);

  const nextId = () => {
    idRef.current += 1;
    return idRef.current;
  };

  const bootstrapConversation = (welcomeCopy: string) => {
    idRef.current = 1;
    const welcomeMessage: ChatMessage = { id: 1, from: 'system', text: welcomeCopy };
    setMessages([welcomeMessage]);
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      bootstrapConversation(initialWelcomeRef.current);
      return;
    }

    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed: ChatMessage[] = JSON.parse(stored);
        setMessages(parsed);
        idRef.current = parsed.reduce((max, item) => Math.max(max, item.id), 0);
      } else {
        bootstrapConversation(initialWelcomeRef.current);
      }
    } catch {
      bootstrapConversation(initialWelcomeRef.current);
    }
  }, []);

  useEffect(() => {
    initialWelcomeRef.current = labels.welcome;
    setMessages((prev) => {
      if (prev.length === 1 && prev[0]?.from === 'system') {
        return [{ ...prev[0], text: labels.welcome }];
      }

      return prev;
    });
  }, [labels.welcome]);

  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      window.localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages]);

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

  useEffect(() => {
    if (!verified) {
      setStatus(labels.verify);
    } else if (!pending) {
      setStatus(labels.ready);
    }
  }, [verified, pending, labels.verify, labels.ready]);

  useDraggable(containerRef, headerRef);

  const buildServiceReply = (entry: (typeof serviceIndex)[number]) => {
    const { service } = entry;
    const highlight = service.modal.features[language].slice(0, 2).join(' • ');
    return `${service.title[language]} — ${service.spotlight[language]} ${highlight}. ${
      language === 'en'
        ? 'Open the service modal for automation blueprints or tap Contact for an OPS concierge.'
        : 'Abre el modal de servicio para planos de automatización o pulsa Contacto para un concierge OPS.'
    }`;
  };

  const handleClear = () => {
    bootstrapConversation(labels.welcome);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
    }
    setStatus(labels.clearConfirm);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || pending || !verified) {
      return;
    }

    const text = input.trim();
    const userMessage: ChatMessage = { id: nextId(), from: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setPending(true);
    setStatus(labels.thinking);

    const queryTokens = text
      .toLowerCase()
      .split(/[^a-záéíóúñü0-9]+/i)
      .filter((token) => token.length > 2);

    let bestMatch: (typeof serviceIndex)[number] | null = null;
    let bestScore = 0;

    for (const entry of serviceIndex) {
      let score = 0;
      for (const token of queryTokens) {
        if (entry.tokens.includes(token)) {
          score += 1;
        }
      }

      if (score > bestScore) {
        bestMatch = entry;
        bestScore = score;
      }
    }

    const fallback = replies[language];
    const fallbackReply = fallback[(userMessage.id + fallback.length) % fallback.length];
    const response = bestMatch && bestScore > 1 ? buildServiceReply(bestMatch) : fallbackReply;

    const botId = nextId();
    const placeholder: ChatMessage = { id: botId, from: 'bot', text: '', typing: true };
    setMessages((prev) => [...prev, placeholder]);

    const charactersPerTick = 8;
    let currentLength = 0;

    const streamChunk = () => {
      currentLength += Math.max(3, Math.round(Math.random() * charactersPerTick));
      setMessages((prev) =>
        prev.map((message) =>
          message.id === botId
            ? {
                ...message,
                text: response.slice(0, currentLength),
                typing: currentLength < response.length
              }
            : message
        )
      );

      if (currentLength < response.length) {
        window.setTimeout(streamChunk, 45 + Math.random() * 80);
      } else {
        setPending(false);
        setStatus(labels.ready);
      }
    };

    window.setTimeout(streamChunk, 120);
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
            <button type="button" className="ctrl" onClick={handleClear}>
              {labels.clear}
            </button>
            &nbsp;|&nbsp;
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
            <p key={message.id} className={`chat-msg ${message.from}${message.typing ? ' typing' : ''}`}>
              {message.typing ? (
                <span className="typing-dot">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                message.text
              )}
            </p>
          ))}
        </div>
        <div id="chatbot-form-container">
          <div className="chatbot-status" role="status">
            {status || (messages.length === 0 ? labels.empty : labels.ready)}
          </div>
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
