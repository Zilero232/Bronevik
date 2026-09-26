import { describe, expect, it } from 'vitest';

import { ARMOR_FLAGS } from '../../model/armor-model.constants';
import { calculateArmorHit, penetrationAtDistance, penetrationVerdict, toShellKind, traceArmorRay } from '../penetration';
import { PENETRATION, SHELL_KINDS, SHELL_RULES } from '../penetration.constants';

const RADIANS = Math.PI / 180;

const AP = { kind: 'ARMOR_PIERCING', caliber: 100, penetration: 200 } as const;
const APCR = { kind: 'ARMOR_PIERCING_CR', caliber: 100, penetration: 200 } as const;
const HEAT = { kind: 'HOLLOW_CHARGE', caliber: 100, penetration: 200 } as const;
const HE = { kind: 'HIGH_EXPLOSIVE', caliber: 152, penetration: 100 } as const;

describe('toShellKind', () => {
  it('keeps every known kind and folds the rest onto armor piercing', () => {
    for (const kind of SHELL_KINDS) {
      expect(toShellKind(kind)).toBe(kind);
    }

    expect(toShellKind('ARMOR_PIERCING_HE')).toBe('ARMOR_PIERCING');
    expect(toShellKind(undefined)).toBe('ARMOR_PIERCING');
    expect(toShellKind('SOMETHING_NEW')).toBe('ARMOR_PIERCING');
  });
});

describe('penetrationAtDistance', () => {
  const values = { at100m: 250, at500m: 200 };

  it('interpolates AP and APCR linearly between 100 and 500 metres', () => {
    const midpoint = (PENETRATION.falloffNear + PENETRATION.falloffFar) / 2;

    expect(penetrationAtDistance({ kind: 'ARMOR_PIERCING', ...values, distance: midpoint })).toBeCloseTo((values.at100m + values.at500m) / 2);
    expect(penetrationAtDistance({ kind: 'ARMOR_PIERCING_CR', ...values, distance: PENETRATION.falloffFar })).toBe(values.at500m);
  });

  it('holds the 100 m value closer in and the 500 m value further out', () => {
    expect(penetrationAtDistance({ kind: 'ARMOR_PIERCING', ...values, distance: 0 })).toBe(values.at100m);
    expect(penetrationAtDistance({ kind: 'ARMOR_PIERCING', ...values, distance: 700 })).toBe(values.at500m);
  });

  it('never loses penetration over distance for HEAT and HE', () => {
    expect(penetrationAtDistance({ kind: 'HOLLOW_CHARGE', ...values, distance: 500 })).toBe(values.at100m);
    expect(penetrationAtDistance({ kind: 'HIGH_EXPLOSIVE', ...values, distance: 500 })).toBe(values.at100m);
  });
});

describe('penetrationVerdict', () => {
  const randomness = PENETRATION.randomness;

  it('is a sure pen only when the lowest roll beats the armor', () => {
    expect(penetrationVerdict({ penetration: 200, effective: 200 * (1 - randomness), randomness })).toBe('pen');
    expect(penetrationVerdict({ penetration: 200, effective: 200 * (1 - randomness) + 1, randomness })).toBe('chance');
  });

  it('fails only when even the highest roll is short', () => {
    expect(penetrationVerdict({ penetration: 200, effective: 200 * (1 + randomness), randomness })).toBe('chance');
    expect(penetrationVerdict({ penetration: 200, effective: 200 * (1 + randomness) + 1, randomness })).toBe('noPen');
  });

  it('narrows the band when a smaller randomness is configured', () => {
    const effective = 200 * (1 + PENETRATION.clientRandomness) + 1;

    expect(penetrationVerdict({ penetration: 200, effective, randomness: PENETRATION.randomness })).toBe('chance');
    expect(penetrationVerdict({ penetration: 200, effective, randomness: PENETRATION.clientRandomness })).toBe('noPen');
  });
});

