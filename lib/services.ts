export type ServiceKey = 'business-operations' | 'contact-center' | 'it-support' | 'professionals';

export type ServiceTheme = 'operations' | 'contact' | 'support' | 'talent';

export interface ServiceSummary {
  key: ServiceKey;
  name: string;
  description: string;
  highlights: string[];
  modalHeadline: string;
  modalBody: string;
  learnMoreHref: string;
  icon: string;
  iconLabel: string;
  theme: ServiceTheme;
}

export const services: ServiceSummary[] = [
  {
    key: 'business-operations',
    name: 'Business Operations',
    description: 'Digitally orchestrated back-office execution, risk-scored workflows, and CX telemetry.',
    highlights: [
      'Cognitive process automation mapped to PCI DSS Req. 10 logging',
      'Ops Command Board for live SLA, MTTR, and financial KPIs',
      'Continuous compliance guardrails aligned to NIST CSF Identify & Protect'
    ],
    modalHeadline: 'Business Operations Control Tower',
    modalBody:
      'Fuse AI-assisted work orchestration with finance-grade controls. Our operations pod unifies case management, digital twin forecasting, and compliance automation so teams can run secure, lean, and insight-driven.',
    learnMoreHref: '/business-operations',
    icon: '🛰️',
    iconLabel: 'Operations control',
    theme: 'operations'
  },
  {
    key: 'contact-center',
    name: 'Contact Center',
    description: 'Omni-channel care with neuro-design prompts, QA automation, and trust telemetry.',
    highlights: [
      'Intent-aware routing with behavioral biometrics for fraud defense',
      'Quality automation with AI coaching loops for every interaction',
      'Churn, NPS, and empathy analytics surfaced in real-time dashboards'
    ],
    modalHeadline: 'Contact Center Experience Mesh',
    modalBody:
      'Blend digital empathy with cyber-trust. Agents receive just-in-time intelligence, generative summaries, and secure voice, chat, and video pipes hardened for CISA and PCI audits.',
    learnMoreHref: '/contact-center',
    icon: '🎧',
    iconLabel: 'Contact center headset',
    theme: 'contact'
  },
  {
    key: 'it-support',
    name: 'IT Support',
    description: 'Zero-trust service desk with intelligent diagnostics and automated containment.',
    highlights: [
      'Self-healing runbooks orchestrated across Cloudflare Workers',
      'Endpoint, identity, and SaaS posture with anomaly detection baselines',
      'Rapid incident response workflow with tabletop-ready documentation'
    ],
    modalHeadline: 'IT Support Resilience Hub',
    modalBody:
      'Deliver support without compromise. From predictive ticket deflection to secure remote assistance, OPS CySec Core safeguards every diagnostic step with zero-trust policies.',
    learnMoreHref: '/it-support',
    icon: '🛡️',
    iconLabel: 'Shield',
    theme: 'support'
  },
  {
    key: 'professionals',
    name: 'Professionals',
    description: 'Specialized guild of analysts, engineers, and CX strategists on demand.',
    highlights: [
      'Credentialed experts cleared for regulated, high-availability workloads',
      'Fractional leadership to accelerate AI, CX, and modernization initiatives',
      'Outcomes-aligned pods co-creating with your teams in secure enclaves'
    ],
    modalHeadline: 'Professionals Guild',
    modalBody:
      'Tap into elite operations, security, and experience architects. Each guild member is certified across OPS CyberSec Core, ensuring regulated industries get compliant velocity.',
    learnMoreHref: '/professionals',
    icon: '🧠',
    iconLabel: 'Strategic intelligence',
    theme: 'talent'
  }
];

export const getServiceByKey = (key: ServiceKey) => services.find((service) => service.key === key);
