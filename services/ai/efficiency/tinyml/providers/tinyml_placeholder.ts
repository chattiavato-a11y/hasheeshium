// services/efficiency/tinyml/providers/tinyml_placeholder.ts
/**
 * TinyML Provider: Placeholder
 * A dummy implementation for Layer 4.
 */
import type { TinyMLProvider } from '../tinyml';

export const getClassification: TinyMLProvider['getClassification'] = async (text) => {
  console.log("Using TinyML Placeholder Provider.");
  // Simulate a quick, safe response.
  await new Promise(resolve => setTimeout(resolve, 10)); 

  return {
    intent: 'Simple_Question',
    isToxic: false,
  };
};