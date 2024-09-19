import { useState } from 'react';
import { increment } from './increment';

import './App.css';

export function App() {
  const [clickedTimes, setClickedTimes] = useState(0);
  return (
    <>
      <button onClick={() => setClickedTimes(increment)}>Click me</button>
      <div className="status">Clicked {clickedTimes} times</div>
    </>
  );
}
