import { describe, expect, it } from 'vitest';

import type { SpottingParty } from '../spotting-view.types';

import { SPOTTING_FORM_DEFAULTS } from '../../../config';
import { spottingView } from '../spotting-view';

const party: SpottingParty = {
  config: {
    vision: { baseViewRange: 400, viewRange: 400 },
    camouflage: { still: 0.2, moving: 0.15, camouflageBonus: 0.03, atShot: 0.25, camoNet: 0.1 }
  },
  camoSkillRate: 0.0075,
  values: SPOTTING_FORM_DEFAULTS.me
};

describe('spottingView', () => {
  it('is even for the same tank in the same state', () => {
    expect(spottingView({ mine: party, theirs: party }).duel.verdict).toBe('even');
  });

  it('lets the side sitting in a bush see first', () => {
    const view = spottingView({ mine: { ...party, values: { ...party.values, foliage: 'single' } }, theirs: party });

    expect(view.duel.verdict).toBe('me');
    expect(view.mine.camouflage).toBeGreaterThan(view.theirs.camouflage);
  });

  it('gives the enemy the edge when I fire in the open', () => {
    const view = spottingView({ mine: { ...party, values: { ...party.values, isFiring: true } }, theirs: party });

    expect(view.duel.verdict).toBe('them');
  });

  it('extends my view range with optics', () => {
    const view = spottingView({ mine: { ...party, values: { ...party.values, hasOptics: true } }, theirs: party });

    expect(view.mine.viewRange).toBeGreaterThan(party.config.vision.viewRange);
  });
});
