import { FormEvent, useState } from 'react';
import ServicePage from '../components/ServicePage';
import { sendToWorker } from '../lib/cfWorkerClient';

const endpoint = process.env.NEXT_PUBLIC_JOIN_ENDPOINT;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const JoinUsPage = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setStatus('submitting');
    setFeedback('');
    setWarnings([]);

    try {
      const response = await sendToWorker({
        endpoint,
        payload: {
          name: formData.get('name')?.toString() ?? '',
          email: formData.get('email')?.toString() ?? '',
          discipline: formData.get('discipline')?.toString() ?? '',
          region: formData.get('region')?.toString() ?? '',
          mission: formData.get('mission')?.toString() ?? ''
        }
      });

      setWarnings(response.warnings ?? []);
      setStatus(response.ok ? 'success' : 'error');
      setFeedback(
        response.ok
          ? response.message ?? 'Application received. Our guild operations team will follow up with next steps.'
          : 'We could not complete secure intake. Please retry later or contact ops@ops-cysec-core.'
      );
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus('error');
      setFeedback('Unexpected issue while submitting. Please verify your network posture and try again.');
    }
  };

  return (
    <div>
      <ServicePage
        title="Join the OPS Professionals Guild"
        description="Apply to the OPS CySec Core guild of cleared professionals delivering secure, human-centered transformation."
        heroCopy="We recruit polymaths across security, operations, design, and analytics. Our guild operates with trust, compliance, and wellbeing at the center."
        eyebrow="OPS CySec Core | Talent Guild"
        heroHighlights={[
          'Clearance pathways and continuous vetting support',
          'Wellbeing-first delivery model with neuro-design rituals',
          'Mission pods aligned to regulated industry outcomes'
        ]}
        sections={[]}
      />
      <div className="container content-section">
        <article className="content-card">
          <h2>Guild application</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label htmlFor="name">
              Name
              <input id="name" name="name" type="text" required maxLength={120} autoComplete="name" />
            </label>
            <label htmlFor="email">
              Work email
              <input id="email" name="email" type="email" required autoComplete="email" />
            </label>
            <label htmlFor="discipline">
              Core discipline
              <select id="discipline" name="discipline" defaultValue="Operations Engineering">
                <option>Operations Engineering</option>
                <option>Cybersecurity</option>
                <option>Experience Design</option>
                <option>Data Science</option>
                <option>Contact Center Leadership</option>
              </select>
            </label>
            <label htmlFor="region">
              Region
              <input id="region" name="region" type="text" placeholder="North America" maxLength={120} />
            </label>
            <label htmlFor="mission">
              Mission focus
              <textarea id="mission" name="mission" rows={5} maxLength={1200} required />
            </label>
            <div>
              <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting…' : 'Submit application'}
              </button>
            </div>
          </form>
          {feedback ? <p className="alert" role="status">{feedback}</p> : null}
          {warnings.length > 0 ? (
            <div className="alert alert-stack" role="status">
              <strong>Sanitization notices:</strong>
              <ul>
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      </div>
    </div>
  );
};

export default JoinUsPage;
