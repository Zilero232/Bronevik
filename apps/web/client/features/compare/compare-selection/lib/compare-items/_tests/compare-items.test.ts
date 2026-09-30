import { describe, expect, it } from 'vitest';

import type { CompareEntry, CompareSelection, CompareTank } from '../compare-items.types';

import { COMPARE_SELECTION, COMPARE_TARGET, NO_COMPARE_SELECTION } from '../../../config';
import { clearCompareKind, compareHref, hasCompareEntry, parseCompareSelection, removeCompareEntry, toggleCompareEntry } from '../compare-items';

const vehicle = (tankId: number): CompareTank => ({
  tankId,
  name: `Tank ${tankId}`,
  shortName: `T${tankId}`,
  slug: `tank-${tankId}`,
  nation: 'ussr',
  type: 'heavyTank',
  tier: 10,
  isPremium: false,
  images: { small: null, contour: null, big: null }
});

const tank = (tankId: number): CompareEntry => ({ kind: 'tank', item: vehicle(tankId) });

const player = (accountId: number): CompareEntry => ({ kind: 'player', item: { accountId, nickname: `player_${accountId}` } });

const fill = (count: number): CompareSelection =>
  Array.from({ length: count }, (_, index) => index + 1).reduce(
    (selection, id) => toggleCompareEntry({ selection, entry: player(id) }),
    NO_COMPARE_SELECTION
  );

describe('toggleCompareEntry', () => {
  it('adds an entry of its own kind, makes that kind active and removes it on the second toggle', () => {
    const added = toggleCompareEntry({ selection: NO_COMPARE_SELECTION, entry: tank(1) });

    expect(added.tank.map(({ tankId }) => tankId)).toEqual([1]);
    expect(added.player).toEqual([]);
    expect(added.active).toBe('tank');
    expect(hasCompareEntry({ selection: added, entry: tank(1) })).toBe(true);
    expect(hasCompareEntry({ selection: added, entry: player(1) })).toBe(false);
    expect(toggleCompareEntry({ selection: added, entry: tank(1) }).tank).toEqual([]);
  });

  it('stores only the fields the tray draws', () => {
    const summary = { ...vehicle(3), status: 'researchable', isCollectible: false };
    const added = toggleCompareEntry({ selection: NO_COMPARE_SELECTION, entry: { kind: 'tank', item: summary } });

    expect(Object.keys(added.tank[0] ?? {}).sort()).toEqual(Object.keys(vehicle(3)).sort());
  });

  it('stops at the limit of one kind', () => {
    const full = fill(COMPARE_SELECTION.limit);

    expect(full.player).toHaveLength(COMPARE_SELECTION.limit);
    expect(toggleCompareEntry({ selection: full, entry: player(99) })).toBe(full);
    expect(toggleCompareEntry({ selection: full, entry: tank(1) }).tank).toHaveLength(1);
  });
});

describe('removeCompareEntry and clearCompareKind', () => {
  it('removes one entry or a whole kind', () => {
    const selection = toggleCompareEntry({ selection: fill(3), entry: tank(7) });

    expect(removeCompareEntry({ selection, kind: 'player', id: 2 }).player.map(({ accountId }) => accountId)).toEqual([1, 3]);
    expect(clearCompareKind({ selection, kind: 'player' })).toEqual({ ...selection, player: [] });
  });
});

describe('parseCompareSelection', () => {
  it('drops stored values that do not match the contract', () => {
    expect(parseCompareSelection(null)).toEqual(NO_COMPARE_SELECTION);

    expect(parseCompareSelection({ tank: 'x', player: [{ accountId: 5, nickname: 'five' }], active: 'player' })).toEqual({
      tank: [],
      player: [{ accountId: 5, nickname: 'five' }],
      active: 'player'
    });
  });

  it('keeps at most the limit of each kind', () => {
    const stored = { tank: [], player: Array.from({ length: 15 }, (_, index) => ({ accountId: index + 1, nickname: `p${index}` })) };

    expect(parseCompareSelection(stored).player).toHaveLength(COMPARE_SELECTION.limit);
  });
});

describe('compareHref', () => {
  it('opens the compare page with the first ids it can hold', () => {
    const ids = Array.from({ length: 10 }, (_, index) => index + 1);

    expect(compareHref({ kind: 'tank', ids })).toEqual({
      pathname: COMPARE_TARGET.tank.route,
      query: { ids: ids.slice(0, COMPARE_TARGET.tank.max).join(',') }
    });

    expect(compareHref({ kind: 'player', ids: [4, 2] }).query.ids).toBe('4,2');
  });
});
