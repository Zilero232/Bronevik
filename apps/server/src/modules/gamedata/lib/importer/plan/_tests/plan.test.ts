import { describe, expect, it } from 'vitest';

import { memoryFiles } from '../../../_tests/fixtures';
import { buildGameData } from '../../../game-data';
import { createMemoryReader } from '../../../source';
import { ENTRY_KIND, PROFILE, PROVISION_TYPE } from '../../importer.constants';
import { createImportPlan } from '../plan';

const data = await buildGameData({ reader: createMemoryReader({ sourceId: 'RU', files: memoryFiles() }), nations: ['ussr'] });
const plan = createImportPlan({ data });
const [vehicle] = data.vehicles;

describe('createImportPlan', () => {
  it('maps vehicles onto database rows without inventing localized names', () => {
    expect(plan.vehicles).toHaveLength(1);
    expect(plan.vehicles[0]).toMatchObject({ tankId: vehicle.tankId, type: 'heavyTank', tier: vehicle.tier, slug: 'r01-is', name: vehicle.name });
    expect(plan.vehicles[0].priceCredit).toBe(vehicle.price?.amount);
    expect(plan.title).toBe(`RU ${data.version}`);
  });

  it('builds stock and top profiles with their module ids', () => {
    expect(plan.profiles.map((profile) => profile.profileId)).toEqual([PROFILE.stock, PROFILE.top]);
    expect(plan.profiles.find((profile) => profile.isDefault)?.profileId).toBe(PROFILE.stock);

    for (const profile of plan.profiles) {
      expect(profile.moduleIds.length).toBeGreaterThan(0);
    }
  });

  it('lists each module once and links the vehicle through module unlocks', () => {
    const ids = plan.modules.map((module) => module.moduleId);

    expect(new Set(ids).size).toBe(ids.length);
    expect(plan.modules.every((module) => module.tankIds.includes(vehicle.tankId))).toBe(true);
    expect(plan.vehicles[0].modulesTree.some((node) => node.unlocks.some((unlock) => unlock.type === 'vehicle'))).toBe(true);
  });

  it('computes compatible vehicles for provisions, including field modifications', () => {
    const modifications = plan.provisions.filter((row) => row.type === PROVISION_TYPE.fieldModification);
    const consumables = plan.provisions.filter((row) => row.type === PROVISION_TYPE.consumable);

    expect(modifications.some((row) => row.tankIds.includes(vehicle.tankId))).toBe(true);
    expect(consumables.some((row) => row.tag === 'artillery_epic')).toBe(false);
    expect(new Set(plan.provisions.map((row) => row.provisionId)).size).toBe(plan.provisions.length);
  });

  it('keeps a raw snapshot entry per item and a summary per vehicle', () => {
    const kinds = new Set(plan.entries.map((entry) => entry.kind));

    expect(kinds).toEqual(new Set(Object.values(ENTRY_KIND)));

    expect(plan.summaries.get(vehicle.tankId)?.top?.maxHealth).toBe(
      plan.profiles.find((profile) => profile.profileId === PROFILE.top)?.data.maxHealth
    );
  });
});
