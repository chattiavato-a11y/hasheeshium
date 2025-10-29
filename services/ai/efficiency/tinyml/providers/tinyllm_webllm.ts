// services/efficiency/tinyml/providers/tinyllm_webllm.ts
/**
 * TinyLLM Provider: WebLLM
 *
 * This is the live implementation for Layer 5, using the robust,
 * on-demand WebLLM singleton service.
 */
import type { TinyLLMProvider } from '../tinyllm';
import * as webllmService from '../../webllm';

export const generateResponse: TinyLLMProvider['generateResponse'] = async (
    text, 
    history, 
    onChunk,
    onProgress
) => {
  console.log("Using WebLLM Provider.");
  
  if (!onProgress) {
    throw new Error("onProgress callback is required for WebLLM provider.");
  }

  try {
    // The webllmService now manages its own state and initialization.
    // We just pass the data and callbacks through.
    await webllmService.initializeOrGetResponse(text, history, onChunk, onProgress);
  } catch (error) {
    console.error("Error in WebLLM provider:", error);
    // Propagate the error to allow the router to escalate.
    throw error;
  }
};