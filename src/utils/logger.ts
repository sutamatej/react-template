/* oxlint-disable no-console */

interface Logger {
  error: (...data: unknown[]) => void;
  log: (...data: unknown[]) => void;
  warn: (...data: unknown[]) => void;
}

// Looks console methods up on each call, so console mocks set up later (e.g. in tests) apply
export const logger: Logger = {
  error: (...data) => console.error(...data),
  log: (...data) => console.log(...data),
  warn: (...data) => console.warn(...data),
};
