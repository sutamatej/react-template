interface Success<T> {
  data: T;
  error: null;
}

interface Failure {
  data: null;
  error: Error;
}

type Result<T> = Success<T> | Failure;

// Anything can be thrown in JavaScript - wraps values that aren't Errors, keeping them as the cause
function toError(error: unknown): Error {
  return error instanceof Error ? error : Object.assign(new Error('A value that is not an Error was thrown'), { cause: error });
}

export function trySync<T>(
  // oxlint-disable-next-line eslint-plugin-promise/prefer-await-to-callbacks
  callback: () => T
): Result<T> {
  try {
    // oxlint-disable-next-line eslint-plugin-promise/prefer-await-to-callbacks
    const data = callback();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}

// Takes a function rather than a promise, so errors thrown while creating the promise are caught too
export async function tryAsync<T>(
  callback: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await callback();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: toError(error) };
  }
}
