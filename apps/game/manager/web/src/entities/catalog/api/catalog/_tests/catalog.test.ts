import catalog from '@contract/catalog.json';
import { describe, expect, it } from 'vitest';

import { catalogSchema } from '@/entities/catalog';

describe('catalogSchema', () => {
  it('parses the components.json the Rust core serves', () => {
    const parsed = catalogSchema.parse(catalog);

    expect(parsed.components.length).toBeGreaterThan(0);
    expect(parsed.components.every((component) => parsed.categories.some((category) => category.id === component.category))).toBe(true);
  });
});
