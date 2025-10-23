import ServicePage from '../components/ServicePage';

const ContactCenterPage = () => (
  <ServicePage
    title="Contact Center"
    description="Omni-channel contact center engineered with digital empathy, biometric fraud defense, and closed-loop analytics."
    heroCopy="Reimagine every conversation as a secure, sentiment-aware moment. OPS Online Support powers omni-channel experiences infused with neuro-design cues, AI-guided coaching, and zero-trust connectivity."
    eyebrow="OPS CySec Core | Contact Center"
    heroHighlights={[
      'Omni-channel trust fabric mapped to PCI DSS + CISA',
      'Behavioral biometrics screening spoofing attempts',
      'AI coaching infused with neuro-design prompts'
    ]}
    sections={[
      {
        title: 'Intelligent Experience Mesh',
        body: 'Voice, chat, messaging, and social channels ride on resilient Cloudflare edges with noise suppression, transcription, and translation built in. Behavioral biometrics filter spoofing attempts in milliseconds.',
        bullets: [
          'Adaptive intent routing with PCI redaction and compliance scoring',
          'Journey orchestration to follow customers across touchpoints seamlessly',
          'Real-time fraud and anomaly alerts piped into SIEM ecosystems'
        ]
      },
      {
        title: 'AI-Accelerated Quality',
        body: 'Supervisors gain AI assistants that summarize calls, grade empathy, and benchmark compliance. Coaching loops trigger micro-learning paths that uplift CSAT without sacrificing handle time.',
        bullets: [
          'Auto-generated interaction scorecards with explainable AI evidence',
          'Voice of Customer analytics fused with operations data in dashboards',
          'Digital wellbeing features to reduce agent cognitive load'
        ]
      },
      {
        title: 'Trust, Compliance, & Continuity',
        body: 'Security headers, encryption, and audit-ready logging harden every engagement. Incident simulations and tabletop exercises ensure the contact center rebounds rapidly after disruption.',
        bullets: [
          'CISA Cyber Essentials playbooks for communication resilience',
          'PCI DSS compliant payment capture with tokenized orchestration',
          'Business continuity metrics tracking MTTD and MTTR improvements'
        ]
      }
    ]}
  />
);

export default ContactCenterPage;
