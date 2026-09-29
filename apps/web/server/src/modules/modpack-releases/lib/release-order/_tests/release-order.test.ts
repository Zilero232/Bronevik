import { describe, expect, it } from 'vitest';

import { newestFirst } from '../release-order';

describe('newestFirst', () => {
  it('orders by semver, not by string', () => {
    expect(newestFirst([{ version: '0.2.0' }, { version: '0.10.0' }, { version: '0.9.1' }]).map(({ version }) => version)).toEqual([
      '0.10.0',
      '0.9.1',
      '0.2.0'
    ]);
  });
});
