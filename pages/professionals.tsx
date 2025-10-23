import ServicePage from '../components/ServicePage';

const ProfessionalsPage = () => (
  <ServicePage
    title="Professionals"
    description="OPS guild of analysts, engineers, and strategists co-creating secure, human-centered transformation."
    heroCopy="Mobilize a guild of cleared professionals who blend cyber, operations, and design mastery. We embed with your teams, co-owning outcomes while protecting sensitive data and human wellbeing."
    eyebrow="OPS CySec Core | Professionals"
    heroHighlights={[
      'Clearance-ready experts across cyber, ops, and design',
      'Regulatory fluency spanning NIST, PCI DSS, and CISA',
      'Human-centered change management with neuro-design insights'
    ]}
    sections={[
      {
        title: 'Specialized Guilds',
        body: 'Curated pods of analysts, engineers, behavior scientists, and designers form around your mission. Each professional maintains credentials across NIST, PCI DSS, and CISA-aligned controls.',
        bullets: [
          'Fractional leadership spanning CISO, COO, and CXO capabilities',
          'HCI and neuro-design strategists optimizing workforce and customer journeys',
          'Data scientists embedding telemetry-driven experimentation frameworks'
        ]
      },
      {
        title: 'Secure Collaboration',
        body: 'Engagements run inside secure enclaves with encryption, DLP, and access governance. Collaboration artifacts are versioned and monitored, ensuring intellectual property remains protected.',
        bullets: [
          'Zero-trust workspaces with continuous device and identity verification',
          'Secure design systems and code libraries with automated compliance checks',
          'Cloud-native pipelines orchestrated across GitHub, Cloudflare, and Netlify'
        ]
      },
      {
        title: 'Outcome Acceleration',
        body: 'We measure success through operational uplift, customer delight, and regulatory posture. Programs include co-created roadmaps, playbooks, and enablement labs to sustain impact after engagement.',
        bullets: [
          'Mission control dashboards visualizing KPIs, OKRs, and compliance scores',
          'Enablement labs and certifications to transition solutions in-house',
          'Post-engagement retrospectives capturing wins, gaps, and next iteration plans'
        ]
      }
    ]}
  />
);

export default ProfessionalsPage;
