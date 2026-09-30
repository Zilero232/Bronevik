import whatsNew from '@contract/whats-new.json';
import { describe, expect, it } from 'vitest';

import { whatsNewSchema } from '@/entities/changelog';

describe('whatsNewSchema', () => {
  it('parses the changelog with the components of the installed release', () => {
    const parsed = whatsNewSchema.parse(whatsNew);

    expect(parsed.releases[0]?.changes.map((change) => change.id)).toEqual(parsed.freshComponents);
    expect(parsed.showCard).toBe(true);
  });
});
