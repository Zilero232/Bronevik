import installation from '@contract/installation.json';
import { describe, expect, it } from 'vitest';

import { installationSchema } from '@/entities/installation';

describe('installationSchema', () => {
  it('parses every component state the Rust core reports', () => {
    const parsed = installationSchema.parse(installation);

    expect(parsed.components.map((component) => component.state).toSorted()).toEqual(['disabled', 'enabled', 'missing']);
  });
});
