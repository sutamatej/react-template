import { increment } from './increment';

describe('increment', () => {
  it('returns n + 1 for n', () => {
    const result = increment(1);
    expect(result).toEqual(2);
  });
});