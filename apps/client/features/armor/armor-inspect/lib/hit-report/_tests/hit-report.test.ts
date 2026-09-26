import { ARMOR_FLAGS, SHELL_RULES } from '@bronevik/gamedata';
import { describe, expect, it } from 'vitest';

import { describeHit } from '../hit-report';

const AP = { kind: 'ARMOR_PIERCING', caliber: 122, penetration: 200 } as const;
const HEAT = { kind: 'HOLLOW_CHARGE', caliber: 122, penetration: 300 } as const;

const SKIRT = { piece: 'Hull', plate: 'armor_14', thickness: 30, flags: ARMOR_FLAGS.spaced, angle: 0, distance: 4 };
const SIDE = { piece: 'Hull', plate: 'armor_6', thickness: 100, flags: 0, angle: 0, distance: 4.5 };

describe('describeHit', () => {
  it('returns nothing when the ray hits no armor', () => {
    expect(describeHit({ layers: [], shell: AP, randomness: 0.25 })).toBeNull();
  });

  it('reports the first plate and the total through spaced and main armor', () => {
    const report = describeHit({ layers: [SKIRT, SIDE], shell: AP, randomness: 0.25 });

    expect(report?.first.plate).toBe(SKIRT.plate);
    expect(report?.main?.plate).toBe(SIDE.plate);
    expect(report?.total).toBe(SKIRT.thickness + SIDE.thickness);
    expect(report?.layerCount).toBe(2);
  });

  it('turns the distance between hits into the gap the HEAT jet loses over', () => {
    const close = describeHit({ layers: [SKIRT, { ...SIDE, distance: SKIRT.distance + 0.1 }], shell: HEAT, randomness: 0 });
    const far = describeHit({ layers: [SKIRT, { ...SIDE, thickness: 230, distance: SKIRT.distance + 1 }], shell: HEAT, randomness: 0 });

    expect(close?.verdict).toBe('pen');
    expect(far?.verdict).toBe('noPen');
    expect(SHELL_RULES.HOLLOW_CHARGE.jetLossPerMeter).toBeGreaterThan(0);
  });

  it('says ricochet and names no main plate when the first plate deflects the shell', () => {
    const report = describeHit({ layers: [{ ...SIDE, angle: 80 }], shell: AP, randomness: 0.25 });

    expect(report?.verdict).toBe('ricochet');
    expect(report?.main).toBeUndefined();
    expect(report?.first.ricochet).toBe(true);
  });
});
