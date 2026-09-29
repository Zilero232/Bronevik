import sets from '@contract/sets.json';
import { describe, expect, it } from 'vitest';

import { COMPONENT_SET, setsViewSchema } from '@/entities/component-set';

describe('setsViewSchema', () => {
  it('parses the saved component sets the Rust core serves', () => {
    const view = setsViewSchema.parse(sets);

    expect(view.max).toBe(COMPONENT_SET.maxSets);
    expect(view.sets[0]?.components).toContain('core');
  });
});
