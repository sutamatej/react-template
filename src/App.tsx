import { useState } from 'react';
import { increment } from './increment';

export function App() {
  const [clickedTimes, setClickedTimes] = useState(0);
  return (
    <>
      <button onClick={() => setClickedTimes(increment)}>Click me</button>
      <div>Clicked {clickedTimes} times</div>
    </>
  );
}
