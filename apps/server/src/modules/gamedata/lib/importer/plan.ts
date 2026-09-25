import type { FinalStats, ModuleBase, Price, VehicleSpec } from '@bronevik/gamedata';

import { calculateLoadout } from '@bronevik/gamedata';

import type {
  ArenaRow,
  CompatibleTanksInput,
  CreateImportPlanInput,
  CrewRoleRow,
  CrewSkillRow,
  DeviceRowInput,
  EntryRow,
  EquipmentRowInput,
  ImportPlan,
  ModuleRow,
  ModuleTreeNode,
  NextTank,
  PriceColumns,
  ProfileRow,
  ProvisionRow,
  TryLoadoutInput,
  VehicleModule,
  VehicleRow,
  VehicleSummary
} from './importer.types';

import { resolveVehicleProgression } from '../parsers/post-progression';
import { matchesVehicleFilter } from '../parsers/vehicle-filter';
import { minimapUrl } from '../source';
import { ENTRY_KIND, MODULE_TYPE, PROFILE, PROVISION_TYPE, VEHICLE_TYPE } from './importer.constants';
import { profileStats, summarizeVehicle } from './summary';

const describe = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const prices = (price: Price | undefined): PriceColumns => {
  if (price?.currency === 'credits') {
    return { priceCredit: price.amount };
  }

  if (price?.currency === 'gold') {
    return { priceGold: price.amount };
  }

  return {};
};

const vehicleModules = (vehicle: VehicleSpec): VehicleModule[] => [
  ...vehicle.chassis.map((module) => ({ kind: 'chassis' as const, module })),
  ...vehicle.turrets.map((module) => ({ kind: 'turret' as const, module })),
  ...vehicle.turrets.flatMap((turret) => turret.guns.map((module) => ({ kind: 'gun' as const, module }))),
  ...vehicle.engines.map((module) => ({ kind: 'engine' as const, module })),
  ...vehicle.radios.map((module) => ({ kind: 'radio' as const, module }))
];

const moduleData = ({ kind, module }: VehicleModule): Record<string, unknown> => {
  if (kind === 'turret' && 'guns' in module && Array.isArray(module.guns)) {
    return { ...module, guns: module.guns.map((gun: ModuleBase) => gun.name) };
  }

  return { ...module };
};

const compatibleTanks = ({ filter, vehicles }: CompatibleTanksInput): number[] =>
  vehicles.filter((vehicle) => matchesVehicleFilter({ filter, vehicle })).map((vehicle) => vehicle.tankId);

const tryLoadout = ({ vehicle, preset, warnings }: TryLoadoutInput): FinalStats | undefined => {
  try {
    return calculateLoadout({ vehicle, modules: preset });
  } catch (error) {
    warnings.push(`Loadout ${preset} failed for ${vehicle.tag}: ${describe(error)}`);

    return undefined;
  }
};

