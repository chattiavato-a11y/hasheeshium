/**
 * Layer Control Panel for the TinyML Service Stack
 *
 * This file allows you to switch the underlying technology for each
 * layer of the on-device AI model with a single line change.
 */

// --- Layer 4: TinyML Provider ---
// 'tensorflow': Uses the live TensorFlow.js toxicity model for on-device analysis.
// 'placeholder': A lightweight implementation that skips model execution.
export const ACTIVE_TINYML_PROVIDER = 'placeholder' as 'tensorflow' | 'placeholder';

// --- Layer 5: TinyLLM Provider ---
// 'webllm': Uses the in-browser WebLLM engine for generative responses.
// 'placeholder': Returns a simple, static, non-generative response.
export const ACTIVE_TINYLLM_PROVIDER = 'placeholder' as 'webllm' | 'placeholder';

// --- Layer 6: TinyAI Provider ---
export const ACTIVE_TINYAI_PROVIDER = 'placeholder' as 'placeholder';
