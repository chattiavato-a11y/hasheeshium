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

const experienceInsights = {
  en: [
    {
      title: 'Cyber-resilient by design',
      body: 'Ops pods ship with encryption, SIEM logging, threat baselining, and documented IR playbooks. Security headers, MFA, and privacy-by-design are non-negotiable.',
      bullets: ['PCI DSS 4.0 requirements 3–11 embedded', 'Security headers + zero trust posture', 'Automated risk and compliance reporting']
    },
    {
      title: 'Adaptive CX and neurodesign',
      body: 'We pair behavioral science with real-time analytics to orchestrate device-agnostic experiences. Micro-interactions follow WCAG 2.1 AA and Core Web Vitals best practices.',
      bullets: ['Responsive grids and motion mindful of accessibility', 'Personalized flows powered by AI copilots', 'Feedback loops tied to Lighthouse CI and Web Vitals']
    },
    {
      title: 'Human + AI orchestration',
      body: 'Chattia copilots every touchpoint, routing to specialists, summarizing intents, and surfacing knowledge from OPS playbooks.',
      bullets: ['BM25-style knowledge search across services', 'Context-aware escalations to OPS guild talent', 'Secure data retention with audit-grade controls']
    }
  ],
  es: [
    {
      title: 'Ciberresiliencia por diseño',
      body: 'Los pods OPS incluyen cifrado, registros SIEM, líneas base de amenazas y planes de respuesta documentados. Encabezados de seguridad, MFA y privacidad por diseño son obligatorios.',
      bullets: ['Requisitos PCI DSS 4.0 (3–11) integrados', 'Encabezados de seguridad y postura zero trust', 'Reportes automatizados de riesgo y cumplimiento']
    },
    {
      title: 'CX adaptativa y neurodiseño',
      body: 'Combinamos ciencia del comportamiento con analítica en tiempo real para crear experiencias agnósticas de dispositivo. Las microinteracciones siguen WCAG 2.1 AA y Core Web Vitals.',
      bullets: ['Grillas responsivas y movimiento accesible', 'Flujos personalizados impulsados por copilotos IA', 'Bucles de retroalimentación con Lighthouse CI y Web Vitals']
    },
    {
      title: 'Orquestación Humano + IA',
      body: 'Chattia copilota cada punto de contacto, enruta a especialistas, resume intenciones y expone conocimiento de los playbooks OPS.',
      bullets: ['Búsqueda tipo BM25 en servicios', 'Escalaciones contextuales al gremio OPS', 'Retención de datos segura con controles auditables']
    }
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
  const insights = experienceInsights[language];
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

      <section className="section container insight-section" aria-labelledby="insights-heading">
        <div className="section-heading">
          <p className="section-eyebrow">{language === 'en' ? 'Best-practice orchestration' : 'Orquestación de mejores prácticas'}</p>
          <h2 id="insights-heading">{language === 'en' ? 'Designing for resilience, delight, and compliance' : 'Diseñando para resiliencia, deleite y cumplimiento'}</h2>
        </div>
        <div className="insight-grid">
          {insights.map((insight) => (
            <article key={insight.title} className="insight-card">
              <h3>{insight.title}</h3>
              <p>{insight.body}</p>
              <ul>
                {insight.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
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
