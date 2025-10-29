/**
 * Layer 6: TinyAI Dispatcher
 *
 * This file will read from `config.ts` and route to the active
 * constrained agentic logic provider.
 */
import type { ChatMessage } from '../../../types/chat';
import { ACTIVE_TINYAI_PROVIDER } from './config';
import * as PlaceholderProvider from './providers/tinyai_placeholder';

export interface TinyAIProvider {
  generateResponse(text: string, history: ChatMessage[]): Promise<string | null>;
}

let activeProvider: TinyAIProvider;

switch (ACTIVE_TINYAI_PROVIDER) {
  case 'placeholder':
  default:
    activeProvider = PlaceholderProvider;
    break;
}

export const getTinyAIResponse = activeProvider.generateResponse;
