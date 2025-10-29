import type { AIService } from '../aiService';
import type { ChatMessage } from '../../types/chat';

const buildEscalationReply = (history: ChatMessage[], newMessage: string): string => {
  const lastUserMessage = newMessage.trim() || history.filter((msg) => msg.role === 'user').slice(-1)[0]?.text || '';
  return [
    "I captured your request so one of our OPS specialists can review it with the right compliance playbook.",
    'For tailored guidance, open the Contact form or schedule a consultation and we will pair you with a certified pod lead.',
    lastUserMessage
      ? `If this is urgent, include the note “${lastUserMessage.slice(0, 60)}${lastUserMessage.length > 60 ? '…' : ''}” in your message so we can fast-track it.`
      : undefined,
    'You can also explore the service cards below for immediate automations and readiness steps.'
  ]
    .filter(Boolean)
    .join(' ');
};

const streamChatResponse: AIService['streamChatResponse'] = async (
  history,
  newMessage,
  onChunk,
) => {
  onChunk(buildEscalationReply(history, newMessage));
};

const resetChat: AIService['resetChat'] = () => {
  // No persistent session to clear for the human escalation layer.
};

export { streamChatResponse, resetChat };
