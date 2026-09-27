import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { QUICK_LINKS } from '../../../config/quick-links.constants';
import { quickLinkTargets } from '../quick-links';

describe('quickLinkTargets', () => {
  it('keeps the configured order', () => {
    expect(quickLinkTargets('Player').map(({ key }) => key)).toEqual([...QUICK_LINKS]);
  });

  it('points the profile link at the player it was built for', () => {
    expect(quickLinkTargets('Some Player').find(({ key }) => key === 'profile')?.href).toBe(ROUTES.players.profile('Some Player'));
  });

  it('gives every link a distinct destination', () => {
    const hrefs = quickLinkTargets('Player').map(({ href }) => href);

    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
