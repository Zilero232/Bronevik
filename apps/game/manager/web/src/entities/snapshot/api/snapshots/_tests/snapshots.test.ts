import snapshots from '@contract/snapshots.json';
import { describe, expect, it } from 'vitest';

import { snapshotsSchema } from '@/entities/snapshot';

describe('snapshotsSchema', () => {
  it('parses a snapshot of the modpack files with its kind', () => {
    const [snapshot] = snapshotsSchema.parse(snapshots);

    expect(snapshot?.kind).toBe('manual');
    expect(snapshot?.parts.map((part) => part.name)).toContain('modpack');
  });
});
