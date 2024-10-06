import { useCallback, useEffect, useState } from 'react';

import { default as TranslationsJson } from './locale/en-us.json';

// https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3#comment-268bd
type PathOf<T, K = keyof T> = K extends keyof T & string
  ? (T[K] extends object ? `${K}.${PathOf<T[K]>}` : never) |
    (T[K] extends object ? never : `${K}`)
  : never;

type RecursiveKeyOf<T, K = keyof T> = K extends keyof T & string
  ? `${K}` | (T[K] extends object ? `${RecursiveKeyOf<T[K]>}` : never)
  : never

type TranslationPath = PathOf<typeof TranslationsJson>;
type TranslationKey = RecursiveKeyOf<typeof TranslationsJson>;

// https://stackoverflow.com/questions/47914536/use-partial-in-nested-property-with-typescript
// https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type PartialTranslationsJson = RecursivePartial<typeof TranslationsJson>;

function getTranslation(translations: typeof TranslationsJson, selector: TranslationPath): string {
  // @ts-ignore
  return selector.split('.').reduce((obj: PartialTranslationsJson, key: TranslationKey) => obj[key], translations);
}

export function useTranslations() {
  const [translations, setTranslations] = useState<typeof TranslationsJson>();

  useEffect(() => {
    async function fetchTranslations() {
      // @ts-ignore
      const translations = await import('./locale/en-us.js');
      setTranslations(translations.default as typeof TranslationsJson);
    }

    void fetchTranslations();
  }, []);

  return useCallback((key: TranslationPath, ...args: (string | number)[]) => {
    if (!translations) {
      return key;
    }

    let index = 0;
    const translation = getTranslation(translations, key);
    return translation.replace(/{(\w+)}/g, (_) => {
      const replacement = args[index++];
      if (replacement !== undefined) {
        return replacement.toString();
      }

      console.error('Failed to format translation string', key, translation, args)
      return _;
    });
  }, [translations]);
}

export function useTranslationsFake() {
  return (key: TranslationPath, ...args: (string | number)[]) => (`${key} ${args.join(' ')}`);
}
