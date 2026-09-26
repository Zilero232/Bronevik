import { describe, expect, it } from 'vitest';
import * as Y from 'yjs';

import { boardIdOf, boardSnapshot, encodeBoard, readBoardData, restoreBoard, seedBoardDocument } from '../board-document';

const data = readBoardData({
  layers: [{ id: 'l1', name: 'Plan A', strokes: [{ id: 's1', tool: 'arrow', color: '#f00', width: 3, points: [0, 0, 10, 10] }], icons: [] }]
});

describe('seedBoardDocument', () => {
  it('fills an empty document once and survives an encode/restore round trip', () => {
    const document = new Y.Doc();

    seedBoardDocument({ document, data });
    seedBoardDocument({ document, data });

    const copy = new Y.Doc();

    restoreBoard({ document: copy, state: encodeBoard(document) });

    expect(boardSnapshot(copy)).toEqual(data);
  });
});

describe('boardSnapshot', () => {
  it('returns null when collaborators wrote something that is not a board', () => {
    const document = new Y.Doc();

    document.getArray('layers').push([{ id: 1 }]);

    expect(boardSnapshot(document)).toBeNull();
  });
});

describe('readBoardData', () => {
  it('falls back to an empty board for a malformed stored value', () => {
    expect(readBoardData('garbage')).toEqual({ layers: [] });
  });
});

describe('boardIdOf', () => {
  it('only accepts its own prefix with a uuid', () => {
    const id = '0b0f9a6e-9a36-4f59-8a61-1d1a4b6a0c11';

    expect(boardIdOf({ prefix: 'board:', name: `board:${id}` })).toBe(id);
    expect(boardIdOf({ prefix: 'board:', name: `other:${id}` })).toBeNull();
    expect(boardIdOf({ prefix: 'board:', name: 'board:../../etc' })).toBeNull();
  });
});
