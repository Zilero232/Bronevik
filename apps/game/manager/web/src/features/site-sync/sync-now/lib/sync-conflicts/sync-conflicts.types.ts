import type { SITE_SYNC } from '@/entities/site-sync';

export type SyncLibrary = (typeof SITE_SYNC.libraries)[number];

export type SyncConflict = {
  library: SyncLibrary;
  localChanges: number;
  remoteChanges: number;
};
