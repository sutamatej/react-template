import { useCallback, useEffect, useState } from 'react';

import { default as TranslationsJson } from './locale/en-us.json';

type PathOf<T, K = keyof T> = K extends keyof T & string
  ? (T[K] extends object ? `${K}.${PathOf<T[K]>}` : `${K}`)
  : never;

type RecursiveKeyOf<T, K = keyof T> = K extends keyof T & string
  ? `${K}` | (T[K] extends object ? `${RecursiveKeyOf<T[K]>}` : never)
  : never

type Translations = typeof TranslationsJson;
type TranslationPath = PathOf<Translations>;
type TranslationKey = RecursiveKeyOf<Translations>;

type PartialTranslation = {
  [key in TranslationKey]: string | PartialTranslation;
};

function getTranslation(translations: Translations, selector: TranslationPath): string | undefined {
  const translationKeys = selector.split('.') as TranslationKey[];
  const translation = translationKeys.reduce<PartialTranslation | string | undefined>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return acc[key]
    }

    return undefined;
  }, translations as PartialTranslation);

  return typeof translation === 'string' ? translation : undefined;
}

export function useTranslations() {
  const [translations, setTranslations] = useState<Translations>();

  useEffect(() => {
    async function fetchTranslations() {
      // @ts-ignore
      const translations = await import('./locale/en-us.js');
      setTranslations(translations.default as Translations);
    }

    void fetchTranslations();
  }, []);

  return useCallback((key: TranslationPath, ...args: (string | number)[]) => {
    if (!translations) {
      return key;
    }

    const translation = getTranslation(translations, key);
    if (!translation) {
      return key;
    }

    let index = 0;
    return translation.replace(/{(\w+)}/g, (match) => {
      const replacement = args[index++];
      if (replacement !== undefined) {
        return replacement.toString();
      }

      console.error('Failed to format translation string', key, translation, args)
      return match;
    });
  }, [translations]);
}

export function useTranslationsFake() {
  return (key: TranslationPath, ...args: (string | number)[]) => (`${key} ${args.join(' ')}`);
}
