export function getState(): any;
export function initState(initial?: any): void;
export function onStateChange(handler: (state: any) => void): () => void;

export function toggleLang(): void;
export function toggleTheme(): void;