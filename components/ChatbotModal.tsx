import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { useExperience } from '../contexts/ExperienceContext';
import { services } from '../lib/services';
import { useMovable } from '../hooks/useMovable';
import ModalWrapper from './ModalWrapper';
import { streamChatResponse, resetChat, ACTIVE_STACK } from '../services/ai/aiService';
import type { ChatMessage, AIProgress } from '../types/chat';

const CHAT_HISTORY_KEY = 'ops-chat-history';

type StackName = 'tinyml' | 'cloudflare';

const copy = {
  en: {
    title: 'Chattia Assistant',
    subtitle: 'Secured OPS AI',
    placeholder: 'Type your message…',
    empty: 'Share a question to start the conversation.',
    send: 'Send',
    theme: { light: 'Dark', dark: 'Light' },
    language: 'ES',
    welcome:
      "Hello! I'm Chattia, your OPS assistant. Ask about Business Operations, Contact Center, IT Support, or our Professionals guild.",
    clear: 'Reset',
    clearConfirm: 'Conversation reset. Ask the next question!',
    ready: 'Ready to assist. Ask about services, pricing, or onboarding.',
    thinking: 'Synthesizing a response…',
    initializing: 'Preparing secure local models…',
    stack: {
      tinyml: 'Powered by OPS TinyML stack',
      cloudflare: 'Powered by Cloudflare Workers AI',
    } satisfies Record<StackName, string>,
    contactHint: 'Need a specialist? Open the Contact modal and we will align a pod lead.',
  },
  es: {
    title: 'Asistente Chattia',
    subtitle: 'OPS IA segura',
    placeholder: 'Escribe tu mensaje…',
    empty: 'Comparte una pregunta para iniciar la conversación.',
    send: 'Enviar',
    theme: { light: 'Oscuro', dark: 'Claro' },
    language: 'EN',
    welcome:
      '¡Hola! Soy Chattia, tu asistente OPS. Pregunta sobre Operaciones, Centro de Contacto, Soporte IT o nuestro gremio de Profesionales.',
    clear: 'Reiniciar',
    clearConfirm: 'Conversación reiniciada. ¡Haz la siguiente pregunta!',
    ready: 'Lista para ayudar. Consulta sobre servicios, precios u onboarding.',
    thinking: 'Sintetizando una respuesta…',
    initializing: 'Preparando modelos locales seguros…',
    stack: {
      tinyml: 'Impulsado por la pila TinyML de OPS',
      cloudflare: 'Impulsado por Cloudflare Workers AI',
    } satisfies Record<StackName, string>,
    contactHint: '¿Necesitas un especialista? Abre el formulario de Contacto y alinearemos un líder de pod.',
  },
};

const fallbackReplies = {
  en: [
    'I logged your request so an OPS pod can review it against our compliance playbooks.',
    'Explore the service cards for automation runbooks or tap Contact to schedule a consultation.',
    'OPS pods blend cleared talent with adaptive AI copilots to stay aligned with NIST, CISA, and PCI controls.',
  ],
  es: [
    'Registré tu solicitud para que un pod OPS la revise con nuestros playbooks de cumplimiento.',
    'Explora las tarjetas de servicio para ver los planos de automatización o abre Contacto para agendar una consulta.',
    'Los pods OPS combinan talento acreditado con copilotos IA adaptativos siguiendo controles NIST, CISA y PCI.',
  ],
};

const stackDisplayName = (language: 'en' | 'es', stack: StackName) => copy[language].stack[stack];

const buildInitialMessage = (language: 'en' | 'es'): ChatMessage => ({
  role: 'bot',
  text: copy[language].welcome,
});

const filterHistory = (messages: ChatMessage[]) => messages.filter((message) => !message.isLoading);

