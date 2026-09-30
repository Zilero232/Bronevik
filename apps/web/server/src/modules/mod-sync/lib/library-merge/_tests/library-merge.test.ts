import type { ModComponentSet, ModSyncProfile } from '@otmetki/schemas';

import { MOD_SYNC } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { SyncState } from '../library-merge.types';

import { emptyLibrary, normalizeLibrary, writeLibrary } from '../library-merge';

const NOW = new Date('2026-09-30T12:00:00.000Z');
const NOW_SECONDS = NOW.getTime() / 1000;
const LIMIT = MOD_SYNC.maxSets;

const set = (id: string, times: { created?: number; updated?: number } = {}, components: string[] = ['core']): ModComponentSet => ({
  id,
  name: id,
  components,
  created: times.created ?? 1_000,
  updated: times.updated ?? 1_000
});

const library = (items: ModComponentSet[], deleted: SyncState<ModComponentSet>['deleted'] = []): SyncState<ModComponentSet> => ({ items, deleted });

const merge = (stored: SyncState<ModComponentSet>, incoming: SyncState<ModComponentSet>) =>
  writeLibrary({ stored, incoming, mode: 'merge', limit: LIMIT, now: NOW });

describe('writeLibrary', () => {
  it('keeps the copy of a set with the later update time, whichever side sent it', () => {
    const stored = library([set('a', { updated: 2_000 }, ['stored'])]);

    expect(merge(stored, library([set('a', { updated: 1_500 }, ['older'])])).items[0]?.components).toEqual(['stored']);
    expect(merge(stored, library([set('a', { updated: 2_500 }, ['newer'])])).items[0]?.components).toEqual(['newer']);
  });

  it('keeps the sets only one side knows about', () => {
    const merged = merge(library([set('a')]), library([set('b')]));

    expect(merged.items.map((item) => item.id)).toEqual(['a', 'b']);
  });

  it('removes a set whose tombstone is as new as its last update, and keeps one edited after it', () => {
    const stored = library([set('gone', { updated: 2_000 }), set('edited', { updated: 3_000 })]);
    const merged = merge(
      stored,
      library(
        [],
        [
          { id: 'gone', deleted: 2_000 },
          { id: 'edited', deleted: 2_500 }
        ]
      )
    );

    expect(merged.items.map((item) => item.id)).toEqual(['edited']);
  });

  it('merges tombstones by id keeping the latest deletion time', () => {
    const merged = merge(library([], [{ id: 'x', deleted: 3_000 }]), library([], [{ id: 'x', deleted: 2_000 }]));

    expect(merged.deleted).toEqual([{ id: 'x', deleted: 3_000 }]);
  });

  it('keeps the most recently updated sets up to the limit and lists them by creation time', () => {
    const sets = Array.from({ length: LIMIT + 2 }, (_, index) => set(`s${index}`, { created: 10_000 - index, updated: 1_000 + index }));
    const merged = merge(emptyLibrary(), library(sets));
    const kept = sets.slice(2);

    expect(merged.items.map((item) => item.id).toSorted()).toEqual(kept.map((item) => item.id).toSorted());
    expect(merged.items.map((item) => item.created)).toEqual(kept.map((item) => item.created).toSorted((left, right) => left - right));
  });

  it('keeps only the newest tombstones, oldest first', () => {
    const tombstones = Array.from({ length: MOD_SYNC.maxTombstones + 5 }, (_, index) => ({ id: `t${index}`, deleted: index }));
    const merged = merge(emptyLibrary(), library([], tombstones.toReversed()));

    expect(merged.deleted).toEqual(tombstones.slice(5));
  });

  it('pulls a timestamp from a clock running ahead back to the present', () => {
    const ahead = NOW_SECONDS + MOD_SYNC.clockSkewSeconds + 1;
    const merged = merge(emptyLibrary(), library([set('a', { created: ahead, updated: ahead })], [{ id: 'b', deleted: ahead }]));

    expect(merged.items[0]).toMatchObject({ created: NOW_SECONDS, updated: NOW_SECONDS });
    expect(merged.deleted).toEqual([{ id: 'b', deleted: NOW_SECONDS }]);
  });

  it('trusts a timestamp within the allowed clock skew', () => {
    const ahead = NOW_SECONDS + MOD_SYNC.clockSkewSeconds;

    expect(merge(emptyLibrary(), library([set('a', { updated: ahead })])).items[0]?.updated).toBe(ahead);
  });

  it('replaces the stored library with the incoming one in replace mode', () => {
    const replaced = writeLibrary({
      stored: library([set('a', { updated: 9_000 })], [{ id: 'z', deleted: 5 }]),
      incoming: library([set('b')]),
      mode: 'replace',
      limit: LIMIT,
      now: NOW
    });

    expect(replaced).toEqual(library([set('b')]));
  });

  it('returns the stored library unchanged when merging nothing new into it', () => {
    const stored = normalizeLibrary({
      state: library([set('b', { created: 5 }), set('a', { created: 9 })], [{ id: 'c', deleted: 1 }]),
      limit: LIMIT
    });

    expect(merge(stored, library([set('a', { created: 9 })]))).toEqual(stored);
  });

  it('treats a profile never saved with a time as the oldest copy', () => {
    const profile = (updated: number | null, name: string): ModSyncProfile => ({
      id: 'p',
      name,
      created: null,
      updated,
      data: { config: {}, components: {} }
    });

    const merged = writeLibrary({
      stored: { items: [profile(null, 'untimed')], deleted: [] },
      incoming: { items: [profile(1, 'timed')], deleted: [] },
      mode: 'merge',
      limit: MOD_SYNC.maxProfiles,
      now: NOW
    });

    expect(merged.items.map((item) => item.name)).toEqual(['timed']);
  });
});
