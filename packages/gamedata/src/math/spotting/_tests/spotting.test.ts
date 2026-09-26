import { describe, expect, it } from 'vitest';

import type { Camouflage, SpottingState, VisionState } from '../spotting.types';

import { camouflageFactor, effectiveViewRange, spottingDistance, spottingDuel } from '../spotting';
import { SPOTTING } from '../spotting.constants';

const camouflage: Camouflage = { still: 0.2, moving: 0.15, camouflageBonus: 0.03, atShot: 0.25, camoNet: 0.1 };

const open: SpottingState = {
  isMoving: false,
  isFiring: false,
  foliage: 'none',
  isFoliageNear: false,
  hasCamoNet: false,
  hasPaint: false,
  camoSkill: 0
};

const vision: VisionState = { isMoving: false, hasOptics: false, hasBinoculars: false, hasCrewSkills: false };

describe('camouflageFactor', () => {
  it('uses the base still and moving values of the files in the open', () => {
    expect(camouflageFactor({ camouflage, state: open })).toBe(camouflage.still);
    expect(camouflageFactor({ camouflage, state: { ...open, isMoving: true } })).toBe(camouflage.moving);
  });

  it('multiplies the own camouflage by the gun factor when firing', () => {
    expect(camouflageFactor({ camouflage, state: { ...open, isFiring: true } })).toBeCloseTo(camouflage.still * camouflage.atShot);
  });

  it('adds the camo skill, paint, net and foliage and never exceeds one', () => {
    const dressed = camouflageFactor({ camouflage, state: { ...open, camoSkill: 100, hasPaint: true, hasCamoNet: true } });

    expect(dressed).toBeGreaterThan(camouflage.still + camouflage.camoNet);
    expect(camouflageFactor({ camouflage, state: { ...open, foliage: 'double', hasCamoNet: true, camoSkill: 100 } })).toBe(SPOTTING.maxCamouflage);
  });

  it('drops the camo net on the move', () => {
    expect(camouflageFactor({ camouflage, state: { ...open, isMoving: true, hasCamoNet: true } })).toBe(camouflage.moving);
  });

  it('keeps a far bush when firing and weakens a near one', () => {
    const far = camouflageFactor({ camouflage, state: { ...open, isFiring: true, foliage: 'single' } });
    const near = camouflageFactor({ camouflage, state: { ...open, isFiring: true, foliage: 'single', isFoliageNear: true } });

    expect(far).toBeGreaterThan(near);
    expect(far - near).toBeCloseTo(SPOTTING.foliage.single * (1 - SPOTTING.nearFoliageAtShot));
  });
});

describe('spottingDistance', () => {
  it('equals the view range against zero camouflage, capped at 445 m', () => {
    expect(spottingDistance({ viewRange: 400, camouflage: 0 })).toBe(400);
    expect(spottingDistance({ viewRange: 500, camouflage: 0 })).toBe(SPOTTING.maxDistance);
  });

  it('never goes below the 50 m proximity bubble', () => {
    expect(spottingDistance({ viewRange: 400, camouflage: 1 })).toBe(SPOTTING.minDistance);
    expect(spottingDistance({ viewRange: 30, camouflage: 0 })).toBe(SPOTTING.minDistance);
  });

  it('lets view range beyond the cap still counter camouflage', () => {
    expect(spottingDistance({ viewRange: 520, camouflage: 0.3 })).toBeGreaterThan(spottingDistance({ viewRange: 445, camouflage: 0.3 }));
  });
});

describe('effectiveViewRange', () => {
  it('stacks optics and binoculars, and binoculars only while still', () => {
    const optics = effectiveViewRange({ viewRange: 400, state: { ...vision, hasOptics: true } });
    const both = effectiveViewRange({ viewRange: 400, state: { ...vision, hasOptics: true, hasBinoculars: true } });
    const moving = effectiveViewRange({ viewRange: 400, state: { ...vision, hasOptics: true, hasBinoculars: true, isMoving: true } });

    expect(optics).toBeGreaterThan(400);
    expect(both).toBeGreaterThan(optics);
    expect(moving).toBe(optics);
  });
});

describe('spottingDuel', () => {
  it('names the side that sees the other from farther away', () => {
    const duel = spottingDuel({ mine: { viewRange: 420, camouflage: 0.3 }, theirs: { viewRange: 380, camouflage: 0.1 } });

    expect(duel.verdict).toBe('me');
    expect(duel.margin).toBeCloseTo(duel.iSpotAt - duel.theySpotAt);
  });

  it('is even for mirror tanks', () => {
    expect(spottingDuel({ mine: { viewRange: 400, camouflage: 0.2 }, theirs: { viewRange: 400, camouflage: 0.2 } }).verdict).toBe('even');
  });
});
