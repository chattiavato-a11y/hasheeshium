import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ServiceCard from '../components/ServiceCard';
import ServiceModal from '../components/ServiceModal';
import { ServiceSummary, services } from '../lib/services';

const heroStats = [
  {
    value: '32% faster',
    label: 'MTTR reduction',
    detail: 'Measured across hybrid operations after 90 days on platform.'
  },
  {
    value: '4.9 / 5',
    label: 'Experience rating',
    detail: 'Agent + customer sentiment uplift through neuro-design rituals.'
  },
  {
    value: '0 breaches',
    label: 'Intrusion record',
    detail: 'Backed by PCI DSS 4.0, CISA, and NIST CSF-aligned controls.'
  }
];

const lifecyclePhases = [
  {
    phase: 'Identify',
    headline: 'Illuminate risk surfaces',
    description:
      'Asset intelligence, threat modeling, and third-party due diligence reveal where to focus automation and controls first.',
    controls: ['Dynamic asset inventory', 'Supply-chain risk heatmaps', 'Regulatory gap assessments']
  },
  {
    phase: 'Protect',
    headline: 'Engineer zero-trust guardrails',
    description:
      'MFA, least-privilege, encryption, and secure-by-default design patterns create hardened pathways across every workflow.',
    controls: ['Policy-as-code runbooks', 'AES-256 encryption and tokenization', 'Continuous awareness campaigns']
  },
  {
    phase: 'Detect',
    headline: 'Sense anomalies early',
    description:
      'Behavioral analytics, SIEM integrations, and observability pipelines baseline normal operations and surface deviations fast.',
    controls: ['SIEM + SOAR fusion dashboards', 'Anomaly baselining with MITRE ATT&CK mapping', 'Synthetic monitoring probes']
  },
  {
    phase: 'Respond',
    headline: 'Mobilize decisive action',
    description:
      'Incident playbooks, forensic capture, and secure comms channels coordinate teams and executives with clarity and speed.',
    controls: ['Tabletop rehearsals', 'Forensic evidence vaults', 'Stakeholder communication cadences']
  },
  {
    phase: 'Recover',
    headline: 'Strengthen continuity',
    description:
      'Post-incident retros, resilience metrics, and iterative improvements reduce MTTR, MTTD, and amplify customer trust.',
    controls: ['Continuity scorecards', 'Runbook refinement loops', 'Executive-ready recovery narratives']
  }
];

const ecosystemPillars = [
  {
    title: 'Unified Ops Fabric',
    body:
      'Command boards weave together finance, fulfillment, CX, and IT telemetry so leaders orchestrate the entire experience lifecycle from one trusted pane of glass.',
    bullets: ['Digital twins with predictive forecasting', 'Mission control rooms with Core Web Vitals telemetry', 'Cross-functional workflows anchored in DevSecOps rituals']
  },
  {
    title: 'Human-Centered Automation',
    body:
      'We blend AI copilots, neuro-design cues, and wellbeing guardrails to elevate teams. Automations are transparent, explainable, and auditable.',
    bullets: ['Neuro-design prompts that reduce cognitive overload', 'Explainable AI for frontline teams and executives', 'Behavioral analytics to personalize enablement']
  },
  {
    title: 'Regulatory Confidence',
    body:
      'OPS CySec Core is mapped to NIST CSF, CISA Cyber Essentials, and PCI DSS 4.0. Compliance posture is live, contextual, and ready for boardrooms.',
    bullets: ['Continuous compliance dashboards', 'Evidence chains aligned to PCI DSS Requirements 3–11', 'Privacy-by-design patterns supporting GDPR and CCPA']
  }
];

