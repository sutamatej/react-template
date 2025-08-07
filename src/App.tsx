// oxlint currently doesn't allow separated type imports, see:
// https://github.com/oxc-project/oxc/issues/11987
// https://github.com/oxc-project/oxc/issues/11660
// https://eslint.org/docs/latest/rules/no-duplicate-imports#allowseparatetypeimports
// oxlint-disable-next-line no-duplicate-imports
import { useCallback, useState } from 'react';
import type { ReactElement } from 'react';

import { status } from './App.module.css';
import { useTranslations } from './data/useTranslations';

export function App(): ReactElement {
  const [clickedTimes, setClickedTimes] = useState(0);
  const t = useTranslations();

  const onClick = useCallback(() => {
    setClickedTimes(i => ++i);
  }, []);

  return (
    <>
      <button type="button" onClick={onClick}>{t('buttonLabel.text')}</button>
      <div className={status}>{t('status.label.text', clickedTimes)}</div>
    </>
  );
}
