import { useMemo, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import ServiceModal from '../components/ServiceModal';
import { useExperience } from '../contexts/ExperienceContext';
import { ServiceSummary, services } from '../lib/services';

const heroCopy = {
  en: {
    eyebrow: 'OPS Online Support',
    title: (
      <>
        Scale with <span className="hero-gradient">human + AI pods</span>
        <br />
        delivering 24/7 resilient CX
      </>
    ),
    lead:
      'OPS orchestrates cloud-native operations, AI copilots, and cleared talent to keep your business compliant, responsive, and always-on.',
    bullets: [
      'NIST CSF · CISA · PCI DSS aligned service playbooks',
      'Hybrid talent pods instrumented with observability telemetry',
      'Adaptive UX tuned for core web vitals and neurodesign'
    ],
    ariaLabel: 'Scale with human and AI pods delivering 24/7 resilient customer experience',
    primaryCta: 'Book a consultation',
    secondaryCta: 'Launch Join Us',
    chatbotCta: 'Meet Chattia'
  },
  es: {
    eyebrow: 'OPS Soporte en Línea',
    title: (
      <>
        Escala con <span className="hero-gradient">pods humanos + IA</span>
        <br />
        que ofrecen CX resiliente 24/7
      </>
    ),
    lead:
      'OPS orquesta operaciones nativas en la nube, copilotos de IA y talento acreditado para mantener su negocio cumplido, receptivo y siempre activo.',
    bullets: [
      'Playbooks de servicio alineados a NIST CSF · CISA · PCI DSS',
      'Pods híbridos instrumentados con telemetría de observabilidad',
      'UX adaptativa optimizada para Core Web Vitals y neurodiseño'
    ],
    ariaLabel: 'Escala con pods humanos e IA que entregan experiencia al cliente resiliente 24/7',
    primaryCta: 'Reservar consulta',
    secondaryCta: 'Abrir Únete',
    chatbotCta: 'Conoce Chattia'
  }
};

const heroMetrics = {
  en: [
    { value: '97.4%', label: 'Average CSAT across OPS pods' },
    { value: '60 min', label: 'Critical incident response SLA' },
    { value: '38', label: 'Countries with multilingual coverage' }
  ],
  es: [
    { value: '97.4%', label: 'CSAT promedio en pods OPS' },
    { value: '60 min', label: 'SLA de respuesta a incidentes críticos' },
    { value: '38', label: 'Países con cobertura multilingüe' }
  ]
};

const closingCopy = {
  en: {
    title: 'Ready to activate your OPS pod?',
    body: 'Whether you need a concierge for mission-critical incidents, a multilingual CX runway, or a vetted guild of professionals, we align quickly and stay compliant.',
    primary: 'Contact OPS',
    secondary: 'Join the OPS guild',
    chat: 'Ask Chattia'
  },
  es: {
    title: '¿Listo para activar tu pod OPS?',
    body: 'Ya sea que necesites un concierge para incidentes críticos, una pista CX multilingüe o un gremio de profesionales verificados, nos alineamos rápido y con cumplimiento.',
    primary: 'Contactar OPS',
    secondary: 'Unirse al gremio OPS',
    chat: 'Preguntar a Chattia'
  }
};

const HomePage = () => {
  const { language, openModal } = useExperience();
  const [selectedService, setSelectedService] = useState<ServiceSummary | null>(null);
  const copy = heroCopy[language];
  const metrics = heroMetrics[language];
  const finalCopy = closingCopy[language];

  const orderedServices = useMemo(() => services, []);
  const metricsLabel =
    language === 'en' ? 'OPS performance metrics' : 'Métricas de rendimiento OPS';

  return (
    <>
      <section className="hero-section" role="banner" aria-label={copy.ariaLabel}>
        <div className="hero-surface">
          <div className="hero-body">
            <span className="hero-eyebrow">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.lead}</p>
            <ul className="hero-highlights">
              {copy.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="hero-actions">
              <button className="btn-primary" type="button" onClick={() => openModal('contact')}>
                {copy.primaryCta}
              </button>
              <button className="btn-secondary" type="button" onClick={() => openModal('join')}>
                {copy.secondaryCta}
              </button>
              <button className="btn-ghost" type="button" onClick={() => openModal('chatbot')}>
                {copy.chatbotCta}
              </button>
            </div>
            <dl className="hero-metrics" aria-label={metricsLabel}>
              {metrics.map((metric) => (
                <div key={metric.label} className="hero-metrics-item">
                  <dt>{metric.value}</dt>
                  <dd>{metric.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section container" id="services" aria-labelledby="services-heading">
        <div className="section-heading">
          <p className="section-eyebrow">{language === 'en' ? 'Service pods' : 'Pods de servicio'}</p>
          <h2 id="services-heading">{language === 'en' ? 'OPS service pods ready to deploy' : 'Pods de servicio OPS listos para desplegar'}</h2>
          <p>
            {language === 'en'
              ? 'Each card unlocks deep-dive playbooks, compliance guardrails, and the option to escalate to Chattia or a human concierge.'
              : 'Cada tarjeta activa playbooks profundos, salvaguardas de cumplimiento y la opción de escalar a Chattia o a un concierge humano.'}
          </p>
        </div>
        <div className="service-grid">
          {orderedServices.map((service) => (
            <ServiceCard key={service.key} service={service} onSelect={(item) => setSelectedService(item)} />
          ))}
        </div>
      </section>

      <section className="section container closing-section" aria-labelledby="closing-heading">
        <div className="closing-card">
          <h2 id="closing-heading">{finalCopy.title}</h2>
          <p>{finalCopy.body}</p>
          <div className="closing-actions">
            <button type="button" className="btn-primary" onClick={() => openModal('contact')}>
              {finalCopy.primary}
            </button>
            <button type="button" className="btn-secondary" onClick={() => openModal('join')}>
              {finalCopy.secondary}
            </button>
            <button type="button" className="btn-ghost" onClick={() => openModal('chatbot')}>
              {finalCopy.chat}
            </button>
          </div>
        </div>
      </section>

      {selectedService ? <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} /> : null}
    </>
  );
};

export default HomePage;
