import '../__setup/dom.mjs';
import { type TestContext, describe, it } from 'node:test';
import { render, renderHook, waitFor } from '@testing-library/react';
import { TranslationsProvider, useTranslations } from './useTranslations';
import assert from 'node:assert';

const locale = {
  buttonLabel: {
    comment: 'A label for a button',
    text: 'Click me',
  },
  status: {
    label: {
      comment: 'A status label',
      text: '{total} total, {count} clicked',
    },
  },
};

// Renders the hook with the given locale file contents and waits until they're loaded
async function renderUseTranslations(t: TestContext, localeFile: unknown) {
  t.mock.module('./locale/en-us.js', { defaultExport: localeFile });
  const consoleError = t.mock.method(console, 'error', () => {});
  const { result } = renderHook(() => useTranslations(), { wrapper: TranslationsProvider });
  const beforeLoad = result.current;
  await waitFor(() => assert.notStrictEqual(result.current, beforeLoad));
  return { consoleError, translate: result.current };
}

describe('useTranslations', () => {
  it('returns keys until translations are loaded', (t) => {
    t.mock.module('./locale/en-us.js', { defaultExport: locale });
    const { result } = renderHook(() => useTranslations(), { wrapper: TranslationsProvider });
    assert.equal(result.current('buttonLabel.text'), 'buttonLabel.text');
  });

  it('returns the translation for a key', async (t) => {
    const { translate } = await renderUseTranslations(t, locale);
    assert.equal(translate('buttonLabel.text'), 'Click me');
  });

  it('fills placeholders by name, regardless of their order', async (t) => {
    const { translate } = await renderUseTranslations(t, locale);
    assert.equal(translate('status.label.text', { count: 1, total: '5' }), '5 total, 1 clicked');
  });

  it('keeps a placeholder without a value and logs an error', async (t) => {
    const { consoleError, translate } = await renderUseTranslations(t, locale);
    assert.equal(translate('status.label.text', { count: 1 }), '{total} total, 1 clicked');
    assert.equal(consoleError.mock.callCount(), 1);
  });

  it('ignores inherited object properties as placeholder values', async (t) => {
    const { consoleError, translate } = await renderUseTranslations(t, {
      ...locale,
      buttonLabel: { ...locale.buttonLabel, text: '{constructor}' },
    });
    assert.equal(translate('buttonLabel.text'), '{constructor}');
    assert.equal(consoleError.mock.callCount(), 1);
  });

  it('returns the key when the translation is missing', async (t) => {
    const { translate } = await renderUseTranslations(t, { status: locale.status });
    assert.equal(translate('buttonLabel.text'), 'buttonLabel.text');
  });

  it('translates on the first render of components mounted after loading', async (t) => {
    t.mock.module('./locale/en-us.js', { defaultExport: locale });
    const renders: string[] = [];
    function Label({ name }: { name: string }) {
      renders.push(`${name}: ${useTranslations()('buttonLabel.text')}`);
      return null;
    }

    const { rerender } = render(
      <TranslationsProvider>
        <Label name="early" />
      </TranslationsProvider>
    );
    await waitFor(() => assert.ok(renders.includes('early: Click me')));
    rerender(
      <TranslationsProvider>
        <Label name="early" />
        <Label name="late" />
      </TranslationsProvider>
    );

    assert.deepEqual(renders.filter(r => r.startsWith('late')), ['late: Click me']);
  });

  it('throws when used outside of a TranslationsProvider', (t) => {
    t.mock.method(console, 'error', () => {});
    assert.throws(() => renderHook(() => useTranslations()), /TranslationsProvider/);
  });

  it('loads the real locale file', async () => {
    const { result } = renderHook(() => useTranslations(), { wrapper: TranslationsProvider });
    await waitFor(() => assert.equal(result.current('buttonLabel.text'), 'Click me'));
  });
});
