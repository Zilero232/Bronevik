import { describe, expect, it } from 'vitest';

import { recommendedBuildHref } from '../recommended-href';

describe('recommendedBuildHref', () => {
  it('opens the constructor with the recommended preset of a mode and cohort', () => {
    expect(recommendedBuildHref({ slug: 'is-7', mode: 'onslaught', cohort: 'top10' })).toBe(
      '/builds/is-7?preset=recommended&mode=onslaught&cohort=top10'
    );
  });
});
