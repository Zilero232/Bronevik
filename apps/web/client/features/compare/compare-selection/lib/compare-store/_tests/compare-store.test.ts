import { afterEach, describe, expect, it } from 'vitest';

import { COMPARE_SELECTION } from '../../../config';
import { clearCompare, compareStore, removeFromCompare, showCompareKind, toggleCompare } from '../compare-store';

afterEach(() => {
  window.localStorage.clear();
});

describe('compare store', () => {
  it('persists the selection and forgets it once both kinds are empty', () => {
    toggleCompare({ kind: 'player', item: { accountId: 1, nickname: 'one' } });
    toggleCompare({ kind: 'player', item: { accountId: 2, nickname: 'two' } });

    expect(JSON.parse(window.localStorage.getItem(COMPARE_SELECTION.storageKey) ?? 'null')).toMatchObject({ active: 'player' });

    removeFromCompare({ kind: 'player', id: 1 });

    expect(compareStore.read().player.map(({ nickname }) => nickname)).toEqual(['two']);

    clearCompare('player');

    expect(window.localStorage.getItem(COMPARE_SELECTION.storageKey)).toBeNull();
  });

  it('switches the kind the tray shows', () => {
    toggleCompare({ kind: 'player', item: { accountId: 1, nickname: 'one' } });
    showCompareKind('tank');

    expect(compareStore.read().active).toBe('tank');
  });
});
