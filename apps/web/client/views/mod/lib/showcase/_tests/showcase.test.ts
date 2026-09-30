import { describe, expect, it } from 'vitest';

import { MOD_SHOWCASE } from '../../../config';
import { isBaseId, isShowcaseId, showcaseCount } from '../showcase';

describe('showcaseCount', () => {
  it('counts every showcased component once', () => {
    const total = MOD_SHOWCASE.reduce((sum, group) => sum + group.items.length, 0);

    expect(showcaseCount()).toBe(total);
  });
});

describe('isShowcaseId', () => {
  it('knows a showcased component', () => {
    expect(isShowcaseId('marks_panel')).toBe(true);
  });

  it('rejects an unknown id', () => {
    expect(isShowcaseId('xvm')).toBe(false);
  });
});

describe('isBaseId', () => {
  it('knows the core packages', () => {
    expect(isBaseId('companion')).toBe(true);
  });

  it('rejects a feature', () => {
    expect(isBaseId('marks_panel')).toBe(false);
  });
});
