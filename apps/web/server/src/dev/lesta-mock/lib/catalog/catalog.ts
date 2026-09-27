import type { VehicleType } from '@otmetki/schemas';

import { median } from 'remeda';

import type { MockCatalog, MockExpected, MockVehicle } from '../../lesta-mock.types';
import type {
  CatalogQueryClient,
  CatalogRows,
  ExpectedRow,
  FallbackExpectedInput,
  GameVersionRow,
  HitPointsInput,
  KnownExpected,
  OfInput
} from './catalog.types';

import { MOCK_BATTLE } from '../../config';
import { CATALOG_DEFAULTS, CATALOG_SQL } from './catalog.constants';
import { crewSchema, modulesTreeSchema, shotsSchema } from './catalog.schemas';

const VEHICLE_TYPES: readonly VehicleType[] = ['lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG'];

const toVehicleType = (value: string): VehicleType | null => VEHICLE_TYPES.find((type) => type === value) ?? null;

const toExpected = (row: ExpectedRow): MockExpected => ({
  damage: row.exp_damage,
  frags: row.exp_frags,
  spot: row.exp_spotted,
  def: row.exp_defense,
  winRate: row.exp_win_rate
});

const fallbackExpected = ({ known, vehicle }: FallbackExpectedInput): MockExpected => {
  const peers = known.filter((entry) => entry.tier === vehicle.tier && entry.type === vehicle.type);
  const pool = (peers.length > 0 ? peers : known.filter((entry) => entry.tier === vehicle.tier)).map((entry) => entry.expected);
  const of = ({ key, fallback }: OfInput) => median(pool.map((expected) => expected[key])) ?? fallback;

  return {
    damage: of({ key: 'damage', fallback: 120 * vehicle.tier * vehicle.tier + 150 }),
    frags: of({ key: 'frags', fallback: 0.9 }),
    spot: of({ key: 'spot', fallback: 1.1 }),
    def: of({ key: 'def', fallback: 0.6 }),
    winRate: of({ key: 'winRate', fallback: 52 })
  };
};

const hitPoints = ({ row, type }: HitPointsInput): number => {
  const total = (row.hull_hp ?? 0) + (row.turret_hp ?? 0);

  return total > 0 ? total : (MOCK_BATTLE.hpFallback[type][row.tier] ?? CATALOG_DEFAULTS.hp);
};

export const buildCatalog = (rows: CatalogRows): MockCatalog => {
  const expectedById = new Map(rows.expected.map((row) => [row.tank_id, toExpected(row)]));
  const shellPrices = new Map(rows.shellPrices.flatMap((row) => (row.shell_id === null ? [] : [[row.shell_id, row] as const])));

  const typed = rows.vehicles.flatMap((row) => {
    const type = toVehicleType(row.type);

    return type ? [{ row, type }] : [];
  });

  const known = typed.flatMap(({ row, type }): KnownExpected[] => {
    const expected = expectedById.get(row.tank_id);

    return expected ? [{ tier: row.tier, type, expected }] : [];
  });

  const vehicles = typed.map(({ row, type }): MockVehicle => {
    const expected = expectedById.get(row.tank_id);

    return {
      tankId: row.tank_id,
      name: row.name,
      shortName: row.short_name,
      tag: row.tag,
      nation: row.nation,
      type,
      tier: row.tier,
      isPremium: row.is_premium,
      isCollectible: row.is_collectible,
      isGift: row.is_gift,
      isWheeled: row.is_wheeled,
      playable: expected !== undefined,
      priceCredit: row.price_credit,
      priceGold: row.price_gold,
      description: row.description,
      hp: hitPoints({ row, type }),
      expected:
        expected ?? fallbackExpected({ known, vehicle: { tier: row.tier, type, expected: { damage: 0, frags: 0, spot: 0, def: 0, winRate: 0 } } }),
      crew: crewSchema.parse(row.crew),
      shells: shotsSchema.parse(row.shots).map((shot) => {
        const price = shellPrices.get(shot.shellId);

        return {
          shellId: shot.shellId,
          kind: shot.kind,
          isPremium: shot.isPremium,
          portion: shot.defaultPortion,
          damage: shot.damage?.armor ?? null,
          price: price?.amount ?? 0,
          currency: price?.currency ?? CATALOG_DEFAULTS.shellCurrency
        };
      }),
      maxAmmo: row.max_ammo ?? CATALOG_DEFAULTS.maxAmmo,
      prevTankIds: row.prev_tank_ids,
      moduleIds: modulesTreeSchema.parse(row.modules_tree).map((module) => module.moduleId)
    };
  });

  return {
    gameVersion: rows.gameVersion,
    tanksUpdatedAt: rows.tanksUpdatedAt,
    vehicles,
    vehicleById: new Map(vehicles.map((vehicle) => [vehicle.tankId, vehicle])),
    provisions: rows.provisions.map((row) => ({
      provisionId: row.provision_id,
      name: row.name,
      tag: row.tag,
      type: row.type,
      description: row.description,
      priceCredit: row.price_credit,
      priceGold: row.price_gold,
      weight: row.weight,
      tankIds: row.tank_ids
    })),
    modules: rows.modules.map((row) => ({
      moduleId: row.module_id,
      name: row.name,
      type: row.type,
      nation: row.nation,
      tier: row.tier,
      priceCredit: row.price_credit,
      weight: row.weight,
      tankIds: row.tank_ids
    })),
    arenas: rows.arenas.map((row) => ({
      arenaId: row.arena_id,
      name: row.name,
      description: row.description,
      camouflageType: row.camouflage_type,
      modes: row.modes
    })),
    crewSkills: rows.crewSkills.map((row) => ({
      skill: row.skill,
      name: row.name,
      type: row.type,
      roles: row.roles,
      isCommon: row.is_common,
      description: row.description
    })),
    crewRoles: rows.crewRoles.map((row) => ({ role: row.role, name: row.name, skills: row.skills }))
  };
};

export const loadMockCatalog = async (client: CatalogQueryClient): Promise<MockCatalog> => {
  const [versions, vehicles, expected, shellPrices, provisions, modules, arenas, crewSkills, crewRoles] = await Promise.all([
    client.$queryRawUnsafe<GameVersionRow[]>(CATALOG_SQL.gameVersion),
    client.$queryRawUnsafe<CatalogRows['vehicles']>(CATALOG_SQL.vehicles),
    client.$queryRawUnsafe<CatalogRows['expected']>(CATALOG_SQL.expected),
    client.$queryRawUnsafe<CatalogRows['shellPrices']>(CATALOG_SQL.shellPrices),
    client.$queryRawUnsafe<CatalogRows['provisions']>(CATALOG_SQL.provisions),
    client.$queryRawUnsafe<CatalogRows['modules']>(CATALOG_SQL.modules),
    client.$queryRawUnsafe<CatalogRows['arenas']>(CATALOG_SQL.arenas),
    client.$queryRawUnsafe<CatalogRows['crewSkills']>(CATALOG_SQL.crewSkills),
    client.$queryRawUnsafe<CatalogRows['crewRoles']>(CATALOG_SQL.crewRoles)
  ]);

  const [version] = versions;

  return buildCatalog({
    gameVersion: version?.version ?? CATALOG_DEFAULTS.gameVersion,
    tanksUpdatedAt: Math.floor((version?.detected_at ?? new Date(0)).getTime() / 1000),
    vehicles,
    expected,
    shellPrices,
    provisions,
    modules,
    arenas,
    crewSkills,
    crewRoles
  });
};
