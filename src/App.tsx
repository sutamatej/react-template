import { type ReactElement, useCallback, useState } from 'react';

import { status } from './App.module.css';
import { useTranslations } from './data/useTranslations';

export function App(): ReactElement {
  const [clickedTimes, setClickedTimes] = useState(0);
  const t = useTranslations();

  const onClick = useCallback(() => {
    setClickedTimes(i => i + 1);
  }, []);

  return (
    <>
      <button type="button" onClick={onClick}>{t('buttonLabel.text')}</button>
      <div className={status}>{t('status.label.text', clickedTimes)}</div>
    </>
  );
}
