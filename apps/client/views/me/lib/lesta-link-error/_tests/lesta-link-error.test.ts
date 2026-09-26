import { describe, expect, it } from 'vitest';

import { lestaLinkErrorKey } from '../lesta-link-error';

describe('lestaLinkErrorKey', () => {
  it('shows nothing without an error', () => {
    expect(lestaLinkErrorKey(null)).toBeNull();
  });

  it('names the plan limit and falls back for other codes', () => {
    expect(lestaLinkErrorKey('lesta_link_limit')).toBe('lesta_link_limit');
    expect(lestaLinkErrorKey('lesta_token')).toBe('other');
  });
});
