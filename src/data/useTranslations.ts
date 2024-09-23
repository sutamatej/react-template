import { useEffect, useState } from 'react';
import { default as defaultTranslations } from './locale/en-us.json';

export function useTranslations() {
  const [translations, setTranslations] = useState<typeof defaultTranslations>();

  useEffect(() => {
    async function fetchTranslations() {
      // @ts-ignore
      const translations = await import('./locale/en-us.js');
      setTranslations(translations.default);
    }

    void fetchTranslations();
  }, []);

  return translations;
}
