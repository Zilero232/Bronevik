import snapshots from '@contract/snapshots.json';
import { describe, expect, it } from 'vitest';

import { snapshotsSchema } from '@/entities/snapshot';

describe('snapshotsSchema', () => {
  it('parses the snapshots in the installer layout', () => {
    const [snapshot] = snapshotsSchema.parse(snapshots);

    expect(snapshot?.parts.map((part) => part.name)).toContain('mods');
  });
});
