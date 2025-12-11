import { describe, it } from 'node:test';
import { tryAsync, trySync } from './try';
import assert from 'node:assert';

describe('try-catch wrappers', () => {
  describe('trySync', () => {
    it('returns typed callback result if no error happened during execution', () => {
      const { data, error } = trySync<number>(() => 42);
      assert.equal(data, 42);
      assert.equal(error, null);
    });

    it('returns typed error in case of execution failure', () => {
      const { data, error } = trySync<number>(() => { throw new Error('Failed to execute'); });
      assert.equal(data, null);
      assert.notEqual(error, null);
      assert.ok(error instanceof Error);
    });
  });

  describe('tryAsync', () => {
    it('returns typed promise result if no error happened during execution', async () => {
      const { data, error } = await tryAsync<number>(Promise.resolve(42));
      assert.equal(data, 42)
      assert.equal(error, null);
    });

    it('returns typed error in case of execution failure', async () => {
      const { data, error } = await tryAsync<number>(Promise.reject(new Error('Failed to execute')));
      assert.equal(data, null);
      assert.notEqual(error, null);
      assert.ok(error instanceof Error);
    });
  });
});
