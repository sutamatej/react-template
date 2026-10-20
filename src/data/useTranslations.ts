import { useCallback, useEffect, useState } from 'react';

import type { default as TranslationsJson } from './locale/en-us.json';
import { tryAsync } from '../utils/try';
import { logger } from '../utils/logger';

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

type TranslationParams = Record<string, string | number>;

type TranslationFn = (key: TranslationPath, params?: TranslationParams) => string;

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
  const [translations, setTranslations] = useState<Translations | null>(null);

  useEffect(() => {
    async function fetchTranslations(): Promise<void> {
      // NOTE: this could be a typed import that fetches the JSON directly, but
      // the browser support is not there yet. See
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with
      // @ts-expect-error: We're importing a file that only exists after build/at runtime
      const { data, error } = await tryAsync<{ default: Translations }>(() => import('./locale/en-us.js'));
      if (error) {
        logger.error(error);
        setTranslations(null);
        return;
      }

      setTranslations(data.default);
    }

    void fetchTranslations();
  }, []);

  return useCallback((key: TranslationPath, params: TranslationParams = {}) => {
    if (!translations) {
      return key;
    }

    const translation = getTranslation(translations, key);
    if (!translation) {
      return key;
    }

    return translation.replace(/{(\w+)}/g, (match, name: string) => {
      const replacement = Object.prototype.hasOwnProperty.call(params, name) ? params[name] : undefined;
      if (typeof replacement !== 'undefined') {
        return replacement.toString();
      }

      logger.error('Failed to format translation string', key, translation, params);
      return match;
    });
  }, [translations]);
}

export function useTranslationsFake() {
  return (key: TranslationPath, params: TranslationParams = {}): string => (`${key} ${Object.values(params).join(' ')}`);
}
