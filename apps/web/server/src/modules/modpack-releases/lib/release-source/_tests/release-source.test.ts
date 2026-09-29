import { describe, expect, it } from 'vitest';

import { INDEX } from '../../select-release/_tests/fixtures';
import { isPublished } from '../release-source';
import { modpackReleaseManifestSchema } from '../release-source.schemas';

const MANIFEST = { name: '@otmetki/modpack', version: '0.1.0', private: true, otmetki: { games: ['1.45.*', '1.46.0.0'] } };

describe('modpackReleaseManifestSchema', () => {
  it('reads the version and the supported clients from the modpack package.json', () => {
    expect(modpackReleaseManifestSchema.parse(MANIFEST)).toEqual({ version: '0.1.0', otmetki: { games: ['1.45.*', '1.46.0.0'] } });
  });

  it('rejects a non-semver version', () => {
    expect(modpackReleaseManifestSchema.safeParse({ ...MANIFEST, version: '0.1' }).success).toBe(false);
  });

  it('rejects missing, empty or malformed games and unknown release fields', () => {
    expect(modpackReleaseManifestSchema.safeParse({ ...MANIFEST, otmetki: undefined }).success).toBe(false);
    expect(modpackReleaseManifestSchema.safeParse({ ...MANIFEST, otmetki: { games: [] } }).success).toBe(false);
    expect(modpackReleaseManifestSchema.safeParse({ ...MANIFEST, otmetki: { games: ['1.x'] } }).success).toBe(false);
    expect(modpackReleaseManifestSchema.safeParse({ ...MANIFEST, otmetki: { games: ['1.45.*'], game: '1.46' } }).success).toBe(false);
  });
});

describe('isPublished', () => {
  it('finds a version already in the index', () => {
    expect(isPublished({ index: INDEX, version: '0.2.0' })).toBe(true);
    expect(isPublished({ index: INDEX, version: '99.0.0' })).toBe(false);
  });
});
