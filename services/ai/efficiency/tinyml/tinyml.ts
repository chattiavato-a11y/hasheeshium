// src/services/efficiency/tinyml/tinyml.ts
/**
 * Layer 4: TinyML Dispatcher
 *
 * This file reads from the `config.ts` file and acts as a switchboard,
 * routing the classification request to the currently active TinyML provider.
 */
import { ACTIVE_TINYML_PROVIDER } from './config';
import * as TensorFlowProvider from './providers/tinyml_tensorflow';
import * as PlaceholderProvider from './providers/tinyml_placeholder';

export interface ClassificationResult {
  provider: string;
  intent: 'Simple_Question' | 'Complex_Inquiry' | 'Greeting' | 'Other';
  isToxic: boolean;
}

// The common interface that all TinyML providers must adhere to.
export interface TinyMLProvider {
  getClassification(text: string): Promise<Omit<ClassificationResult, 'provider'>>;
}

let activeProvider: TinyMLProvider;
let providerName: string;

switch (ACTIVE_TINYML_PROVIDER) {
    case 'tensorflow':
        activeProvider = TensorFlowProvider;
        providerName = 'TensorFlow.js';
        break;
    case 'placeholder':
    default:
        activeProvider = PlaceholderProvider;
        providerName = 'Placeholder';
        break;
}

export const getTinyMLClassification = async (text: string): Promise<ClassificationResult> => {
    const result = await activeProvider.getClassification(text);
    return {
        ...result,
        provider: providerName,
    };
};