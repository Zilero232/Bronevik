import { describe, expect, it } from 'vitest';

import type { UiFeed } from '../../../../../shared/api/protocol';

import { applyFeed } from '../apply-feed';

const item = (id: string, damage = 1000) => ({ id, damage });

const snapshot: UiFeed = {
  v: 2,
  feed: 'replay_manager',
  rev: 4,
  base: null,
  page: { kind: 'replays', status: 'indexing' },
  items: [item('a'), item('b'), item('c')]
};

const delta = (values: Partial<UiFeed>): UiFeed => ({
  v: 2,
  feed: 'replay_manager',
  rev: 5,
  base: 4,
  page: { kind: 'replays', status: 'ready' },
  ...values
});

describe(applyFeed, () => {
  it('takes a snapshot whatever it held', () => {
    const held = applyFeed({ held: null, message: snapshot });

    expect(held).toEqual({ component: 'replay_manager', rev: 4, page: snapshot.page, items: snapshot.items });
    expect(applyFeed({ held: { component: 'other', rev: 9, page: null, items: [] }, message: snapshot })?.rev).toBe(4);
  });

  it('patches the items it holds: changed in place, new at the end, removed dropped, the rest untouched', () => {
    const held = applyFeed({ held: null, message: snapshot });
    const next = applyFeed({ held, message: delta({ set: [item('b', 2500), item('d')], del: ['a'] }) });

    expect(next?.items).toEqual([item('b', 2500), item('c'), item('d')]);
    expect(next?.items[1]).toBe(held?.items[2]);
    expect(next?.page).toEqual({ kind: 'replays', status: 'ready' });
    expect(next?.rev).toBe(5);
  });

  it('keeps what it holds for a message it already has', () => {
    const held = applyFeed({ held: null, message: snapshot });

    expect(applyFeed({ held, message: snapshot })).toBe(held);
  });

  it('asks for a snapshot (null) when a delta builds on a revision it does not hold', () => {
    const held = applyFeed({ held: null, message: snapshot });

    expect(applyFeed({ held, message: delta({ rev: 7, base: 6, set: [] }) })).toBeNull();
    expect(applyFeed({ held: null, message: delta({ set: [] }) })).toBeNull();
  });
});
