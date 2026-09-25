import type { LoadoutRequest } from '@bronevik/schemas';

import { buildOptionsSchema, LOADOUT, loadoutResultSchema, popularBuildsSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { MOCK_VEHICLES } from '@/shared/mocks';

import { mockBuildOptions, mockLoadout, mockPopularBuilds } from '../mock';

const [TANK] = MOCK_VEHICLES;

const slots = (length: number) => Array.from<number | null>({ length }).fill(null);

const EMPTY: LoadoutRequest = {
  loadout: {
    equipment: slots(LOADOUT.equipmentSlots),
    consumables: slots(LOADOUT.consumableSlots),
    directives: slots(LOADOUT.directiveSlots),
    crewSkills: {}
  }
};

const OPTIONS = mockBuildOptions(TANK.id);

const withDevice = (id: number): LoadoutRequest => ({ loadout: { ...EMPTY.loadout, equipment: [id, null, null] } });

const deviceTagged = (attribute: string) => OPTIONS?.optionalDevices.find(({ effects }) => effects.some((effect) => effect.attribute === attribute));

describe('builds mocks', () => {
  it('answer every endpoint in the shape the API contract promises', () => {
    expect(() => buildOptionsSchema.parse(OPTIONS)).not.toThrow();
    expect(() => loadoutResultSchema.parse(mockLoadout({ tankId: TANK.id, request: EMPTY }))).not.toThrow();
    expect(() => popularBuildsSchema.parse(mockPopularBuilds({ tankId: TANK.id, limit: 5 }))).not.toThrow();
  });

  it('calculate a shorter reload once a rammer-like device is installed', () => {
    const rammer = deviceTagged('miscAttrs/gunReloadTimeFactor');
    const base = mockLoadout({ tankId: TANK.id, request: EMPTY });
    const fitted = rammer ? mockLoadout({ tankId: TANK.id, request: withDevice(rammer.id) }) : null;

    expect(fitted?.stats.reloadTime).toBeLessThan(base?.stats.reloadTime ?? 0);
  });

  it('report items that do not fit the slot instead of applying them', () => {
    const consumable = OPTIONS?.consumables[0];
    const result = consumable ? mockLoadout({ tankId: TANK.id, request: withDevice(consumable.id) }) : null;

    expect(result?.ignored).toEqual([`optionalDevice:${consumable?.id}`]);
  });

  it('pick modules by the names the options list', () => {
    const [stockEngine] = OPTIONS?.modules.engines ?? [];
    const result = mockLoadout({ tankId: TANK.id, request: { ...EMPTY, modules: { engine: stockEngine?.name } } });

    expect(result?.stats.modules.engine).toBe(stockEngine?.name);
  });

  it('keep popular build shares within the whole sample', () => {
    const { builds } = mockPopularBuilds({ tankId: TANK.id, limit: 5 });

    expect(builds.reduce((total, { share }) => total + share, 0)).toBeLessThanOrEqual(1);
  });

  it('have nothing for an unknown tank', () => {
    expect(mockBuildOptions(-1)).toBeNull();
    expect(mockPopularBuilds({ tankId: -1, limit: 5 }).source).toBe('none');
  });
});