const buildVehicleRows = (vehicles: VehicleSpec[]): VehicleRow[] => {
  const tankIdByTag = new Map(vehicles.map((vehicle) => [vehicle.tag, vehicle.tankId]));
  const nextByTank = new Map<number, NextTank[]>();
  const prevByTank = new Map<number, number[]>();

  for (const vehicle of vehicles) {
    const next = vehicleModules(vehicle)
      .flatMap(({ module }) => module.unlocks)
      .filter((unlock) => unlock.type === 'vehicle')
      .flatMap((unlock) => {
        const tankId = tankIdByTag.get(unlock.name);

        return tankId === undefined ? [] : [{ tankId, tag: unlock.name, xp: unlock.cost }];
      });

    nextByTank.set(vehicle.tankId, next);

    for (const item of next) {
      prevByTank.set(item.tankId, [...(prevByTank.get(item.tankId) ?? []), vehicle.tankId]);
    }
  }

  return vehicles.map((vehicle) => {
    const modules = vehicleModules(vehicle);
    const idByName = new Map(modules.map(({ kind, module }) => [`${kind}:${module.name}`, module.moduleId]));

    const modulesTree: ModuleTreeNode[] = modules.map(({ kind, module }) => ({
      moduleId: module.moduleId,
      type: MODULE_TYPE[kind],
      name: module.name,
      tier: module.tier,
      unlocks: module.unlocks.map((unlock) => ({
        type: unlock.type,
        name: unlock.name,
        id: unlock.type === 'vehicle' ? tankIdByTag.get(unlock.name) : idByName.get(`${unlock.type}:${unlock.name}`),
        xp: unlock.cost
      }))
    }));

    return {
      tankId: vehicle.tankId,
      tag: vehicle.tag,
      name: vehicle.name,
      shortName: vehicle.shortName,
      slug: slugify(vehicle.tag),
      nation: vehicle.nation,
      type: VEHICLE_TYPE[vehicle.type],
      tier: vehicle.tier,
      isPremium: vehicle.isPremium,
      isCollectible: vehicle.isCollectible,
      isWheeled: vehicle.isWheeled,
      ...prices(vehicle.price),
      specs: vehicle,
      crew: vehicle.crew,
      modulesTree,
      nextTanks: nextByTank.get(vehicle.tankId) ?? [],
      prevTankIds: [...new Set(prevByTank.get(vehicle.tankId) ?? [])]
    };
  });
};

const buildModuleRows = (vehicles: VehicleSpec[]): ModuleRow[] => {
  const rows = new Map<number, ModuleRow>();

  for (const vehicle of vehicles) {
    for (const { kind, module } of vehicleModules(vehicle)) {
      if (module.moduleId < 0) {
        continue;
      }

      const existing = rows.get(module.moduleId);

      if (existing) {
        existing.tankIds = [...new Set([...existing.tankIds, vehicle.tankId])];

        continue;
      }

      rows.set(module.moduleId, {
        moduleId: module.moduleId,
        name: module.displayName,
        type: MODULE_TYPE[kind],
        nation: vehicle.nation,
        tier: module.tier ?? vehicle.tier,
        priceCredit: module.price?.currency === 'credits' ? module.price.amount : undefined,
        weight: module.weight,
        tankIds: [vehicle.tankId],
        data: moduleData({ kind, module })
      });
    }
  }

  return [...rows.values()];
};

const deviceRow = ({ device, vehicles }: DeviceRowInput): ProvisionRow => ({
  provisionId: device.provisionId,
  name: device.displayName,
  tag: device.name,
  type: PROVISION_TYPE.optionalDevice,
  description: device.descriptionKey,
  image: device.icon,
  ...prices(device.price),
  tankIds: compatibleTanks({ filter: device.vehicleFilter, vehicles }),
  data: { ...device }
});

const equipmentRow = ({ item, vehicles }: EquipmentRowInput): ProvisionRow => ({
  provisionId: item.provisionId,
  name: item.displayName,
  tag: item.name,
  type: item.kind === 'directive' ? PROVISION_TYPE.directive : PROVISION_TYPE.consumable,
  description: item.descriptionKey,
  image: item.icon,
  ...prices(item.price),
  tankIds: compatibleTanks({ filter: item.vehicleFilter, vehicles }),
  data: { ...item }
});

const buildProvisionRows = ({ data }: CreateImportPlanInput): ProvisionRow[] => {
  const { vehicles, postProgression } = data;
  const tanksByModification = new Map<string, number[]>();

  for (const vehicle of vehicles) {
    for (const step of resolveVehicleProgression({
      progression: postProgression,
      treeName: vehicle.postProgressionTree,
      vehicleTier: vehicle.tier
    })) {
      for (const modification of [step.modification, ...(step.pair ?? [])]) {
        if (modification) {
          tanksByModification.set(modification.name, [...(tanksByModification.get(modification.name) ?? []), vehicle.tankId]);
        }
      }
    }
  }

  return [
    ...data.optionalDevices.map((device) => deviceRow({ device, vehicles })),
    ...data.equipment.filter((item) => item.kind === 'consumable' || item.kind === 'directive').map((item) => equipmentRow({ item, vehicles })),
    ...postProgression.modifications.map((modification) => ({
      provisionId: modification.provisionId,
      name: modification.locName ?? modification.name,
      tag: modification.name,
      type: PROVISION_TYPE.fieldModification,
      image: modification.imgName,
      tankIds: [...new Set(tanksByModification.get(modification.name) ?? [])],
      data: { ...modification }
    }))
  ];
};

