import type { ArmorPieceGeometry } from '@otmetki/gamedata';

import { PENETRATION } from '@otmetki/gamedata';
import { describe, expect, it } from 'vitest';

import type { ScenePart } from '../../scene-parts';

import { ARMOR_ZONES } from '../../../config';
import { zoneHits, zoneReports } from '../zone-armor';

const CUBE: ArmorPieceGeometry = {
  name: 'Hull',
  kind: 'hull',
  positions: new Float32Array([-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1]),
  indices: new Uint32Array([4, 5, 6, 4, 6, 7, 0, 2, 1, 0, 3, 2, 1, 2, 6, 1, 6, 5, 0, 4, 7, 0, 7, 3, 3, 7, 6, 3, 6, 2, 0, 1, 5, 0, 5, 4]),
  groups: [
    { plate: 'front', start: 0, count: 6 },
    { plate: 'rear', start: 6, count: 6 },
    { plate: 'side', start: 12, count: 12 },
    { plate: 'roof', start: 24, count: 12 }
  ]
};

const PLATES = [
  { name: 'front', thickness: 120, flags: 0 },
  { name: 'rear', thickness: 40, flags: 0 },
  { name: 'side', thickness: 80, flags: 0 },
  { name: 'roof', thickness: 20, flags: 0 }
];

const HULL: ScenePart = { layer: 'hull', piece: CUBE, plates: PLATES, position: [0, 0, 0] };

const SHELL = { shell: { kind: 'ARMOR_PIERCING', caliber: 30, penetration: 80 }, randomness: PENETRATION.randomness } as const;

describe('zoneHits', () => {
  it('casts one ray per side at every piece the model shows, and skips a missing turret', () => {
    const zones = zoneHits({ parts: [HULL] });

    expect(zones.map(({ layer, side }) => `${layer}.${side}`)).toEqual(ARMOR_ZONES.sideOrder.map((side) => `hull.${side}`));
  });

  it('meets the plate that faces each side first', () => {
    const reports = zoneReports({ zones: zoneHits({ parts: [HULL] }), ...SHELL, hideSpaced: false });

    expect(reports.map(({ report }) => report?.first.plate)).toEqual(['front', 'side', 'rear']);
  });

  it('keeps the offset of a mounted piece', () => {
    const moved = { ...HULL, position: [0, 5, 0] } satisfies ScenePart;
    const [front] = zoneReports({ zones: zoneHits({ parts: [moved] }), ...SHELL, hideSpaced: false });

    expect(front.report?.first.plate).toBe('front');
  });
});

describe('zoneReports', () => {
  it('rates a head-on plate by its nominal thickness against the chosen shell', () => {
    const [front, side, rear] = zoneReports({ zones: zoneHits({ parts: [HULL] }), ...SHELL, hideSpaced: false });

    expect(front.report?.first.effective).toBeCloseTo(PLATES[0].thickness);
    expect(front.report?.verdict).toBe('noPen');
    expect(side.report?.verdict).toBe('chance');
    expect(rear.report?.verdict).toBe('pen');
  });
});
