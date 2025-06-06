import { useState } from 'react';
import { increment } from './increment';
import { useTranslations } from './data/useTranslations';

import { status } from './App.module.css';

export function App() {
  const [clickedTimes, setClickedTimes] = useState(0);
  const t = useTranslations();

  return (
    <>
      <button onClick={() => setClickedTimes(increment)}>{t('buttonLabel')}</button>
      <div className={status}>{t('status.label', clickedTimes)}</div>
    </>
  );
}
