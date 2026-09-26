import { ARMOR_FLAGS, calculateArmorHit, PENETRATION, SHELL_RULES } from '@otmetki/gamedata';
import { describe, expect, it } from 'vitest';

import { classifyFace } from '../classify-face';

const AP = { kind: 'ARMOR_PIERCING', caliber: 122, penetration: 200 } as const;
const HE = { kind: 'HIGH_EXPLOSIVE', caliber: 152, penetration: 90 } as const;
const randomness = PENETRATION.randomness;

describe('classifyFace', () => {
  it('agrees with the penetration math for main armor across angles and thickness', () => {
    for (const thickness of [40, 100, 160, 200, 260, 320]) {
      for (const angle of [0, 20, 45, 60, 69, 70, 80]) {
        const expected = calculateArmorHit({ thickness, angle, shell: AP, randomness }).verdict;

        expect(classifyFace({ thickness, flags: 0, angle, shell: AP, randomness })).toBe(expected);
      }
    }
  });

  it('paints spaced plates and tracks with their own colour whatever the shell', () => {
    expect(classifyFace({ thickness: 30, flags: ARMOR_FLAGS.spaced, angle: 0, shell: AP, randomness })).toBe('spaced');
    expect(classifyFace({ thickness: 20, flags: ARMOR_FLAGS.track, angle: 85, shell: AP, randomness })).toBe('spaced');
  });

  it('puts modules above every other class, even a zero-thickness optic', () => {
    expect(classifyFace({ thickness: 0, flags: ARMOR_FLAGS.module, angle: 0, shell: AP, randomness })).toBe('module');
    expect(classifyFace({ thickness: 60, flags: ARMOR_FLAGS.module | ARMOR_FLAGS.gun, angle: 0, shell: AP, randomness })).toBe('module');
  });

  it('shows zero plates as hollow before the spaced colour', () => {
    expect(classifyFace({ thickness: 0, flags: ARMOR_FLAGS.spaced, angle: 0, shell: AP, randomness })).toBe('hollow');
  });

  it('turns red for a ricochet from the ricochet angle on', () => {
    expect(classifyFace({ thickness: 100, flags: 0, angle: SHELL_RULES.ARMOR_PIERCING.ricochetAngle, shell: AP, randomness })).toBe('ricochet');
  });

  it('ignores the angle for HE', () => {
    const flat = classifyFace({ thickness: 60, flags: 0, angle: 0, shell: HE, randomness });
    const steep = classifyFace({ thickness: 60, flags: 0, angle: 85, shell: HE, randomness });

    expect(steep).toBe(flat);
  });

  it('widens the yellow band as the randomness grows', () => {
    const thickness = AP.penetration * (1 + PENETRATION.clientRandomness) + 1;

    expect(classifyFace({ thickness, flags: 0, angle: 0, shell: AP, randomness: PENETRATION.clientRandomness })).toBe('noPen');
    expect(classifyFace({ thickness, flags: 0, angle: 0, shell: AP, randomness: PENETRATION.randomness })).toBe('chance');
  });
});
