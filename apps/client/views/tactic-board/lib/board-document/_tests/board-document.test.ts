import { describe, expect, it } from 'vitest';
import * as Y from 'yjs';

import type { TacticLayer, TacticStroke } from '@/shared/api/tactics';

import { boardLayersOf, createBoardUndo, deleteLayer, readLayers, writeLayer } from '../board-document';

const layer = (id: string, patch: Partial<TacticLayer> = {}): TacticLayer => ({ id, name: id, visible: true, strokes: [], icons: [], ...patch });

const STROKE: TacticStroke = { id: 's1', tool: 'pen', color: '#fff', width: 2, points: [0, 0, 10, 10] };

const sync = (from: Y.Doc, to: Y.Doc) => Y.applyUpdate(to, Y.encodeStateAsUpdate(from));

describe('readLayers', () => {
  it('drops elements the server schema would reject', () => {
    const doc = new Y.Doc();

    boardLayersOf(doc).push([layer('a'), { id: 'broken', strokes: 'nope' }]);

    expect(readLayers(boardLayersOf(doc)).map(({ id }) => id)).toEqual(['a']);
  });

  it('fills defaults for a layer seeded without optional fields', () => {
    const doc = new Y.Doc();

    boardLayersOf(doc).push([{ id: 'a', name: 'A' }]);

    expect(readLayers(boardLayersOf(doc))[0]).toEqual(layer('a', { name: 'A' }));
  });
});

describe('writeLayer', () => {
  it('replaces a layer in place and keeps the order', () => {
    const doc = new Y.Doc();

    boardLayersOf(doc).push([layer('a'), layer('b'), layer('c')]);
    writeLayer({ doc, layer: layer('b', { name: 'renamed' }) });

    expect(readLayers(boardLayersOf(doc)).map(({ id, name }) => `${id}:${name}`)).toEqual(['a:a', 'b:renamed', 'c:c']);
  });

  it('appends a layer that is not in the document yet', () => {
    const doc = new Y.Doc();

    writeLayer({ doc, layer: layer('a') });

    expect(boardLayersOf(doc).length).toBe(1);
  });

  it('stores plain JSON the server snapshot can read back', () => {
    const doc = new Y.Doc();

    writeLayer({ doc, layer: layer('a', { strokes: [STROKE] }) });

    expect(boardLayersOf(doc).toJSON()).toEqual([layer('a', { strokes: [STROKE] })]);
  });
});

describe('concurrent edits of one layer', () => {
  const concurrent = () => {
    const left = new Y.Doc();
    const right = new Y.Doc();

    boardLayersOf(left).push([layer('a')]);
    sync(left, right);
    writeLayer({ doc: left, layer: layer('a', { strokes: [STROKE] }) });
    writeLayer({ doc: right, layer: layer('a', { icons: [{ id: 'i1', kind: 'flag', team: 0, x: 5, y: 5, rotation: 0 }] }) });
    sync(left, right);
    sync(right, left);

    return { left, right };
  };

  it('shows both edits instead of dropping one', () => {
    const { left } = concurrent();
    const [merged] = readLayers(boardLayersOf(left));

    expect(merged?.strokes).toHaveLength(1);
    expect(merged?.icons).toHaveLength(1);
  });

  it('collapses the duplicate copies on the next write', () => {
    const { left } = concurrent();
    const [merged] = readLayers(boardLayersOf(left));

    if (merged) {
      writeLayer({ doc: left, layer: merged });
    }

    expect(boardLayersOf(left).length).toBe(1);
  });
});

describe('deleteLayer', () => {
  it('removes only the targeted layer', () => {
    const doc = new Y.Doc();

    boardLayersOf(doc).push([layer('a'), layer('b')]);
    deleteLayer({ doc, layerId: 'a' });

    expect(readLayers(boardLayersOf(doc)).map(({ id }) => id)).toEqual(['b']);
  });
});

describe('createBoardUndo', () => {
  it('restores the previous version of an edited layer', () => {
    const doc = new Y.Doc();

    boardLayersOf(doc).push([layer('a')]);

    const undo = createBoardUndo(doc);

    writeLayer({ doc, layer: layer('a', { strokes: [STROKE] }) });
    undo.undo();

    expect(readLayers(boardLayersOf(doc))[0]?.strokes).toEqual([]);
  });

  it('does not undo an edit that came from another client', () => {
    const local = new Y.Doc();
    const remote = new Y.Doc();
    const undo = createBoardUndo(local);

    writeLayer({ doc: remote, layer: layer('remote') });
    Y.applyUpdate(local, Y.encodeStateAsUpdate(remote), 'provider');
    undo.undo();

    expect(readLayers(boardLayersOf(local)).map(({ id }) => id)).toEqual(['remote']);
  });
});
