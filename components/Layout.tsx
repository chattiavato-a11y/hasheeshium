import { PropsWithChildren } from 'react';
import Head from 'next/head';
import { ExperienceProvider } from '../contexts/ExperienceContext';
import FabStack from './FabStack';
import MobileDock from './MobileDock';
import NavBar from './NavBar';
import UtilityModals from './UtilityModals';

const LayoutChrome = ({ children }: PropsWithChildren) => (
  <>
    <Head>
      <title>OPS Unified Portal</title>
      <meta
        name="description"
        content="OPS provides managed services, IT solutions, and remote professionals to scale modern operations."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <a href="#top" className="visually-hidden">
      Skip to main content
    </a>
    <NavBar />
    <main id="top">{children}</main>
    <footer>© 2025 OPS Online Support</footer>
    <FabStack />
    <MobileDock />
    <UtilityModals />
  </>
);

const Layout = ({ children }: PropsWithChildren) => (
  <ExperienceProvider>
    <LayoutChrome>{children}</LayoutChrome>
  </ExperienceProvider>
);

export default Layout;
