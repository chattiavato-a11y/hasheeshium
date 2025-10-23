import { PropsWithChildren } from 'react';
import Head from 'next/head';
import NavBar from './NavBar';

const Layout = ({ children }: PropsWithChildren) => (
  <>
    <Head>
      <title>OPS Online Support | CySec Core Services</title>
      <meta
        name="description"
        content="OPS Online Support blends Business Operations, Contact Center, IT Support, and Professional services inside a secure CySec Core architecture."
      />
      <meta name="keywords" content="Operations Support, Contact Center, IT Support, OPS CySec Core, NIST, PCI DSS" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <a href="#main" className="visually-hidden">
      Skip to main content
    </a>
    <NavBar />
    <main id="main">{children}</main>
    <footer>
      <div className="container footer-grid">
        <p>
          OPS CySec Core • Secure. Compliant. Human-centered.
        </p>
        <small>
          Built with guardrails mapped to NIST CSF, CISA Cyber Essentials, and PCI DSS 4.0.
        </small>
      </div>
    </footer>
  </>
);

export default Layout;
