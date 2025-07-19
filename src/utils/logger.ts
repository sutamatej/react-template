/* oxlint-disable no-console */
import { useMemo } from 'react';

interface Logger {
  error: (...data: unknown[]) => void;
  log: (...data: unknown[]) => void;
  warn: (...data: unknown[]) => void;
}

export function logger(): Logger {
  return {
    error: console.error,
    log: console.log,
    warn: console.warn,
  };
}

export function useLogger(): Logger {
  return useMemo(() => logger(), []);
}
