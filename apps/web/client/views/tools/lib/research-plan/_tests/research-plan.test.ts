import type { TechTreeNode, VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import type { ResearchPlanInput } from '../research-plan.types';

import { RESEARCH, RESEARCH_COSTS } from '../../../config';
import { researchCost, researchPlan } from '../research-plan';

const VEHICLE: VehicleSummary = {
  tankId: 1,
  name: 'ИС-7',
  shortName: 'ИС-7',
  slug: 'is-7',
  nation: 'ussr',
  type: 'heavyTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  status: 'researchable',
  images: { small: null, contour: null, big: null }
};

const NODE: TechTreeNode = { vehicle: VEHICLE, xp: null, credits: null, gold: null, parents: [], children: [] };

const BASE: ResearchPlanInput = {
  cost: { xp: 100_000, credits: 5_000_000 },
  currentXp: 10_000,
  freeXp: 0,
  credits: 1_000_000,
  xpPerBattle: 1_000,
  creditsPerBattle: 20_000,
  isPremium: false,
  battlesPerDay: 10
};

describe('researchCost', () => {
  it('uses the tech tree node when it carries both prices', () => {
    expect(researchCost({ tier: 10, node: { ...NODE, xp: 123, credits: 456 } })).toEqual({ xp: 123, credits: 456, source: 'tree' });
  });

  it('falls back to the tier table without a node', () => {
    expect(researchCost({ tier: 8, node: null })).toEqual({ ...RESEARCH_COSTS[8], source: 'tier' });
  });

  it('fills only the missing price from the tier table', () => {
    const cost = researchCost({ tier: 9, node: { ...NODE, xp: 999, credits: null } });

    expect(cost).toEqual({ xp: 999, credits: RESEARCH_COSTS[9].credits, source: 'tier' });
  });
});

describe('researchPlan', () => {
  it('lets free experience cover part of the research', () => {
    const withFree = researchPlan({ ...BASE, freeXp: 20_000 });

    expect(withFree.xpLeft).toBe(researchPlan(BASE).xpLeft - 20_000);
  });

  it('is limited by whichever of experience or credits takes longer', () => {
    const plan = researchPlan(BASE);

    expect(plan.battles).toBe(Math.max(plan.battlesForXp ?? 0, plan.battlesForCredits ?? 0));
  });

  it('needs fewer battles with a premium account', () => {
    const premium = researchPlan({ ...BASE, isPremium: true });
    const regular = researchPlan(BASE);

    expect(premium.battlesForXp).toBe(Math.ceil(regular.xpLeft / (BASE.xpPerBattle * (1 + RESEARCH.premiumBonus))));
    expect(premium.battles ?? 0).toBeLessThan(regular.battles ?? 0);
  });

  it('needs no battles once everything is already saved up', () => {
    const plan = researchPlan({ ...BASE, currentXp: 200_000, credits: 9_000_000 });

    expect(plan).toMatchObject({ battles: 0, days: 0, progress: 1 });
  });

  it('cannot plan without income per battle', () => {
    expect(researchPlan({ ...BASE, xpPerBattle: 0 }).battles).toBeNull();
  });

  it('spreads the battles over the daily pace', () => {
    const plan = researchPlan(BASE);

    expect(plan.days).toBe(Math.ceil((plan.battles ?? 0) / BASE.battlesPerDay));
  });
});
