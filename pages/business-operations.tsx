import ServicePage from '../components/ServicePage';

const OperationsPage = () => (
  <ServicePage
    title="Operations"
    description="AI-orchestrated, compliance-instrumented operations that protect every workflow across finance, fulfillment, and customer journeys."
    heroCopy="Transform back-office execution into a predictive, telemetry-rich control tower. Our Operations pod activates secure automations across finance, fulfillment, and experience ecosystems."
    eyebrow="OPS CySec Core | Operations"
    heroHighlights={[
      'Predictive workflows mapped to NIST CSF Identify & Protect',
      'Risk-indexed playbooks with zero-trust approvals',
      'Telemetry pipelines hardened for PCI DSS Req. 10'
    ]}
    sections={[
      {
        title: 'Unified Command Board',
        body: 'Experience a single pane of glass that aligns SLAs, MTTR, backlog, and financial metrics. Decision intelligence from cloud data warehouses pulses into intuitive tiles to direct next-best actions.',
        bullets: [
          'Real-time digital twin of processes with what-if forecasting',
          'PCI DSS Req. 10 aligned logging with immutable audit streams',
          'Workflow lineage, approvals, and variance tagging for audits'
        ]
      },
      {
        title: 'Cognitive Process Automation',
        body: 'Deploy AI copilots that monitor demand, bottlenecks, and resilience posture. Automations escalate exceptions through zero-trust routing and enforce segregation of duties at every step.',
        bullets: [
          'Robotic process orchestration with policy-as-code guardrails',
          'Anomaly detection using baseline telemetry and MITRE ATT&CK mapping',
          'Self-healing workflows triggered by predictive incident modeling'
        ]
      },
      {
        title: 'Governance & Value Realization',
        body: 'Every improvement sprint is logged, measured, and communicated in language executives and auditors trust. Quarterly playbooks align to NIST CSF Identify, Protect, Detect, Respond, and Recover functions.',
        bullets: [
          'Financial impact dashboard capturing ROI, CX, and resilience uplift',
          'Continuous readiness scoring across NIST, PCI DSS, and CISA essentials',
          'Embedded change management with human-centric enablement kits'
        ]
      }
    ]}
  />
);

export default OperationsPage;
