import { MODPACK_RELEASES } from '@otmetki/schemas';

export const MODPACK_RELEASES_SOURCE = {
  indexPath: 'downloads/releases.json',
  files: { modpack: 'otmetki.mtmod', manager: 'otmetki-manager-setup.exe' },
  emptyIndex: { schemaVersion: MODPACK_RELEASES.indexSchemaVersion, releases: [] },
  cacheTtlMs: 60_000,
  retryDelayMs: 60_000
} as const;
