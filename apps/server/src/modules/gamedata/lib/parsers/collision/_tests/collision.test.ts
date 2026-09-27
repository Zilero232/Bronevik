import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { COLLISION_FIXTURES, readFixture } from '../../../_tests/fixtures';
import { parseCollision, parseModelIndex } from '../collision';

const RAW = z.record(z.string(), z.unknown()).parse(JSON.parse(readFixture(COLLISION_FIXTURES.collision)));

const withHull = (hull: unknown) => JSON.stringify({ ...RAW, parts: { Hull: hull } });

describe('parseCollision', () => {
  it('reads parts, armor, spaced plates, modules and mounts and drops unknown keys', () => {
    const collision = parseCollision(readFixture(COLLISION_FIXTURES.collision));

    expect(Object.keys(collision.parts)).toEqual(['Hull', 'Chassis', 'Turret_01', 'Turret_02', 'Gun_01', 'Gun_10']);
    expect(collision.spaced.Gun_01).toEqual(['armor_1']);
    expect(collision.hullPosition).toEqual([0, 0.8, 0]);
    expect(collision.mounts.guns.Turret_02).toEqual([0, 0.25, 0.9]);
    expect(collision.mounts).not.toHaveProperty('sweep');
  });

  it('fills the optional blocks with empty defaults', () => {
    const collision = parseCollision(JSON.stringify({ parts: {} }));

    expect(collision).toMatchObject({ armor: {}, spaced: {}, modules: {}, mounts: { guns: {}, pitch: {} } });
  });

  it('refuses an index that points past the vertex list', () => {
    expect(() => parseCollision(withHull({ positions: [0, 0, 0, 1, 0, 0, 0, 1, 0], indices: [0, 1, 3], groups: [] }))).toThrow(/past the vertex/);
  });

  it('refuses a group that splits a triangle or runs past the index list', () => {
    const positions = [0, 0, 0, 1, 0, 0, 0, 1, 0];

    expect(() => parseCollision(withHull({ positions, indices: [0, 1, 2], groups: [{ name: 'armor_1', start: 1, count: 3 }] }))).toThrow();
    expect(() => parseCollision(withHull({ positions, indices: [0, 1, 2], groups: [{ name: 'armor_1', start: 0, count: 6 }] }))).toThrow();
  });

  it('refuses positions that are not xyz triples', () => {
    expect(() => parseCollision(withHull({ positions: [0, 0], indices: [], groups: [] }))).toThrow();
  });
});

describe('parseModelIndex', () => {
  it('maps vehicle tags, clones included, to nation folders', () => {
    const index = parseModelIndex(readFixture(COLLISION_FIXTURES.index));

    expect(index.R01_IS_IGR).toBe(index.R01_IS);
    expect(index['R45_IS-7']).toBe('russian/R45_IS-7');
  });

  it('refuses a folder that escapes the vehicles tree', () => {
    expect(() => parseModelIndex(JSON.stringify({ R01_IS: '../../etc' }))).toThrow();
  });
});

// Real «Мир танков» data: unicum-gg/wot.models@Lesta 63471c1 (1.45.0.5231), R230_Maus trimmed to hull and chassis.
// The thicknesses are the ones in wot.src@RU ussr/R230_Maus.xml; R230_Maus and the other Lesta-only tags do not exist in the Wargaming client.
describe('Мир танков collision data', () => {
  it('parses a Lesta-only vehicle and names every hull group after an XML plate', () => {
    const collision = parseCollision(readFixture(COLLISION_FIXTURES.mtCollision));
    const plates = new Set(collision.parts.Hull?.groups.map((group) => group.name));

    expect(Object.keys(collision.parts)).toEqual(['Hull', 'Chassis']);
    expect([...plates].filter((plate) => plate.startsWith('armor_')).every((plate) => plate in (collision.armor.Hull ?? {}))).toBe(true);
    expect(plates).toContain('surveyingDevice');
    expect(collision.armor.Hull).toMatchObject({ armor_1: 200, armor_3: 185, armor_4: 160, armor_15: 0 });
    expect(collision.armor.Chassis).toEqual({ leftTrack: 50, rightTrack: 50 });
    expect(collision.spaced.Hull).toContain('armor_2');
    expect(collision.modules).toEqual({ hull: 'Hull', Chassis_R230_Maus: 'Chassis' });
  });

  it('indexes Lesta-only vehicles under the mirror nation folders', () => {
    const index = parseModelIndex(readFixture(COLLISION_FIXTURES.mtIndex));

    expect(index).toMatchObject({
      R230_Maus: 'russian/R230_Maus',
      R239_ST_Molot: 'russian/R239_ST_Molot',
      Un02_Merkava_LP: 'intunion/Un02_Merkava_LP',
      Ch76_HSD_1: 'chinese/Ch76_HSD_1'
    });
  });
});
