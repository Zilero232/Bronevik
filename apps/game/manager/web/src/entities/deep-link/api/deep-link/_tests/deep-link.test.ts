import links from '@contract/deep-links.json';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { deepLinkSchema } from '@/entities/deep-link';

describe('deepLinkSchema', () => {
  it('parses every triotmetki:// action the Rust core understands', () => {
    const kinds = z
      .array(deepLinkSchema)
      .parse(links)
      .map((link) => link.kind);

    expect(new Set(kinds)).toEqual(new Set(['open', 'profile', 'install']));
  });
});
