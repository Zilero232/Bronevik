import { describe, expect, it } from 'vitest';

import { boardSummary } from '../board-summary';

describe('boardSummary', () => {
  it('counts nothing on an empty board', () => {
    expect(boardSummary({ layers: [] })).toEqual({ layers: 0, strokes: 0, icons: 0 });
  });

  it('adds strokes and icons across every layer', () => {
    const summary = boardSummary({
      layers: [
        {
          id: 'a',
          name: 'A',
          visible: true,
          strokes: [{ id: 's1', tool: 'pen', color: '#fff', width: 2, points: [0, 0, 1, 1] }],
          icons: [{ id: 'i1', kind: 'flag', team: 0, x: 1, y: 1, rotation: 0 }]
        },
        { id: 'b', name: 'B', visible: false, strokes: [], icons: [{ id: 'i2', kind: 'SPG', team: 1, x: 2, y: 2, rotation: 0 }] }
      ]
    });

    expect(summary).toEqual({ layers: 2, strokes: 1, icons: 2 });
  });
});