describe('calculateArmorHit', () => {
  it('matches the wiki example of a 100 mm plate at 60 degrees for AP', () => {
    const hit = calculateArmorHit({ thickness: 100, angle: 60, shell: AP });
    const normalized = 60 - SHELL_RULES.ARMOR_PIERCING.normalization;

    expect(hit.normalizedAngle).toBe(normalized);
    expect(hit.effective).toBeCloseTo(100 / Math.cos(normalized * RADIANS));
    expect(hit.ricochet).toBe(false);
  });

  it('normalises APCR less than AP and HEAT not at all', () => {
    const ap = calculateArmorHit({ thickness: 100, angle: 45, shell: AP });
    const apcr = calculateArmorHit({ thickness: 100, angle: 45, shell: APCR });
    const heat = calculateArmorHit({ thickness: 100, angle: 45, shell: HEAT });

    expect(ap.effective).toBeLessThan(apcr.effective);
    expect(apcr.effective).toBeLessThan(heat.effective);
    expect(heat.effective).toBeCloseTo(100 / Math.cos(45 * RADIANS));
  });

  it('never drops the normalised angle below zero', () => {
    const hit = calculateArmorHit({ thickness: 100, angle: 2, shell: AP });

    expect(hit.normalizedAngle).toBe(0);
    expect(hit.effective).toBe(100);
  });

  it('boosts normalisation when the caliber exceeds twice the armor', () => {
    const thickness = 40;
    const caliber = 100;
    const hit = calculateArmorHit({ thickness, angle: 60, shell: { ...AP, caliber } });
    const boosted = SHELL_RULES.ARMOR_PIERCING.normalization * ((PENETRATION.twoCaliberFactor * caliber) / (2 * thickness));

    expect(caliber).toBeGreaterThan(PENETRATION.twoCaliberRatio * thickness);
    expect(hit.normalizedAngle).toBeCloseTo(60 - boosted);
  });

  it('ricochets AP and APCR at the ricochet angle and not a degree before', () => {
    const angle = SHELL_RULES.ARMOR_PIERCING.ricochetAngle;

    expect(calculateArmorHit({ thickness: 100, angle, shell: AP }).verdict).toBe('ricochet');
    expect(calculateArmorHit({ thickness: 100, angle: angle - 1, shell: AP }).ricochet).toBe(false);
    expect(calculateArmorHit({ thickness: 100, angle, shell: APCR }).verdict).toBe('ricochet');
  });

  it('lets HEAT ricochet only from its own steeper angle', () => {
    expect(calculateArmorHit({ thickness: 50, angle: SHELL_RULES.ARMOR_PIERCING.ricochetAngle + 5, shell: HEAT }).ricochet).toBe(false);
    expect(calculateArmorHit({ thickness: 50, angle: SHELL_RULES.HOLLOW_CHARGE.ricochetAngle, shell: HEAT }).verdict).toBe('ricochet');
  });

  it('never ricochets when the caliber overmatches the plate three times', () => {
    const thickness = 30;
    const hit = calculateArmorHit({ thickness, angle: 80, shell: { ...AP, caliber: PENETRATION.overmatchRatio * thickness + 1 } });

    expect(hit.overmatch).toBe(true);
    expect(hit.ricochet).toBe(false);
  });

  it('keeps the ricochet at exactly three calibers', () => {
    const thickness = 30;
    const hit = calculateArmorHit({ thickness, angle: 80, shell: { ...AP, caliber: PENETRATION.overmatchRatio * thickness } });

    expect(hit.overmatch).toBe(false);
    expect(hit.verdict).toBe('ricochet');
  });

  it('does not ricochet off tracks or external modules', () => {
    expect(calculateArmorHit({ thickness: 20, angle: 85, shell: AP, flags: ARMOR_FLAGS.track }).ricochet).toBe(false);
    expect(calculateArmorHit({ thickness: 60, angle: 85, shell: AP, flags: ARMOR_FLAGS.module }).ricochet).toBe(false);
    expect(calculateArmorHit({ thickness: 60, angle: 85, shell: AP, flags: ARMOR_FLAGS.spaced }).ricochet).toBe(true);
  });

  it('treats HE as penetration against nominal armor regardless of angle', () => {
    const hit = calculateArmorHit({ thickness: 70, angle: 80, shell: HE });

    expect(hit.effective).toBe(70);
    expect(hit.canRicochet).toBe(false);
    expect(hit.verdict).toBe('pen');
  });

  it('reports zero-thickness and hollow plates as pass-through', () => {
    expect(calculateArmorHit({ thickness: 0, angle: 10, shell: AP }).verdict).toBe('hollow');
    expect(calculateArmorHit({ thickness: 50, angle: 10, shell: AP, flags: ARMOR_FLAGS.hollow }).effective).toBe(0);
  });

  it('caps the effective thickness at grazing angles when nothing ricochets', () => {
    const hit = calculateArmorHit({ thickness: 20, angle: 90, shell: HEAT, flags: ARMOR_FLAGS.track });

    expect(hit.effective).toBe(PENETRATION.maxEffective);
  });
});

