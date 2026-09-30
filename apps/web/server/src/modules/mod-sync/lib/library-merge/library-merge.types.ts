import type { ModSyncMode, ModSyncTombstone } from '@otmetki/schemas';

export type SyncEntry = {
  id: string;
  created: number | null;
  updated: number | null;
};

export type SyncState<T extends SyncEntry> = {
  items: T[];
  deleted: ModSyncTombstone[];
};

export type WriteLibraryInput<T extends SyncEntry> = {
  stored: SyncState<T>;
  incoming: SyncState<T>;
  mode: ModSyncMode;
  limit: number;
  now: Date;
};

export type NormalizeLibraryInput<T extends SyncEntry> = {
  state: SyncState<T>;
  limit: number;
};

export type ClampStateInput<T extends SyncEntry> = {
  state: SyncState<T>;
  now: Date;
};
