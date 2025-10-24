export interface ModalOptions {
  title: string;
  description?: string;
  content?: (body: HTMLElement) => void;
  footer?: any;
}
export function openModal(idOrOptions: string | ModalOptions): void;
const _default: any;
export default _default;