describe('traceArmorRay', () => {
  it('sums the line of sight of a spaced plate and the main plate behind it', () => {
    const trace = traceArmorRay({
      layers: [
        { thickness: 30, angle: 0, flags: ARMOR_FLAGS.spaced, gap: 0 },
        { thickness: 100, angle: 0, flags: 0, gap: 0.5 }
      ],
      shell: AP
    });

    expect(trace.mainIndex).toBe(1);
    expect(trace.total).toBe(130);
    expect(trace.remaining).toBe(AP.penetration - 30);
    expect(trace.verdict).toBe('pen');
  });

  it('drains HEAT by the jet loss for every metre after the first spaced plate', () => {
    const gap = 0.4;
    const trace = traceArmorRay({
      layers: [
        { thickness: 20, angle: 0, flags: ARMOR_FLAGS.spaced, gap: 0 },
        { thickness: 100, angle: 0, flags: 0, gap }
      ],
      shell: HEAT
    });

    expect(trace.remaining).toBeCloseTo((HEAT.penetration - 20) * (1 - SHELL_RULES.HOLLOW_CHARGE.jetLossPerMeter * gap));
  });

  it('does not drain AP over the gap', () => {
    const trace = traceArmorRay({
      layers: [
        { thickness: 20, angle: 0, flags: ARMOR_FLAGS.spaced, gap: 0 },
        { thickness: 100, angle: 0, flags: 0, gap: 1 }
      ],
      shell: AP
    });

    expect(trace.remaining).toBe(AP.penetration - 20);
  });

  it('stops at a ricochet off a spaced plate', () => {
    const trace = traceArmorRay({
      layers: [
        { thickness: 40, angle: 75, flags: ARMOR_FLAGS.spaced, gap: 0 },
        { thickness: 50, angle: 0, flags: 0, gap: 0.3 }
      ],
      shell: AP
    });

    expect(trace.verdict).toBe('ricochet');
    expect(trace.layers).toHaveLength(1);
  });

  it('skips hollow plates and reports a miss when no main armor is behind them', () => {
    const trace = traceArmorRay({ layers: [{ thickness: 0, angle: 0, flags: 0, gap: 0 }], shell: AP });

    expect(trace.verdict).toBe('hollow');
    expect(trace.mainIndex).toBe(-1);
  });

  it('turns into a chance when only the random band reaches the main plate', () => {
    const trace = traceArmorRay({
      layers: [
        { thickness: 20, angle: 0, flags: ARMOR_FLAGS.track, gap: 0 },
        { thickness: AP.penetration - 20, angle: 0, flags: 0, gap: 0.2 }
      ],
      shell: AP
    });

    expect(trace.verdict).toBe('chance');
  });

  it('fails when the spaced armor alone eats the whole penetration', () => {
    const trace = traceArmorRay({
      layers: [
        { thickness: 300, angle: 0, flags: ARMOR_FLAGS.spaced, gap: 0 },
        { thickness: 10, angle: 0, flags: 0, gap: 0.2 }
      ],
      shell: AP
    });

    expect(trace.verdict).toBe('noPen');
  });

  it('divides HE penetration after a spaced plate', () => {
    const trace = traceArmorRay({
      layers: [
        { thickness: 10, angle: 0, flags: ARMOR_FLAGS.spaced, gap: 0 },
        { thickness: 40, angle: 0, flags: 0, gap: 0.5 }
      ],
      shell: HE
    });

    expect(trace.remaining).toBeCloseTo((HE.penetration - 10) / PENETRATION.heShieldReduction);
  });
});
