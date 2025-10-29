/**
 * WebLLM Service (Singleton)
 *
 * This service encapsulates all the complexity of loading, managing, and
 * interacting with the in-browser WebLLM engine. It follows a singleton pattern
 * to ensure the heavy model is only initialized once.
 */
import type { ChatMessage, AIProgress } from '../../types/chat';

declare var webllm: any;

type EngineStatus = 'uninitialized' | 'loading' | 'ready' | 'error';

let engine: any = null;
let status: EngineStatus = 'uninitialized';
let initializationPromise: Promise<void> | null = null;
const MODEL_ID = 'phi-2-q4f32_1';

export const initialize = (onProgress: (progress: AIProgress) => void): Promise<void> => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      if (status !== 'uninitialized') return;

      console.log('Initializing WebLLM engine...');
      status = 'loading';

      try {
        if (typeof webllm === 'undefined') {
          throw new Error('WebLLM library not loaded.');
        }

        const progressCallback = (report: any) => {
          const progressUpdate: AIProgress = {
            status: 'loading',
            message: report.text,
            progress: report.progress,
          };
          onProgress(progressUpdate);
        };

        onProgress({ status: 'initializing', message: 'Loading on-device model…' });

        engine = await webllm.CreateMLCEngine(MODEL_ID, {
          initProgressCallback: progressCallback,
        });

        status = 'ready';
        console.log('WebLLM engine ready.');
        onProgress({ status: 'ready', message: 'On-device model ready.' });
      } catch (error: any) {
        status = 'error';
        const errorMessage = `Failed to initialize WebLLM engine: ${error.message}`;
        console.error(errorMessage, error);
        onProgress({ status: 'error', message: errorMessage });
        throw error;
      }
    })();
  }
  return initializationPromise;
};

export const initializeOrGetResponse = async (
  text: string,
  history: ChatMessage[],
  onChunk: (chunk: string) => void,
  onProgress: (progress: AIProgress) => void,
) => {
  if (status !== 'ready') {
    if (text === '__INITIALIZE__') {
      await initialize(onProgress);
      return;
    } else {
      throw new Error('WebLLM engine is not ready. It must be initialized first.');
    }
  }
  await getWebLLMResponse(text, history, onChunk);
};

export const getWebLLMResponse = async (
  text: string,
  history: ChatMessage[],
  onChunk: (chunk: string) => void,
): Promise<void> => {
  if (status !== 'ready' || !engine) {
    throw new Error('WebLLM engine is not ready.');
  }

  try {
    const conversationHistory = history.map((msg) => ({
      role: msg.role === 'bot' ? 'assistant' : msg.role,
      content: msg.text,
    }));

    conversationHistory.push({ role: 'user', content: text });

    const chunks = await engine.chat.completions.create({
      stream: true,
      messages: conversationHistory,
    });

    let fullReply = '';
    for await (const chunk of chunks) {
      const delta = chunk.choices[0].delta.content;
      if (delta) {
        fullReply += delta;
        onChunk(fullReply);
      }
    }
  } catch (error) {
    console.error('Error during WebLLM chat completion:', error);
    throw error;
  }
};
