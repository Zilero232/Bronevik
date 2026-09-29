import { describe, expect, it } from 'vitest';

import { TANK_SPECS } from '../../../config';
import { specMeta } from '../spec-meta';

describe('specMeta', () => {
  it('returns the display meta of a known spec', () => {
    expect(specMeta('reloadTime')).toBe(TANK_SPECS.reloadTime);
  });

  it('knows nothing about an unknown spec', () => {
    expect(specMeta('mysterySpec')).toBeUndefined();
  });
});
