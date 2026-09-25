import { mapDetailSchema, mapListSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { mockMap, mockMaps } from '../maps.mock';

const MAPS = mockMaps();

describe('maps mocks', () => {
  it('answer the map list in the shape the API contract promises', () => {
    expect(() => mapListSchema.parse(MAPS)).not.toThrow();
  });

  it('answer every map detail in the contract shape', () => {
    MAPS.forEach(({ slug }) => expect(() => mapDetailSchema.parse(mockMap(slug))).not.toThrow());
  });

  it('find a map by its arena id and by its slug alike', () => {
    MAPS.forEach(({ arenaId, slug }) => expect(mockMap(arenaId)).toEqual(mockMap(slug)));
  });

  it('report an unknown map as missing', () => {
    expect(mockMap('nowhere')).toBeNull();
  });

  it('give every listed mode a playable layout in the detail', () => {
    MAPS.forEach(({ slug, modes }) => expect(mockMap(slug)?.gameModes.map(({ mode }) => mode)).toEqual(modes));
  });

  it('cover a map without collected battles', () => {
    expect(MAPS.some(({ slug }) => mockMap(slug)?.stats === null)).toBe(true);
  });

  it('cover a map without an image and one without a camouflage', () => {
    expect(MAPS.some(({ image }) => image === null)).toBe(true);
    expect(MAPS.some(({ camouflage }) => camouflage === null)).toBe(true);
  });

  it('keep team win rates of a map inside one hundred percent together', () => {
    MAPS.forEach(({ slug }) => {
      const teams = mockMap(slug)?.stats?.teams ?? [];

      expect(teams.reduce((sum, { winRate }) => sum + (winRate ?? 0), 0)).toBeLessThanOrEqual(100);
    });
  });

  it('narrow the list to maps that support the requested mode', () => {
    const [first] = MAPS;
    const mode = first?.modes.at(-1) ?? '';

    mockMaps({ mode }).forEach(({ modes }) => expect(modes).toContain(mode));
  });
});
