import { describe, expect, it } from 'vitest';

import { INDEX } from '../../release-index/_tests/fixtures';
import { isPublished, releaseNeeds } from '../release-source';
import { managerReleaseManifestSchema, modpackReleaseManifestSchema } from '../release-source.schemas';

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

describe('managerReleaseManifestSchema', () => {
  it('reads the manager version and rejects a non-semver one', () => {
    expect(managerReleaseManifestSchema.parse({ name: '@otmetki/manager', version: '0.3.0' })).toEqual({ version: '0.3.0' });
    expect(managerReleaseManifestSchema.safeParse({ version: '0.3' }).success).toBe(false);
  });
});

describe('releaseNeeds', () => {
  it('releases nothing when both versions are already published', () => {
    expect(releaseNeeds({ index: INDEX, modpackVersion: '0.2.0', managerVersion: '0.2.0' })).toEqual({ modpack: false, manager: false });
  });

  it('releases only the part whose version is new', () => {
    expect(releaseNeeds({ index: INDEX, modpackVersion: '0.2.0', managerVersion: '0.3.0' })).toEqual({ modpack: false, manager: true });
    expect(releaseNeeds({ index: INDEX, modpackVersion: '0.11.0', managerVersion: '0.2.0' })).toEqual({ modpack: true, manager: false });
  });

  it('never replaces a newer published manager with an older one', () => {
    expect(releaseNeeds({ index: INDEX, modpackVersion: '0.2.0', managerVersion: '0.1.0' }).manager).toBe(false);
  });

  it('releases both into an empty index', () => {
    expect(releaseNeeds({ index: { schemaVersion: 1, releases: [] }, modpackVersion: '0.1.0', managerVersion: '0.1.0' })).toEqual({
      modpack: true,
      manager: true
    });
  });
});