export const createImportPlan = ({ data }: CreateImportPlanInput): ImportPlan => {
  const warnings = [...data.warnings];
  const version = data.version ?? data.revision.sha;
  const profiles: ProfileRow[] = [];
  const summaries = new Map<number, VehicleSummary>();

  for (const vehicle of data.vehicles) {
    const stock = tryLoadout({ vehicle, preset: 'stock', warnings });
    const top = tryLoadout({ vehicle, preset: 'top', warnings });

    for (const [profileId, stats] of [
      [PROFILE.stock, stock],
      [PROFILE.top, top]
    ] as const) {
      if (stats) {
        profiles.push({
          tankId: vehicle.tankId,
          profileId,
          isDefault: profileId === PROFILE.stock,
          moduleIds: stats.moduleIds,
          data: profileStats(stats)
        });
      }
    }

    summaries.set(vehicle.tankId, summarizeVehicle({ vehicle, stock, top }));
  }

  const crewRoles: CrewRoleRow[] = data.crew.roles.map((role) => ({ role: role.role, name: role.displayName, skills: role.skills }));

  const crewSkills: CrewSkillRow[] = data.crew.skills.map((skill) => ({
    skill: skill.name,
    name: skill.name,
    type: skill.typeName,
    roles: skill.roles,
    isCommon: skill.isCommon,
    data: { ...skill }
  }));

  const arenas: ArenaRow[] = data.arenas.map((arena) => ({
    arenaId: arena.arenaId,
    name: arena.displayName,
    slug: slugify(arena.arenaId),
    camouflageType: arena.camouflageKind,
    sizeMeters: arena.sizeMeters,
    modes: arena.gameplayTypes,
    image: minimapUrl({ sourceId: data.revision.sourceId, path: arena.minimapImage }),
    data: { ...arena }
  }));

  const entries: EntryRow[] = [
    { kind: ENTRY_KIND.meta, key: 'revision', data: { ...data.revision, version, warnings: warnings.length } },
    ...data.vehicles.map((vehicle) => ({ kind: ENTRY_KIND.vehicle, key: vehicle.tag, data: vehicle })),
    ...data.shells.map((shell) => ({ kind: ENTRY_KIND.shell, key: `${shell.nation}:${shell.name}`, data: shell })),
    ...data.optionalDevices.map((device) => ({ kind: ENTRY_KIND.optionalDevice, key: device.name, data: device })),
    ...data.equipment.map((item) => ({ kind: ENTRY_KIND.equipment, key: item.name, data: item })),
    ...data.crew.skills.map((skill) => ({ kind: ENTRY_KIND.crewSkill, key: skill.name, data: skill })),
    ...data.crew.roles.map((role) => ({ kind: ENTRY_KIND.crewRole, key: role.role, data: role })),
    ...data.postProgression.trees.map((tree) => ({ kind: ENTRY_KIND.progressionTree, key: tree.name, data: tree })),
    ...data.postProgression.modifications.map((item) => ({ kind: ENTRY_KIND.fieldModification, key: item.name, data: item })),
    ...data.postProgression.pairs.map((item) => ({ kind: ENTRY_KIND.modificationPair, key: item.name, data: item })),
    ...data.arenas.map((arena) => ({ kind: ENTRY_KIND.arena, key: arena.arenaId, data: arena }))
  ];

  return {
    version,
    title: `${data.revision.sourceId} ${version}`,
    revision: data.revision,
    vehicles: buildVehicleRows(data.vehicles),
    profiles,
    modules: buildModuleRows(data.vehicles),
    provisions: buildProvisionRows({ data }),
    crewRoles,
    crewSkills,
    arenas,
    entries,
    summaries,
    warnings
  };
};
