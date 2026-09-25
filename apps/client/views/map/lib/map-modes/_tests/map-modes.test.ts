import { describe, expect, it } from 'vitest';

import { MAP_MODE_PREFIXES } from '@/entities/map/map';

import { mapModes } from '../map-modes';

const layout = (mode: string) => ({ mode, minimap: `https://example.com/${mode}.webp`, bases: {}, spawns: {}, controlPoints: [] });

describe('mapModes', () => {
  it('puts the standard battle first and unknown modes last', () => {
    const modes = mapModes({
      modes: [],
      gameModes: [layout('frontline'), layout(MAP_MODE_PREFIXES.onslaught), layout(MAP_MODE_PREFIXES.standard)]
    });

    expect(modes.map(({ mode }) => mode)).toEqual([MAP_MODE_PREFIXES.standard, MAP_MODE_PREFIXES.onslaught, 'frontline']);
  });

  it('keeps the minimap of every layout', () => {
    const [first] = mapModes({ modes: [], gameModes: [layout(MAP_MODE_PREFIXES.standard)] });

    expect(first?.minimap).toBe(layout(MAP_MODE_PREFIXES.standard).minimap);
  });

  it('falls back to the listed modes without minimaps when the layouts are missing', () => {
    expect(mapModes({ modes: [MAP_MODE_PREFIXES.standard], gameModes: [] })).toEqual([{ mode: MAP_MODE_PREFIXES.standard, minimap: null }]);
  });

  it('returns nothing for a map without modes', () => {
    expect(mapModes({ modes: [], gameModes: [] })).toEqual([]);
  });
});
