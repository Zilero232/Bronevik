import { describe, expect, it } from 'vitest';

import { breadcrumbTrail } from '../breadcrumb-trail';

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
