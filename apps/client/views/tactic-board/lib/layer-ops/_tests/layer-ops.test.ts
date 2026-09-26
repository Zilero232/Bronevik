import { describe, expect, it } from 'vitest';

import type { TacticIcon, TacticLayer, TacticStroke } from '@/shared/api/tactics';

import { BOARD, BOARD_LIMITS } from '../../../config';
import {
  addIcon,
  addStroke,
  canAddIcon,
  canAddLayer,
  canAddStroke,
  clearLayer,
  createLayer,
  hasItem,
  moveIcon,
  removeItem,
  renameLayer,
  shiftStroke,
  toggleLayer
} from '../layer-ops';

const STROKE: TacticStroke = { id: 's1', tool: 'line', color: '#fff', width: 2, points: [10, 10, 50, 50] };
const ICON: TacticIcon = { id: 'i1', kind: 'heavyTank', team: 1, x: 100, y: 100, rotation: 0 };
const LAYER: TacticLayer = { id: 'l1', name: 'Plan', visible: true, strokes: [STROKE], icons: [ICON] };

describe('createLayer', () => {
  it('starts visible and empty', () => {
    expect(createLayer({ id: 'x', name: 'Layer' })).toEqual({ id: 'x', name: 'Layer', visible: true, strokes: [], icons: [] });
  });

  it('cuts the name to the server limit', () => {
    expect(createLayer({ id: 'x', name: 'n'.repeat(100) }).name).toHaveLength(BOARD_LIMITS.layerName);
  });
});

describe('addStroke and addIcon', () => {
  it('append without touching the original layer', () => {
    const next = addIcon({ layer: addStroke({ layer: LAYER, stroke: { ...STROKE, id: 's2' } }), icon: { ...ICON, id: 'i2' } });

    expect(next.strokes).toHaveLength(2);
    expect(next.icons).toHaveLength(2);
    expect(LAYER.strokes).toHaveLength(1);
  });
});

describe('removeItem', () => {
  it('removes a stroke by id', () => {
    expect(hasItem({ layer: removeItem({ layer: LAYER, itemId: 's1' }), itemId: 's1' })).toBe(false);
  });

  it('removes an icon by id and keeps strokes', () => {
    const next = removeItem({ layer: LAYER, itemId: 'i1' });

    expect(next.icons).toHaveLength(0);
    expect(next.strokes).toHaveLength(1);
  });
});

describe('shiftStroke', () => {
  it('moves only the targeted stroke', () => {
    expect(shiftStroke({ layer: LAYER, itemId: 's1', dx: 5, dy: 10 }).strokes[0]?.points).toEqual([15, 20, 55, 60]);
  });
});

describe('moveIcon', () => {
  it('keeps a dragged icon on the board', () => {
    expect(moveIcon({ layer: LAYER, itemId: 'i1', x: BOARD.size + 100, y: -3 }).icons[0]).toMatchObject({ x: BOARD.size, y: 0 });
  });
});

describe('clearLayer', () => {
  it('empties the layer but keeps its identity', () => {
    expect(clearLayer(LAYER)).toEqual({ ...LAYER, strokes: [], icons: [] });
  });
});

describe('renameLayer', () => {
  it('trims whitespace', () => {
    expect(renameLayer({ layer: LAYER, name: '  Flank  ' }).name).toBe('Flank');
  });
});

describe('toggleLayer', () => {
  it('flips visibility', () => {
    expect(toggleLayer(LAYER).visible).toBe(false);
  });
});

describe('limits', () => {
  it('refuses a layer past the layer limit', () => {
    const layers = Array.from({ length: BOARD_LIMITS.layers }, (_, index) => createLayer({ id: String(index), name: '' }));

    expect(canAddLayer(layers)).toBe(false);
    expect(canAddLayer(layers.slice(1))).toBe(true);
  });

  it('refuses a stroke past the stroke limit', () => {
    const strokes = Array.from({ length: BOARD_LIMITS.strokes }, (_, index) => ({ ...STROKE, id: String(index) }));

    expect(canAddStroke({ ...LAYER, strokes })).toBe(false);
    expect(canAddStroke(LAYER)).toBe(true);
  });

  it('refuses an icon past the icon limit', () => {
    const icons = Array.from({ length: BOARD_LIMITS.icons }, (_, index) => ({ ...ICON, id: String(index) }));

    expect(canAddIcon({ ...LAYER, icons })).toBe(false);
  });
});
