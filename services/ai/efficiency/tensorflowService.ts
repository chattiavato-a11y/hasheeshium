// services/efficiency/tensorflowService.ts
/**
 * TensorFlow.js Service (Singleton)
 *
 * This service encapsulates all logic for loading and running the on-device
 * toxicity classification model. It follows a singleton pattern to ensure the
 * model is loaded only once and handles its own asynchronous initialization state.
 */
// FIX: Declare the 'tf' and 'toxicity' global variables, which are loaded from script tags.
// This informs TypeScript of their existence and prevents "Cannot find name" errors.
declare var tf: any;
declare var toxicity: any;

type ModelStatus = 'uninitialized' | 'loading' | 'ready' | 'error';
interface ToxicityResult {
    label: string;
    results: { probabilities: Float32Array; match: boolean }[];
}

let model: any = null;
let status: ModelStatus = 'uninitialized';
let initializationPromise: Promise<void> | null = null;

const MODEL_URL = 'https://tfhub.dev/tensorflow/tfjs-model/toxicity/1/default/1';
const THRESHOLD = 0.8;

/**
 * Initializes the toxicity model. This function is designed to be called only once.
 * Subsequent calls will return the existing initialization promise.
 */
export const initialize = (): Promise<void> => {
    if (!initializationPromise) {
        initializationPromise = (async () => {
            if (status !== 'uninitialized') return;

            console.log('Initializing TensorFlow.js toxicity model...');
            status = 'loading';

            try {
                // Ensure the global `tf` and `toxicity` objects are available.
                if (typeof tf === 'undefined' || typeof toxicity === 'undefined') {
                    throw new Error('TensorFlow.js or Toxicity library not loaded.');
                }
                
                // Load the model.
                model = await toxicity.load(THRESHOLD);
                status = 'ready';
                console.log('TensorFlow.js toxicity model loaded successfully.');
            } catch (error) {
                status = 'error';
                console.error('Failed to load TensorFlow.js toxicity model:', error);
                // Allow the promise to reject so the caller can handle the error.
                throw error; 
            }
        })();
    }
    return initializationPromise;
};

/**
 * Analyzes a list of sentences for toxicity.
 * It will wait for the model to be initialized if it hasn't been already.
 * @param sentences An array of strings to classify.
 * @returns A promise that resolves to an array of toxicity prediction results.
 */
export const getToxicityScores = async (sentences: string[]): Promise<ToxicityResult[]> => {
    // Wait for the initialization to complete if it's in progress.
    await initialize();

    if (status !== 'ready' || !model) {
        throw new Error('Toxicity model is not ready or failed to load.');
    }

    try {
        const predictions = await model.classify(sentences);
        // The predictions object is an array of results for each label.
        // Example: [{ label: "identity_attack", results: [...] }, ...]
        return predictions;
    } catch (error) {
        console.error('Error during toxicity classification:', error);
        throw error;
    }
};

/**
 * Checks if any sentence in the input is toxic based on the predictions.
 * @param predictions The result from `getToxicityScores`.
 * @returns `true` if any prediction indicates a match, otherwise `false`.
 */
export const isToxic = (predictions: ToxicityResult[]): boolean => {
    // A sentence is considered toxic if any of the label predictions match.
    return predictions.some(prediction => prediction.results.some(result => result.match));
};