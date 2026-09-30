import { MOD_SYNC } from '@otmetki/schemas';
import { sortBy, takeLast } from 'remeda';

import type { ClampStateInput, NormalizeLibraryInput, SyncEntry, SyncState, WriteLibraryInput } from './library-merge.types';

const timeOf = (value: number | null): number => value ?? 0;

const clampTo =
  (nowSeconds: number) =>
  (value: number): number =>
    value > nowSeconds + MOD_SYNC.clockSkewSeconds ? nowSeconds : value;

const clampState = <T extends SyncEntry>({ state, now }: ClampStateInput<T>): SyncState<T> => {
  const clamp = clampTo(now.getTime() / 1000);

  return {
    items: state.items.map((item) => ({
      ...item,
      created: item.created === null ? null : clamp(item.created),
      updated: item.updated === null ? null : clamp(item.updated)
    })),
    deleted: state.deleted.map((tombstone) => ({ ...tombstone, deleted: clamp(tombstone.deleted) }))
  };
};

const latestById = <T extends SyncEntry>(items: readonly T[]): T[] => {
  const byId = new Map<string, T>();

  for (const item of items) {
    const current = byId.get(item.id);

    if (!current || timeOf(item.updated) >= timeOf(current.updated)) {
      byId.set(item.id, item);
    }
  }

  return [...byId.values()];
};

const latestTombstones = (tombstones: SyncState<SyncEntry>['deleted']): SyncState<SyncEntry>['deleted'] => {
  const byId = new Map<string, number>();

  for (const { id, deleted } of tombstones) {
    byId.set(id, Math.max(deleted, byId.get(id) ?? deleted));
  }

  return [...byId].map(([id, deleted]) => ({ id, deleted }));
};

export const emptyLibrary = <T extends SyncEntry>(): SyncState<T> => ({ items: [], deleted: [] });

export const normalizeLibrary = <T extends SyncEntry>({ state, limit }: NormalizeLibraryInput<T>): SyncState<T> => {
  const deleted = takeLast(
    sortBy(
      latestTombstones(state.deleted),
      (tombstone) => tombstone.deleted,
      (tombstone) => tombstone.id
    ),
    MOD_SYNC.maxTombstones
  );

  const removedAt = new Map(deleted.map((tombstone) => [tombstone.id, tombstone.deleted]));

  const alive = latestById(state.items).filter((item) => {
    const removed = removedAt.get(item.id);

    return removed === undefined || removed < timeOf(item.updated);
  });

  const newest = sortBy(alive, [(item) => timeOf(item.updated), 'desc'], [(item) => timeOf(item.created), 'desc'], (item) => item.id).slice(0, limit);

  return {
    items: sortBy(
      newest,
      (item) => timeOf(item.created),
      (item) => item.id
    ),
    deleted
  };
};

export const writeLibrary = <T extends SyncEntry>({ stored, incoming, mode, limit, now }: WriteLibraryInput<T>): SyncState<T> => {
  const fresh = clampState({ state: incoming, now });

  if (mode === 'replace') {
    return normalizeLibrary({ state: fresh, limit });
  }

  return normalizeLibrary({ state: { items: [...stored.items, ...fresh.items], deleted: [...stored.deleted, ...fresh.deleted] }, limit });
};
