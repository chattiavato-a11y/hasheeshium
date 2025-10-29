// services/efficiency/tinyml/providers/tinyml_tensorflow.ts
/**
 * TinyML Provider: TensorFlow.js Toxicity Model
 *
 * This is the live implementation for Layer 4, using the new, robust singleton service.
 */
import * as tfService from '../../tensorflowService';
import type { TinyMLProvider } from '../tinyml';

export const getClassification: TinyMLProvider['getClassification'] = async (text) => {
  try {
    // The service handles its own initialization, so we can just call it.
    const predictions = await tfService.getToxicityScores([text]);
    const isToxic = tfService.isToxic(predictions);

    // Basic intent detection placeholder
    const simpleIntent = text.length < 50 && text.includes('?');

    return {
      intent: simpleIntent ? 'Simple_Question' : 'Complex_Inquiry',
      isToxic: isToxic,
    };
  } catch (error) {
    console.error("TensorFlow.js provider failed:", error);
    // Fail safe: If the model fails, assume the input is not toxic but complex,
    // which may cause it to be escalated rather than handled by a failing local model.
    return {
      intent: 'Complex_Inquiry',
      isToxic: false,
    };
  }
};