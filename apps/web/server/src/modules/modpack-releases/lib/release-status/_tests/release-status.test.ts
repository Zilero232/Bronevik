import { describe, expect, it } from 'vitest';

import { INDEX } from '../../select-release/_tests/fixtures';
import { releaseStatus } from '../release-status';

const sizes = { modpack: 2_048, manager: 4_096 };

describe('releaseStatus', () => {
  it('reports the newest modpack release and the manager with the sizes of the published files', () => {
    expect(releaseStatus({ index: INDEX, sizes })).toEqual({
      modpack: { version: '0.10.0', publishedAt: '2026-09-27T12:00:00.000Z', size: 2_048 },
      manager: { version: '0.2.0', publishedAt: '2026-09-27T12:00:00.000Z', size: 4_096 }
    });
  });

  it('reports nothing before the first release', () => {
    expect(releaseStatus({ index: { schemaVersion: 1, releases: [], manager: null }, sizes })).toEqual({ modpack: null, manager: null });
  });

  it('does not offer a file the downloads folder is missing', () => {
    expect(releaseStatus({ index: INDEX, sizes: { modpack: null, manager: 4_096 } }).modpack).toBeNull();
    expect(releaseStatus({ index: INDEX, sizes: { modpack: 2_048, manager: null } }).manager).toBeNull();
  });
});
