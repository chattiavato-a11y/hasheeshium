export interface JoinModal {
  close: () => void;
  shell: HTMLElement;
  body: HTMLElement;
  footer: HTMLElement;
  header: HTMLElement;
  backdrop: HTMLElement;
}

export function openJoinModal(): JoinModal;
