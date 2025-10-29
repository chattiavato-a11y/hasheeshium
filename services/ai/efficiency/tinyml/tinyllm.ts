/**
 * Layer 5: TinyLLM Dispatcher
 *
 * This file reads from `config.ts` and routes the request to the
 * currently active in-browser LLM provider (e.g., WebLLM or a placeholder).
 */
import type { ChatMessage, AIProgress } from '../../../types/chat';
import { ACTIVE_TINYLLM_PROVIDER } from './config';
import * as WebLLMProvider from './providers/tinyllm_webllm';
import * as PlaceholderProvider from './providers/tinyllm_placeholder';

export interface TinyLLMProvider {
  generateResponse: (
    text: string,
    history: ChatMessage[],
    onChunk: (chunk: string) => void,
    onProgress?: (progress: AIProgress) => void,
  ) => Promise<void>;
}

let activeProvider: TinyLLMProvider;

switch (ACTIVE_TINYLLM_PROVIDER) {
  case 'webllm':
    activeProvider = WebLLMProvider;
    break;
  case 'placeholder':
  default:
    activeProvider = PlaceholderProvider;
    break;
}

export const getTinyLLMResponse = activeProvider.generateResponse;
