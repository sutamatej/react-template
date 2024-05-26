import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { increment } from './increment';

// live reloading - dev only
new EventSource('/esbuild').addEventListener('change', () => location.reload());

function App() {
  const [clickedTimes, setClickedTimes] = useState(0);
  return (
    <>
      <button onClick={() => setClickedTimes(increment)}>Click me</button>
      <div>Clicked {clickedTimes} times</div>
    </>
  );
}

const appElement = document.getElementById('app')!;
const root = createRoot(appElement);
root.render(<App />);
