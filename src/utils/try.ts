interface Success<T> {
  data: T;
  error: null;
}

interface Failure<TError> {
  data: null;
  error: TError;
}

type Result<T, TError = Error> = Success<T> | Failure<TError>;

export function trySync<T, TError = Error>(
  // oxlint-disable-next-line eslint-plugin-promise/prefer-await-to-callbacks
  callback: () => T
): Result<T, TError> {
  try {
    // oxlint-disable-next-line eslint-plugin-promise/prefer-await-to-callbacks
    const data = callback();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as TError };
  }
}

export async function tryAsync<T, TError = Error>(
  promise: Promise<T>
): Promise<Result<T, TError>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as TError };
  }
}