const IndexPage = () => {
  const [activeService, setActiveService] = useState<ServiceSummary | null>(null);

  return (
    <>
      <Head>
        <title>OPS Online Support | Unified Operations Landing</title>
      </Head>
      <section className="hero">
        <div className="container hero-shell">
          <div className="hero-copy">
            <p className="section-eyebrow">OPS CySec Core</p>
            <h1>OPS Online Support</h1>
            <p className="hero-lead">
              Hybrid Ops Online Support engineered for regulated industries. We braid Business Operations, Contact Center, IT Support,
              and a guild of Professionals into a self-healing, compliance-first ecosystem anchored in OPS CySec Core.
            </p>
            <div className="hero-badges" role="list">
              {['NIST CSF', 'CISA Cyber Essentials', 'PCI DSS 4.0', 'Zero Trust Fabric'].map((badge) => (
                <span key={badge} className="hero-badge" role="listitem">
                  {badge}
                </span>
              ))}
            </div>
            <div className="hero-actions">
              <Link className="btn-primary" href="#services">
                Discover services
              </Link>
              <Link className="btn-outline" href="/chattia">
                Launch Chattia
              </Link>
            </div>
            <div className="hero-stats">
              {heroStats.map((stat) => (
                <article key={stat.label} className="stat-card">
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-detail">{stat.detail}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orb hero-orb-primary" />
            <div className="hero-orb hero-orb-secondary" />
            <div className="hero-ring" />
            <div className="hero-grid" />
          </div>
        </div>
      </section>

      <section className="container service-intro">
        <header className="section-heading">
          <p className="section-eyebrow">Unified operations</p>
          <h2>Mission control for regulated digital operations</h2>
          <p className="section-subtitle">
            OPS CySec Core fuses automation, human empathy, and cyber resilience. We craft adaptive experiences that respect privacy,
            accelerate response, and delight customers.
          </p>
        </header>
        <div className="pillar-grid">
          {ecosystemPillars.map((pillar) => (
            <article key={pillar.title} className="pillar-card">
              <h3>{pillar.title}</h3>
              <p className="pillar-body">{pillar.body}</p>
              <ul className="pillar-list">
                {pillar.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="container services-section">
        <header className="section-heading">
          <p className="section-eyebrow">Service portfolio</p>
          <h2>Services anchored in OPS CySec Core</h2>
          <p className="section-subtitle">
            Each mission pod is infused with zero-trust, telemetry-first instrumentation, and behavioral UX so teams can move fast without
            violating NIST CSF, CISA, or PCI DSS guardrails.
          </p>
        </header>
        <div className="card-grid">
          {services.map((service) => (
            <ServiceCard key={service.key} service={service} onSelect={setActiveService} />
          ))}
        </div>
      </section>

      <section className="container lifecycle-section">
        <header className="section-heading">
          <p className="section-eyebrow">OPS CySec Core lifecycle</p>
          <h2>Regulatory-aligned resilience in five moves</h2>
          <p className="section-subtitle">
            Our framework operationalizes Identify → Protect → Detect → Respond → Recover so every workflow is auditable, resilient, and human-centered.
          </p>
        </header>
        <div className="lifecycle-grid">
          {lifecyclePhases.map((phase) => (
            <article key={phase.phase} className="lifecycle-card">
              <header>
                <span className="lifecycle-phase">{phase.phase}</span>
                <h3>{phase.headline}</h3>
              </header>
              <p className="lifecycle-body">{phase.description}</p>
              <ul className="lifecycle-list">
                {phase.controls.map((control) => (
                  <li key={control}>{control}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="container cta-section">
        <div className="cta-panel">
          <div>
            <p className="section-eyebrow">Next step</p>
            <h2>Spin up your mission control</h2>
            <p className="section-subtitle">
              Engage secure contact to activate your transformation pod, or meet the Professionals Guild to augment your teams with cleared experts.
            </p>
          </div>
          <div className="cta-actions">
            <Link className="btn-primary" href="/contact-us">
              Engage secure contact
            </Link>
            <Link className="btn-outline" href="/join-us">
              Meet the guild
            </Link>
          </div>
        </div>
      </section>

      {activeService ? <ServiceModal service={activeService} onClose={() => setActiveService(null)} /> : null}
    </>
  );
};

export default IndexPage;
