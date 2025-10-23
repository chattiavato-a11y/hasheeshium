import { useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import ServiceModal from '../components/ServiceModal';
import { useExperience } from '../contexts/ExperienceContext';
import { ServiceSummary, services } from '../lib/services';

const heroCopy = {
  en: {
    eyebrow: 'OPS Online Support',
    title: (
      <>
        Scale your business with
        <br />
        24/7 expert support
      </>
    ),
    lead: 'OPS provides managed services, IT solutions, and remote professionals to drive your growth.',
    cta: 'Book a consultation',
    ariaLabel: 'Scale your business with 24/7 expert support'
  },
  es: {
    eyebrow: 'OPS Soporte en Línea',
    title: (
      <>
        Escala tu negocio con
        <br />
        soporte experto 24/7
      </>
    ),
    lead: 'OPS ofrece servicios administrados, soluciones de TI y profesionales remotos para impulsar su crecimiento.',
    cta: 'Reserva una consulta',
    ariaLabel: 'Escala tu negocio con soporte experto 24/7'
  }
};

const HomePage = () => {
  const { language, openModal } = useExperience();
  const [selectedService, setSelectedService] = useState<ServiceSummary | null>(null);
  const copy = heroCopy[language];

  return (
    <>
      <section className="hero-section" role="banner" aria-label={copy.ariaLabel}>
        <div className="hero-surface">
          <div className="hero-body">
            <span className="hero-eyebrow">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.lead}</p>
            <div className="hero-actions">
              <button className="btn-consultation" type="button" onClick={() => openModal('contact')}>
                {copy.cta}
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="grid-container" id="services">
        {services.map((service) => (
          <ServiceCard key={service.key} service={service} onSelect={(item) => setSelectedService(item)} />
        ))}
      </div>
      {selectedService ? <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} /> : null}
    </>
  );
};

export default HomePage;
