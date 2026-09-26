import type { CatalogRows } from '../lib/catalog';

import { buildCatalog } from '../lib/catalog';
import { createMockWorld } from '../lib/world';

const NATIONS = ['ussr', 'germany', 'usa', 'france', 'uk'] as const;
const TYPES = { heavyTank: 2400, mediumTank: 2200, lightTank: 1600, 'AT-SPG': 2600, SPG: 1600 } as const;
const SPOT = { heavyTank: 0.9, mediumTank: 1.2, lightTank: 2.3, 'AT-SPG': 0.8, SPG: 0.5 } as const;
const HP = { heavyTank: 2400, mediumTank: 2000, lightTank: 1600, 'AT-SPG': 2000, SPG: 1000 } as const;
const TYPE_KEYS = ['heavyTank', 'mediumTank', 'lightTank', 'AT-SPG', 'SPG'] as const;
const DAMAGE_BY_TYPE: ReadonlyMap<string, number> = new Map(Object.entries(TYPES));
const SPOT_BY_TYPE: ReadonlyMap<string, number> = new Map(Object.entries(SPOT));

type Vehicle = CatalogRows['vehicles'][number];
type Expected = CatalogRows['expected'][number];

const vehicleRow = (tankId: number, nation: string, type: keyof typeof TYPES, tier: number, premium: boolean): Vehicle => ({
  tank_id: tankId,
  name: `${nation}-${type}-${tier}${premium ? '-P' : ''}`,
  short_name: `${type}-${tier}`,
  tag: `${nation}_${type}_${tier}${premium ? '_P' : ''}`.replaceAll('-', '_'),
  nation,
  type,
  tier,
  is_premium: premium,
  is_collectible: false,
  is_gift: false,
  is_wheeled: false,
  price_credit: premium ? null : tier * 100_000,
  price_gold: premium ? 10_000 : null,
  description: null,
  prev_tank_ids: [],
  crew: [
    { role: 'commander', extraRoles: [] },
    { role: 'gunner', extraRoles: [] },
    { role: 'driver', extraRoles: [] },
    { role: 'loader', extraRoles: ['radioman'] }
  ],
  hull_hp: HP[type] * (tier / 10) * 0.8,
  turret_hp: HP[type] * (tier / 10) * 0.2,
  shots: [
    { shellId: tankId * 10 + 1, kind: 'ARMOR_PIERCING', isPremium: false, defaultPortion: 0.7, damage: { armor: 90 + tier * 36 } },
    { shellId: tankId * 10 + 2, kind: 'ARMOR_PIERCING_CR', isPremium: true, defaultPortion: 0, damage: { armor: 90 + tier * 36 } },
    { shellId: tankId * 10 + 3, kind: 'HIGH_EXPLOSIVE', isPremium: false, defaultPortion: 0.3, damage: { armor: 120 + tier * 45 } }
  ],
  max_ammo: 50,
  modules_tree: []
});

const expectedRow = (vehicle: Vehicle): Expected => ({
  tank_id: vehicle.tank_id,
  exp_damage: (DAMAGE_BY_TYPE.get(vehicle.type) ?? 2000) * (vehicle.tier / 10) ** 1.9 + 40,
  exp_frags: 1.05 - vehicle.tier * 0.015,
  exp_spotted: SPOT_BY_TYPE.get(vehicle.type) ?? 1,
  exp_defense: 0.6,
  exp_win_rate: vehicle.is_premium ? 52.5 : 51.5
});

const vehicles: Vehicle[] = [];

for (const [nationIndex, nation] of NATIONS.entries()) {
  for (const [typeIndex, type] of TYPE_KEYS.entries()) {
    for (let tier = 1; tier <= 10; tier += 1) {
      if (tier === 1 && typeIndex > 1) {
        continue;
      }

      vehicles.push(vehicleRow(nationIndex * 10_000 + typeIndex * 1000 + tier * 10 + 1, nation, type, tier, false));
    }

    vehicles.push(vehicleRow(nationIndex * 10_000 + typeIndex * 1000 + 8 * 10 + 5, nation, type, 8, true));
  }
}

export const fixtureRows: CatalogRows = {
  gameVersion: '1.45.0.5231',
  tanksUpdatedAt: 1_790_000_000,
  vehicles,
  expected: vehicles.map(expectedRow),
  shellPrices: vehicles.flatMap((vehicle) => [
    { shell_id: vehicle.tank_id * 10 + 1, amount: 900, currency: 'credits' },
    { shell_id: vehicle.tank_id * 10 + 2, amount: 4800, currency: 'credits' },
    { shell_id: vehicle.tank_id * 10 + 3, amount: 700, currency: 'credits' }
  ]),
  provisions: [
    {
      provision_id: 1,
      name: 'tankRammer',
      tag: 'tankRammer_tier2',
      type: 'optional_device',
      description: null,
      price_credit: 600_000,
      price_gold: null,
      weight: 100,
      tank_ids: vehicles.map((v) => v.tank_id)
    },
    {
      provision_id: 2,
      name: 'ventilation',
      tag: 'improvedVentilation_tier2',
      type: 'optional_device',
      description: null,
      price_credit: 600_000,
      price_gold: null,
      weight: 100,
      tank_ids: vehicles.map((v) => v.tank_id)
    },
    {
      provision_id: 3,
      name: 'stabilizer',
      tag: 'aimingStabilizer_tier1',
      type: 'optional_device',
      description: null,
      price_credit: 600_000,
      price_gold: null,
      weight: 100,
      tank_ids: vehicles.map((v) => v.tank_id)
    },
    {
      provision_id: 4,
      name: 'smallRepairkit',
      tag: 'smallRepairkit',
      type: 'equipment',
      description: null,
      price_credit: 3000,
      price_gold: null,
      weight: 0,
      tank_ids: vehicles.map((v) => v.tank_id)
    },
    {
      provision_id: 5,
      name: 'smallMedkit',
      tag: 'smallMedkit',
      type: 'equipment',
      description: null,
      price_credit: 3000,
      price_gold: null,
      weight: 0,
      tank_ids: vehicles.map((v) => v.tank_id)
    }
  ],
  modules: [],
  arenas: [
    { arena_id: '01_karelia', name: 'Karelia', description: null, camouflage_type: 'summer', modes: ['ctf'] },
    { arena_id: '02_malinovka', name: 'Malinovka', description: null, camouflage_type: 'summer', modes: ['ctf'] }
  ],
  crewSkills: [
    { skill: 'repair', name: 'Ремонт', type: 'common', roles: ['commander', 'gunner', 'driver', 'loader'], is_common: true, description: null },
    { skill: 'commander_sixthSense', name: 'Шестое чувство', type: 'role', roles: ['commander'], is_common: false, description: null }
  ],
  crewRoles: [{ role: 'commander', name: 'Командир', skills: ['commander_sixthSense'] }]
};

export const fixtureCatalog = buildCatalog(fixtureRows);

export const fixtureWorld = createMockWorld({ catalog: fixtureCatalog, players: 3000, clans: 90 });

export const DAY = 86_400;
