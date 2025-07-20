import { useCallback, useEffect, useState } from 'react';

import type { default as TranslationsJson } from './locale/en-us.json';
import { tryAsync } from '../utils/try';
import { useLogger } from '../utils/logger';

type PathOf<T, K = keyof T> = K extends keyof T & string
  ? (T[K] extends object ? `${K}.${PathOf<T[K]>}` : `${K}`)
  : never;

type RecursiveKeyOf<T, K = keyof T> = K extends keyof T & string
  ? `${K}` | (T[K] extends object ? `${RecursiveKeyOf<T[K]>}` : never)
  : never

type Translations = typeof TranslationsJson;
type TranslationPath = Extract<PathOf<Translations>, `${string}.text`>;
type TranslationKey = RecursiveKeyOf<Translations>;

type PartialTranslation = {
  [key in TranslationKey]: string | PartialTranslation;
};

type TranslationFn = (key: TranslationPath, ...args: (string | number)[]) => string;

function getTranslation(translations: Translations, selector: TranslationPath): string | null {
  const translationKeys = selector.split('.') as TranslationKey[];
  const translation = translationKeys.reduce<PartialTranslation | string | null>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return acc[key]
    }

    return null;
  }, translations as PartialTranslation);

  return typeof translation === 'string' ? translation : null;
}

export function useTranslations(): TranslationFn {
  const logger = useLogger();
  const [translations, setTranslations] = useState<Translations | null>(null);

  useEffect(() => {
    async function fetchTranslations(): Promise<void> {
      // NOTE: this could be a typed import that fetches the JSON directly, but
      // the browser support is not there yet. See
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with
      // @ts-expect-error: We're importing a file that only exists after build/at runtime
      const { data, error } = await tryAsync<Translations>(import('./locale/en-us.js'));
      if (error) {
        logger.error(error);
        setTranslations(null);
        return;
      }

      setTranslations(data);
    }

    void fetchTranslations();
  }, [logger]);

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
      if (typeof replacement !== 'undefined') {
        return replacement.toString();
      }

      logger.error('Failed to format translation string', key, translation, args);
      return match;
    });
  }, [translations, logger]);
}

export function useTranslationsFake() {
  return (key: TranslationPath, ...args: (string | number)[]): string => (`${key} ${args.join(' ')}`);
}
