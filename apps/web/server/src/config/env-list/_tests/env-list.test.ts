import { describe, expect, it } from 'vitest';

import { envList } from '../env-list';

describe('envList', () => {
  it('trims the entries and drops the empty ones', () => {
    expect(envList(' a , ,b,')).toEqual(['a', 'b']);
  });

  it('reads an empty variable as an empty list', () => {
    expect(envList('')).toEqual([]);
  });
});
