import type { ModpackRelease, ModpackReleaseIndex } from '@otmetki/schemas';

export const release = ({ version, games }: Pick<ModpackRelease, 'games' | 'version'>): ModpackRelease => ({
  version,
  games,
  publishedAt: '2026-09-27T12:00:00.000Z',
  notes: null,
  catalog: null,
  packages: [
    {
      id: 'core',
      file: `net.triotmetki.core_${version}.mtmod`,
      url: `https://cdn.triotmetki.ru/modpack/${version}/net.triotmetki.core_${version}.mtmod`,
      sha256: 'a'.repeat(64),
      size: 1_024
    }
  ],
  signature: 'c2lnbmF0dXJl'
});

export const INDEX: ModpackReleaseIndex = {
  schemaVersion: 1,
  releases: [
    release({ version: '0.1.0', games: ['1.45.*'] }),
    release({ version: '0.2.0', games: ['1.45.*', '1.46.*'] }),
    release({ version: '0.10.0', games: ['1.46.*'] })
  ],
  manager: {
    version: '0.2.0',
    publishedAt: '2026-09-27T12:00:00.000Z',
    notes: 'Fixes',
    platforms: {
      'windows-x86_64': { url: 'https://cdn.triotmetki.ru/manager/0.2.0/setup.exe', signature: 'c2lnbmF0dXJl' }
    }
  }
};
