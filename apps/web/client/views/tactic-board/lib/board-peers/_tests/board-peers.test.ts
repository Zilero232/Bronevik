import { describe, expect, it } from 'vitest';

import { BOARD_COLORS } from '../../../config';
import { boardPeers, peerColor } from '../board-peers';

describe('peerColor', () => {
  it('always picks a palette colour, even for large ids', () => {
    expect(BOARD_COLORS).toContain(peerColor(4_294_967_295));
  });

  it('gives the same client the same colour', () => {
    expect(peerColor(42)).toBe(peerColor(42));
  });
});

describe('boardPeers', () => {
  it('leaves out the local client', () => {
    const states = new Map([
      [1, { name: 'me' }],
      [2, { name: 'other', cursor: { x: 10, y: 20 } }]
    ]);

    expect(boardPeers({ states, selfId: 1 }).map(({ clientId }) => clientId)).toEqual([2]);
  });

  it('tolerates a peer that sent garbage instead of a cursor', () => {
    const states = new Map<number, Record<string, unknown>>([[2, { name: 5, cursor: 'x' }]]);

    expect(boardPeers({ states, selfId: 1 })[0]).toMatchObject({ name: null, cursor: null });
  });
});
