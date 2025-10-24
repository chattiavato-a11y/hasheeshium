import { PropsWithChildren } from 'react';
import Head from 'next/head';
import { ExperienceProvider } from '../contexts/ExperienceContext';
import CookieConsent from './CookieConsent';
import FabStack from './FabStack';
import Footer from './Footer';
import MobileDock from './MobileDock';
import NavBar from './NavBar';
import UtilityModals from './UtilityModals';

const LayoutChrome = ({ children }: PropsWithChildren) => (
  <>
    <Head>
      <title>OPS Online Support</title>
      <meta
        name="description"
        content="OPS Online Support activates secure operations, contact center, IT, and professional pods with OPS CySec Core protections."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <a href="#top" className="visually-hidden">
      Skip to main content
    </a>
    <NavBar />
    <main id="top">{children}</main>
    <Footer />
    <FabStack />
    <MobileDock />
    <CookieConsent />
    <UtilityModals />
  </>
);

const Layout = ({ children }: PropsWithChildren) => (
  <ExperienceProvider>
    <LayoutChrome>{children}</LayoutChrome>
  </ExperienceProvider>
);

export default Layout;
