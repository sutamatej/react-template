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
      const { data, error } = trySync<number>(() => { throw new TypeError('Failed to execute'); });
      assert.equal(data, null);
      assert.ok(error instanceof TypeError);
    });

    it('wraps thrown values that are not errors', () => {
      const { data, error } = trySync<number>(() => { throw null; });
      assert.equal(data, null);
      assert.ok(error instanceof Error);
      assert.ok('cause' in error);
      assert.equal(error.cause, null);
    });
  });

  describe('tryAsync', () => {
    it('returns typed promise result if no error happened during execution', async () => {
      const { data, error } = await tryAsync<number>(() => Promise.resolve(42));
      assert.equal(data, 42)
      assert.equal(error, null);
    });

    it('returns typed error in case of execution failure', async () => {
      const { data, error } = await tryAsync<number>(() => Promise.reject(new TypeError('Failed to execute')));
      assert.equal(data, null);
      assert.ok(error instanceof TypeError);
    });

    it('returns the error when creating the promise throws', async () => {
      const { data, error } = await tryAsync<number>(() => { throw new TypeError('Failed to start'); });
      assert.equal(data, null);
      assert.ok(error instanceof TypeError);
    });

    it('wraps rejection values that are not errors', async () => {
      const { data, error } = await tryAsync<number>(() => Promise.reject('Failed to execute'));
      assert.equal(data, null);
      assert.ok(error instanceof Error);
      assert.ok('cause' in error);
      assert.equal(error.cause, 'Failed to execute');
    });
  });
});
