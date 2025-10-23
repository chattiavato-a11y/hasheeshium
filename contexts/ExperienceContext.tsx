import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'es';
export type ThemeMode = 'light' | 'dark';
export type UtilityModal = 'contact' | 'join' | 'chatbot' | 'terms' | 'cookies' | 'policy' | null;

interface ExperienceContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  activeModal: UtilityModal;
  openModal: (modal: UtilityModal) => void;
  closeModal: () => void;
}

const ExperienceContext = createContext<ExperienceContextValue | undefined>(undefined);

const languageFallback: Language = 'en';
const themeFallback: ThemeMode = 'light';

const storageKeys = {
  language: 'ops-language',
  theme: 'ops-theme'
};

export const ExperienceProvider = ({ children }: PropsWithChildren) => {
  const [language, setLanguage] = useState<Language>(languageFallback);
  const [theme, setTheme] = useState<ThemeMode>(themeFallback);
  const [activeModal, setActiveModal] = useState<UtilityModal>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedLanguage = window.localStorage.getItem(storageKeys.language);
    const storedTheme = window.localStorage.getItem(storageKeys.theme);

    if (storedLanguage === 'en' || storedLanguage === 'es') {
      setLanguage(storedLanguage);
    }

    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.lang = language;

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKeys.language, language);
    }
  }, [language]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;

    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKeys.theme, theme);
    }
  }, [theme]);

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === 'en' ? 'es' : 'en'));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const openModal = useCallback((modal: UtilityModal) => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      theme,
      setTheme,
      toggleTheme,
      activeModal,
      openModal,
      closeModal
    }),
    [activeModal, language, theme, toggleLanguage, toggleTheme, openModal, closeModal]
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
};

export const useExperience = () => {
  const context = useContext(ExperienceContext);

  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }

  return context;
};
