/**
 * TinyML/LLM/AI Service Stack (7-Layer Architecture)
 *
 * This is the main entry point for the security-first, on-device/edge AI stack.
 * It follows the defined 7-layer architecture, starting with the router.
 */
import type { ChatMessage, AIProgress } from '../../../types/chat';
import type { AIService } from '../../aiService';
import { routeMessage } from './router';

let sessionHistory: ChatMessage[] = [];

const streamChatResponse: AIService['streamChatResponse'] = async (
  history: ChatMessage[],
  newMessage: string,
  onChunk: (chunk: string) => void,
  onProgress?: (progress: AIProgress) => void,
) => {
  sessionHistory = history;
  const userMessage: ChatMessage = { role: 'user', text: newMessage };

  await routeMessage(userMessage, sessionHistory, onChunk, onProgress);
};

const resetChat: AIService['resetChat'] = () => {
  sessionHistory = [];
  console.log('TinyML session reset.');
};

export { streamChatResponse, resetChat };
