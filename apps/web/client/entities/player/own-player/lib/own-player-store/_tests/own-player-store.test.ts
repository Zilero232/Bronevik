import { afterEach, describe, expect, it } from 'vitest';

import { OWN_PLAYER } from '../../../config';
import { forgetOwnPlayer, ownPlayerStore, parseOwnPlayer, rememberOwnPlayer } from '../own-player-store';

afterEach(() => {
  window.localStorage.clear();
});

describe('parseOwnPlayer', () => {
  it('keeps a stored account and drops anything that is not one', () => {
    expect(parseOwnPlayer({ player: { accountId: 3, nickname: 'Three', extra: true } })).toEqual({ player: { accountId: 3, nickname: 'Three' } });
    expect(parseOwnPlayer({ player: { nickname: 'NoId' } })).toEqual({ player: null });
    expect(parseOwnPlayer(null)).toEqual({ player: null });
  });
});

describe('rememberOwnPlayer and forgetOwnPlayer', () => {
  it('stores only the account and the nickname, and forgets them', () => {
    rememberOwnPlayer({ accountId: 5, nickname: 'Five' });

    expect(ownPlayerStore.read().player).toEqual({ accountId: 5, nickname: 'Five' });
    expect(JSON.parse(window.localStorage.getItem(OWN_PLAYER.storageKey) ?? 'null')).toEqual({ player: { accountId: 5, nickname: 'Five' } });

    forgetOwnPlayer();

    expect(window.localStorage.getItem(OWN_PLAYER.storageKey)).toBeNull();
    expect(ownPlayerStore.read().player).toBeNull();
  });
});
