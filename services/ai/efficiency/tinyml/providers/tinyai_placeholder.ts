/**
 * TinyAI Provider: Placeholder
 * A dummy implementation for Layer 6.
 */
import type { ChatMessage } from '../../../../types/chat';
import type { TinyAIProvider } from '../tinyai';

export const generateResponse: TinyAIProvider['generateResponse'] = async (
  text: string,
  history: ChatMessage[],
): Promise<string | null> => {
  console.log('Using TinyAI Placeholder Provider. No agentic logic is configured.');
  return null;
};
