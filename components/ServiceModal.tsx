import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';
import { ServiceSummary } from '../lib/services';

interface ServiceModalProps {
  service: ServiceSummary;
  onClose: () => void;
}

const focusableSelectors = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

const ServiceModal = ({ service, onClose }: ServiceModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const highlightListId = useMemo(() => `${service.key}-modal-highlights`, [service.key]);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelectors));
        if (focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className={`modal-panel theme-${service.theme}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${service.key}-modal-title`}
        aria-describedby={highlightListId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        <div className="modal-header">
          <div className="modal-symbol">
            <span className="modal-icon" aria-hidden="true">
              {service.icon}
            </span>
            <span className="visually-hidden">{service.iconLabel}</span>
          </div>
          <div>
            <p className="modal-eyebrow">OPS CySec Core Mission Deck</p>
            <h2 id={`${service.key}-modal-title`}>{service.modalHeadline}</h2>
          </div>
        </div>
        <p className="modal-body">{service.modalBody}</p>
        <ul id={highlightListId} className="modal-highlights">
          {service.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <div className="modal-actions">
          <Link href={service.learnMoreHref} className="btn-primary">
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
