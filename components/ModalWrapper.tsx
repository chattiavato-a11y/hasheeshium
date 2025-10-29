import { useEffect, useRef, useCallback, type MouseEvent, type ReactNode } from 'react';

interface ModalWrapperProps {
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
  modalClassName?: string;
  backdropClassName?: string;
  showBackdrop?: boolean;
}

const ModalWrapper = ({
  children,
  onClose,
  isOpen,
  modalClassName = '',
  backdropClassName = '',
  showBackdrop = true,
}: ModalWrapperProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') {
      return;
    }

    document.addEventListener('keydown', handleEscKey);
    if (showBackdrop) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      if (showBackdrop) {
        document.body.style.overflow = 'auto';
      }
    };
  }, [handleEscKey, isOpen, showBackdrop]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (showBackdrop && event.target === backdropRef.current) {
      onClose();
    }
  };

  const backdropClasses = [
    'modal-wrapper-backdrop',
    showBackdrop ? 'modal-wrapper-backdrop--solid' : 'modal-wrapper-backdrop--passthrough',
    backdropClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const contentClasses = [
    'modal-wrapper-content',
    showBackdrop ? '' : 'modal-wrapper-content--floating',
    modalClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={backdropRef} onClick={handleBackdropClick} className={backdropClasses}>
      <div className={contentClasses}>{children}</div>
    </div>
  );
};

export default ModalWrapper;
