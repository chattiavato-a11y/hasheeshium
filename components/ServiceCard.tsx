import { KeyboardEvent } from 'react';
import { ServiceSummary } from '../lib/services';

interface ServiceCardProps {
  service: ServiceSummary;
  onSelect: (service: ServiceSummary) => void;
}

const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(service);
    }
  };

  return (
    <article
      className={`service-card theme-${service.theme}`}
      aria-labelledby={`${service.key}-title`}
      aria-describedby={`${service.key}-summary`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      data-theme={service.theme}
    >
      <header className="service-card-header">
        <div className="service-card-glyph">
          <span className="service-card-icon" aria-hidden="true">
            {service.icon}
          </span>
          <span className="visually-hidden">{service.iconLabel}</span>
        </div>
        <div>
          <h3 id={`${service.key}-title`}>{service.name}</h3>
          <p id={`${service.key}-summary`} className="service-card-summary">
            {service.description}
          </p>
        </div>
      </header>
      <ul className="service-card-list">
        {service.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      <div className="service-card-actions">
        <button type="button" className="btn-outline" onClick={() => onSelect(service)}>
          Open mission brief
        </button>
      </div>
    </article>
  );
};

export default ServiceCard;
