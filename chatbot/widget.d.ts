export interface ChattiaModal {
  close: () => void;
  element: HTMLElement;
}

export function openChattia(): Promise<ChattiaModal>;