const renderStructuredContent = (text: string): ReactElement[] => {
  const lines = text.split(/\r?\n/);
  const nodes: ReactElement[] = [];
  let list: string[] = [];

  const pushList = () => {
    if (list.length > 0) {
      nodes.push(
        <ul key={`list-${nodes.length}`}>
          {list.map((item, index) => (
            <li key={`item-${index}`}>{item}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('* ')) {
      list.push(trimmed.slice(2));
    } else if (trimmed.length === 0) {
      pushList();
    } else {
      pushList();
      nodes.push(
        <p key={`paragraph-${index}`}>
          {trimmed}
        </p>,
      );
    }
  });

  pushList();

  return nodes.length > 0 ? nodes : [<p key="fallback">{text}</p>];
};

const ChatbotModal = () => {
  const { language, toggleLanguage, theme, toggleTheme, closeModal, openModal } = useExperience();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [buildInitialMessage(language)]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<AIProgress | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialLanguageRef = useRef(language);
  const stackName = useMemo(() => stackDisplayName(language, ACTIVE_STACK as StackName), [language]);

  useMovable(modalRef, headerRef, resizeHandleRef);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = window.localStorage.getItem(CHAT_HISTORY_KEY);
      if (stored) {
        const parsed: ChatMessage[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (error) {
      console.warn('Unable to load stored chat history:', error);
    }

    setMessages([buildInitialMessage(initialLanguageRef.current)]);
  }, []);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0]?.role === 'bot') {
        return [buildInitialMessage(language)];
      }
      return prev;
    });
  }, [language]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const historyToPersist = filterHistory(messages);
    if (historyToPersist.length > 0) {
      window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(historyToPersist));
    } else {
      window.localStorage.removeItem(CHAT_HISTORY_KEY);
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [language]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => () => {
    resetChat();
  }, []);

  const labels = copy[language];

  const serviceIndex = useMemo(() => {
    return services.map((service) => {
      const tokens = [
        service.title[language],
        service.description[language],
        service.spotlight[language],
        ...service.modal.features[language],
      ]
        .join(' ')
        .toLowerCase();

      return { service, tokens };
    });
  }, [language]);

  const getFallbackReply = useCallback(
    (historyLength: number) => {
      const options = fallbackReplies[language];
      return options[historyLength % options.length];
    },
    [language],
  );

  const buildServiceReply = useCallback(
    (entry: (typeof serviceIndex)[number]) => {
      const { service } = entry;
      const highlight = service.modal.features[language].slice(0, 2).join(' • ');
      return `${service.title[language]} — ${service.spotlight[language]} ${highlight}. ${
        language === 'en'
          ? 'Open the service modal for automation blueprints or tap Contact for an OPS concierge.'
          : 'Abre el modal de servicio para planos de automatización o pulsa Contacto para un concierge OPS.'
      }`;
    },
    [language],
  );

  const handleProgress = (update: AIProgress) => {
    setProgress(update);
    if (update.status === 'ready') {
      setStatus(labels.ready);
    }
  };

  const handleClear = () => {
    setMessages([buildInitialMessage(language)]);
    setProgress(null);
    setStatus(labels.clearConfirm);
    setIsLoading(false);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CHAT_HISTORY_KEY);
    }
    resetChat();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userMessage: ChatMessage = { role: 'user', text: trimmed };
    const history = [...filterHistory(messages), userMessage];

    setMessages((prev) => [...prev, userMessage, { role: 'bot', text: '', isLoading: true }]);
    setInput('');
    setIsLoading(true);
    setProgress(null);
    setStatus('');

    try {
      await streamChatResponse(history, trimmed, (chunk) => {
        setMessages((prev) => {
          const next = [...prev];
          const lastIndex = next.length - 1;
          if (next[lastIndex] && next[lastIndex].role === 'bot') {
            next[lastIndex] = { ...next[lastIndex], text: chunk, isLoading: true };
          }
          return next;
        });
      }, handleProgress);
      setMessages((prev) => {
        const next = [...prev];
        const lastIndex = next.length - 1;
        if (next[lastIndex] && next[lastIndex].role === 'bot' && !next[lastIndex].text) {
          next[lastIndex] = {
            role: 'bot',
            text: getFallbackReply(history.length),
            isLoading: true,
          };
        }
        return next;
      });
    } catch (error) {
      console.error('Chat service error:', error);
      setMessages((prev) => {
        const next = [...prev];
        const lastIndex = next.length - 1;
        if (next[lastIndex] && next[lastIndex].role === 'bot') {
          next[lastIndex] = {
            role: 'bot',
            text:
              language === 'en'
                ? 'I encountered an issue processing that request. Please try again or contact an OPS specialist.'
                : 'Encontré un problema procesando tu solicitud. Intenta de nuevo o contacta a un especialista OPS.',
          };
        }
        return next;
      });
      setProgress({ status: 'error', message: language === 'en' ? 'Service unavailable.' : 'Servicio no disponible.' });
    } finally {
      setIsLoading(false);
      setMessages((prev) => {
        const next = [...prev];
        const lastIndex = next.length - 1;
        if (next[lastIndex] && next[lastIndex].role === 'bot') {
          next[lastIndex] = { ...next[lastIndex], isLoading: false };
        }
        return next;
      });
      setProgress((prev) => {
        if (!prev) {
          return null;
        }
        if (prev.status === 'error') {
          return prev;
        }
        if (prev.status === 'loading' || prev.status === 'initializing' || prev.status === 'fetching') {
          return null;
        }
        return prev;
      });
    }
  };

  const statusMessage = useMemo(() => {
    if (progress?.message) {
      return progress.message;
    }
    if (status) {
      return status;
    }
    return isLoading ? labels.thinking : labels.ready;
  }, [labels.ready, labels.thinking, progress, status, isLoading]);

  const handleServiceQuickLink = () => {
    openModal('contact');
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isTyping = message.isLoading && !message.text;

    return (
      <p key={`${message.role}-${index}`} className={`chat-msg ${message.role}${isTyping ? ' typing' : ''}`}>
        {isTyping ? (
          <span className="typing-dot">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <div className="markdown-content">{renderStructuredContent(message.text)}</div>
        )}
      </p>
    );
  };

  const quickReply = useMemo(() => {
    const tokens = input
      .toLowerCase()
      .split(/[^a-záéíóúñü0-9]+/i)
      .filter((token) => token.length > 2);

    if (tokens.length === 0) {
      return null;
    }

    let bestMatch: (typeof serviceIndex)[number] | null = null;
    let bestScore = 0;

    for (const entry of serviceIndex) {
      let score = 0;
      for (const token of tokens) {
        if (entry.tokens.includes(token)) {
          score += 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && bestScore > 1) {
      return buildServiceReply(bestMatch);
    }

    return getFallbackReply(messages.length + tokens.length);
  }, [input, serviceIndex, buildServiceReply, getFallbackReply, messages.length]);

  return (
    <ModalWrapper
      isOpen
      onClose={closeModal}
      showBackdrop={false}
      modalClassName="chatbot-modal-floating"
      backdropClassName="chatbot-modal-pass-through"
    >
      <div id="chatbot-container" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="chatbot-title">
        <div id="chatbot-header" ref={headerRef}>
          <div>
            <span id="chatbot-title">{labels.title}</span>
            <div className="chatbot-subtitle" aria-live="polite">
              {labels.subtitle} · {stackName}
            </div>
          </div>
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
          {messages.map(renderMessage)}
        </div>
        <div className="chatbot-status" role="status">
          {statusMessage}
          {progress?.progress !== undefined ? (
            <span className="chatbot-progress" aria-hidden="true">
              <span style={{ width: `${Math.round(progress.progress * 100)}%` }} />
            </span>
          ) : null}
        </div>
        <div id="chatbot-form-container">
          <form id="chatbot-input-row" onSubmit={handleSubmit}>
            <input
              id="chatbot-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={labels.placeholder}
              aria-label={labels.placeholder}
              disabled={isLoading}
            />
            <button id="chatbot-send" type="submit" disabled={!input.trim() || isLoading} aria-label={labels.send}>
              {isLoading ? '…' : <i className="fa-solid fa-paper-plane" aria-hidden="true" />}
            </button>
          </form>
          {quickReply ? (
            <button type="button" className="chatbot-quick" onClick={handleServiceQuickLink}>
              {quickReply}
            </button>
          ) : null}
        </div>
        <div className="chatbot-footnote">{labels.contactHint}</div>
        <div id="chatbot-resize-handle" ref={resizeHandleRef} aria-hidden="true">
          <i className="fa-solid fa-up-right-and-down-left-from-center" aria-hidden="true" />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ChatbotModal;
