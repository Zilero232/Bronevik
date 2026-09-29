import { describe, expect, it } from 'vitest';

import { breadcrumbCrumbs, breadcrumbTrail } from '@/shared/lib';

describe('breadcrumbTrail', () => {
  it('keeps linked crumbs and the current one', () => {
    expect(breadcrumbTrail([{ label: 'Танки', href: '/tanks' }, { label: 'СССР' }, { label: 'ИС-7' }])).toEqual([
      { name: 'Танки', path: '/tanks' },
      { name: 'ИС-7', path: undefined }
    ]);
  });

  it('skips a trail with a rich label or a single crumb', () => {
    expect(breadcrumbTrail([{ label: 'Танки', href: '/tanks' }, { label: null }])).toBeNull();
    expect(breadcrumbTrail([{ label: 'Танки' }])).toBeNull();
  });
});

describe('breadcrumbCrumbs', () => {
  it('marks only the last crumb as current', () => {
    expect(breadcrumbCrumbs([{ label: 'Танки', href: '/tanks' }, { label: 'СССР' }, { label: 'ИС-7' }]).map(({ isCurrent }) => isCurrent)).toEqual([
      false,
      false,
      true
    ]);
  });

  it('gives every crumb a distinct key, even without a link', () => {
    const keys = breadcrumbCrumbs([{ label: 'Танки', href: '/tanks' }, { label: 'СССР' }, { label: 'ИС-7' }]).map(({ key }) => key);

    expect(new Set(keys).size).toBe(keys.length);
  });
});
