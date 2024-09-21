import { useEffect, useState } from 'react';
import { default as defaultTranslations } from './locale/en-us.json';

export function useTranslations() {
  const [translations, setTranslations] = useState<typeof defaultTranslations>();

  useEffect(() => {
    async function fetchTranslations() {
      const response = await fetch('assets/locale/en-us.json');
      const t = await response.json()
      setTranslations(t);
    }

    void fetchTranslations();
  }, [])

  return translations;
}
