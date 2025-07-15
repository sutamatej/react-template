import { tryAsync, trySync } from './try';

describe('try-catch wrappers', () => {
  describe('trySync', () => {
    it('returns typed callback result if no error happened during execution', () => {
      const { data, error } = trySync<number>(() => 42);
      expect(data).toEqual(42);
      expect(error).toBeNull();
    });

    it('returns typed error in case of execution failure', () => {
      const { data, error } = trySync<number>(() => { throw new Error('Failed to execute'); });
      expect(data).toEqual(null);
      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('tryAsync', () => {
    it('returns typed promise result if no error happened during execution', async () => {
      const { data, error } = await tryAsync<number>(Promise.resolve(42));
      expect(data).toEqual(42);
      expect(error).toBeNull();
    });

    it('returns typed error in case of execution failure', async () => {
      const { data, error } = await tryAsync<number>(Promise.reject(new Error('Failed to execute')));
      expect(data).toEqual(null);
      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(Error);
    });
  });
});
