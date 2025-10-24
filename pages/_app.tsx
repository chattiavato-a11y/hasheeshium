import type { AppProps } from 'next/app';
import { ExperienceProvider } from '../contexts/ExperienceContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ExperienceProvider>
      <Component {...pageProps} />
    </ExperienceProvider>
  );
}
