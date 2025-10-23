import Head from 'next/head';
import { PropsWithChildren, ReactNode } from 'react';

interface Section {
  title: string;
  body: string;
  bullets?: string[];
  aside?: ReactNode;
}

interface ServicePageProps {
  title: string;
  description: string;
  heroCopy: string;
  sections: Section[];
  eyebrow?: string;
  heroHighlights?: string[];
}

const ServicePage = ({ title, description, heroCopy, sections, eyebrow, heroHighlights }: PropsWithChildren<ServicePageProps>) => (
  <>
    <Head>
      <title>{`${title} | OPS Online Support`}</title>
      <meta name="description" content={description} />
    </Head>
    <header className="page-header">
      <div className="container">
        <p className="section-eyebrow">{eyebrow ?? 'OPS CySec Core Mission Deck'}</p>
        <h1>{title}</h1>
        <p>{heroCopy}</p>
        {heroHighlights && heroHighlights.length > 0 ? (
          <ul className="hero-highlights">
            {heroHighlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </header>
    <div className="container content-section">
      {sections.map((section) => (
        <article key={section.title} className="content-card">
          <h2>{section.title}</h2>
          <p className="content-card-body">{section.body}</p>
          {section.bullets ? (
            <ul className="content-card-list">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
          {section.aside}
        </article>
      ))}
    </div>
  </>
);

export default ServicePage;
