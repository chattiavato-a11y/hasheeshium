import ServicePage from '../components/ServicePage';

const ITSupportPage = () => (
  <ServicePage
    title="IT Support"
    description="Zero-trust IT service management with predictive automation, resilient runbooks, and secure remote remediation."
    heroCopy="Deliver responsive, resilient IT support grounded in zero-trust policy and observability. OPS Online Support automates diagnostics, containment, and recovery while protecting identities, data, and devices."
    eyebrow="OPS CySec Core | IT Support"
    heroHighlights={[
      'Self-healing runbooks orchestrated through Cloudflare Workers',
      'Zero-trust containment aligned to NIST CSF Respond/Recover',
      'Experience-level agreements anchored in telemetry'
    ]}
    sections={[
      {
        title: 'Predictive Service Desk',
        body: 'AI and telemetry prioritize tickets based on business impact, regulatory risk, and user experience. Self-service portals adapt content using behavioral signals to minimize friction.',
        bullets: [
          'Dynamic playbooks integrating CMDB, HRIS, and security tooling',
          'Knowledge articles orchestrated with reinforcement learning feedback',
          'Experience-level agreements (XLAs) measuring sentiment and downtime'
        ]
      },
      {
        title: 'Automated Incident Containment',
        body: 'Serverless runbooks coordinate remediation across Cloudflare Workers, identity providers, and endpoint tools. Every step is logged to immutable trails and enriched with MITRE ATT&CK tactics.',
        bullets: [
          'Just-in-time privileged access flows with MFA enforcement',
          'Network segmentation templates to isolate compromised assets',
          'Post-incident retrospectives accelerated by AI-generated reporting'
        ]
      },
      {
        title: 'Operational Resilience',
        body: 'Stress testing, tabletop exercises, and backup validation ensure continuity targets are not theoretical. Observability pipelines track MTTD, MTTR, and user experience deltas after every change.',
        bullets: [
          'Full-fidelity logging streamed to SIEM with PCI retention controls',
          'Digital forensics readiness with secure evidence vaults',
          'Cyber drill library aligned to NIST CSF Respond and Recover domains'
        ]
      }
    ]}
  />
);

export default ITSupportPage;
