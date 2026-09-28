import { describe, expect, it } from 'vitest';

import { modpackLatestQuerySchema, modpackReleaseIndexSchema, modpackReleaseSchema } from '../modpack-releases.schemas';

const release = {
  version: '0.2.0',
  publishedAt: '2026-09-27T12:00:00.000Z',
  games: ['1.46.*'],
  packages: [
    {
      id: 'core',
      file: 'net.triotmetki.core_0.2.0.mtmod',
      url: 'https://cdn.triotmetki.ru/modpack/0.2.0/net.triotmetki.core_0.2.0.mtmod',
      sha256: 'a'.repeat(64),
      size: 1_024
    }
  ],
  signature: 'c2lnbmF0dXJl'
};

describe('modpackReleaseSchema', () => {
  it('accepts a release with https packages and their hashes', () => {
    expect(modpackReleaseSchema.safeParse(release).success).toBe(true);
  });

  it('refuses an unsigned release', () => {
    expect(modpackReleaseSchema.safeParse({ ...release, signature: '' }).success).toBe(false);
  });

  it('refuses a package served over plain http', () => {
    const packages = [{ ...release.packages[0], url: 'http://cdn.triotmetki.ru/core.mtmod' }];

    expect(modpackReleaseSchema.safeParse({ ...release, packages }).success).toBe(false);
  });

  it('refuses a package file name that leaves its folder', () => {
    const packages = [{ ...release.packages[0], file: '../core.mtmod' }];

    expect(modpackReleaseSchema.safeParse({ ...release, packages }).success).toBe(false);
  });

  it('refuses a game pattern that is not a dotted version', () => {
    expect(modpackReleaseSchema.safeParse({ ...release, games: ['latest'] }).success).toBe(false);
  });
});

describe('modpackReleaseIndexSchema', () => {
  it('accepts an empty index before the first release', () => {
    expect(modpackReleaseIndexSchema.safeParse({ schemaVersion: 1, releases: [] }).success).toBe(true);
  });

  it('refuses an unknown index version', () => {
    expect(modpackReleaseIndexSchema.safeParse({ schemaVersion: 2, releases: [] }).success).toBe(false);
  });
});

describe('modpackLatestQuerySchema', () => {
  it('accepts the client version the manager reads from version.xml', () => {
    expect(modpackLatestQuerySchema.parse({ game: ' 1.46.0.0 ' })).toEqual({ game: '1.46.0.0' });
  });

  it('refuses a version with anything but digits and dots', () => {
    expect(modpackLatestQuerySchema.safeParse({ game: '1.46.0.0; drop' }).success).toBe(false);
  });
});
