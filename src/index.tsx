import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';


import { App } from './App';

// live reloading - dev only
new EventSource('/esbuild').addEventListener('change', () => location.reload());

const appElement = document.getElementById('app');
if (appElement) {
  const root = createRoot(appElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
