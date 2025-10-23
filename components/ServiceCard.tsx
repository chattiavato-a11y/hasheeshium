import { KeyboardEvent } from 'react';
import { useExperience } from '../contexts/ExperienceContext';
import { ServiceSummary } from '../lib/services';

interface ServiceCardProps {
  service: ServiceSummary;
  onSelect: (_service: ServiceSummary) => void;
}

const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  const { language } = useExperience();

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(service);
    }
  };

  return (
    <article
      id={`service-${service.key}`}
      className="card"
      tabIndex={0}
      role="button"
      aria-label={service.title[language]}
      onClick={() => onSelect(service)}
      onKeyDown={handleKeyDown}
    >
      <div className="title">{service.title[language]}</div>
      <div className="icon" aria-hidden="true">
        <i className={service.iconClass} />
        <span className="visually-hidden">{service.iconLabel[language]}</span>
      </div>
      <div className="content">
        <p>{service.description[language]}</p>
      </div>
    </article>
  );
};

export default ServiceCard;
