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

  const topHighlights = service.modal.features[language].slice(0, 2);
  const learnCopy = language === 'en' ? 'View playbook' : 'Ver playbook';

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
      <div className="card-shell">
        <span className="card-badge">{service.badge[language]}</span>
        <div className="card-heading">
          <div className="title">{service.title[language]}</div>
          <div className="icon" aria-hidden="true">
            <i className={service.iconClass} />
            <span className="visually-hidden">{service.iconLabel[language]}</span>
          </div>
        </div>
        <p className="card-spotlight">{service.spotlight[language]}</p>
        <p className="card-summary">{service.description[language]}</p>
        <ul className="card-tags" aria-label={language === 'en' ? 'Featured capabilities' : 'Capacidades destacadas'}>
          {topHighlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="card-footer">
          <span>{learnCopy}</span>
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
