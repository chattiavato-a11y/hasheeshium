/**
 * AI Service Abstraction Layer (Plug-and-Play)
 *
 * This file acts as the single entry point for all AI-related functionality in the application.
 * It allows swapping the entire AI backend by changing the `ACTIVE_SERVICE_STACK` variable.
 * The UI components are completely decoupled from the specific implementation details of the AI service.
 */

// --- Configuration ---
// Change this variable to switch between different AI service stacks.
// 'cloudflare': Placeholder for Cloudflare Workers AI.
// 'tinyml': Implements the full 7-layer security-first architecture with local/edge models.
const ACTIVE_SERVICE_STACK = 'tinyml' as 'cloudflare' | 'tinyml';

// --- Service Imports ---
import * as CloudflareService from './cloudflare';
import * as TinyMLService from './efficiency/tinyml';
import type { ChatMessage, AIProgress } from '../../types/chat';

// --- Common Interface Definition ---
export interface AIService {
  streamChatResponse: (
    history: ChatMessage[],
    newMessage: string,
    onChunk: (chunk: string) => void,
    // Add an optional onProgress callback for services that need it (like WebLLM).
    onProgress?: (progress: AIProgress) => void
  ) => Promise<void>;
  resetChat: () => void;
  // NOTE: Real-time audio chat could be added to this interface as well.
}

// --- Service Selection Logic ---
let selectedService: AIService;

switch (ACTIVE_SERVICE_STACK) {
  case 'tinyml':
    selectedService = TinyMLService;
    break;
  case 'cloudflare':
  default:
    selectedService = CloudflareService;
    break;
}

// --- Exported Functions ---
// The UI will call these functions, which are dynamically pointing to the active service stack.

export const streamChatResponse = selectedService.streamChatResponse;
export const resetChat = selectedService.resetChat;
export const ACTIVE_STACK = ACTIVE_SERVICE_STACK;
