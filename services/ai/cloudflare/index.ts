/**
 * Cloudflare AI Service (Workers AI) - Placeholder
 *
 * This file is a placeholder to demonstrate how to integrate with Cloudflare's
 * serverless AI platform. You would typically deploy a Cloudflare Worker that
 * proxies requests to their models and call it from here.
 */
import type { ChatMessage } from '../../types/chat';
import type { AIService } from '../aiService';

const CLOUDFLARE_WORKER_URL = '';

const streamChatResponse: AIService['streamChatResponse'] = async (
  history: ChatMessage[],
  newMessage: string,
  onChunk: (chunk: string) => void
) => {
  if (!CLOUDFLARE_WORKER_URL) {
    const msg =
      'Cloudflare AI service is not configured. Please set your Worker URL in `services/ai/cloudflare/index.ts`.';
    console.warn(msg);
    onChunk(msg);
    return;
  }

  try {
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, newMessage }),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare Worker responded with status: ${response.status}`);
    }

    const result = await response.json();
    onChunk(result.response || 'No response from Cloudflare AI.');
  } catch (error) {
    console.error('Error communicating with Cloudflare AI Worker:', error);
    onChunk('Error connecting to the Cloudflare AI service.');
  }
};

const resetChat: AIService['resetChat'] = () => {
  // Chat history is managed by the client, so a reset might not be needed
  // on the serverless side unless you maintain session state.
  console.log('Cloudflare chat session reset.');
};

export { streamChatResponse, resetChat };
