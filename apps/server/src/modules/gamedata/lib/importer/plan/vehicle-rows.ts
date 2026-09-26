import type { VehicleSpec } from '@bronevik/gamedata';

import { unique } from 'remeda';

import type { ModuleTreeNode, NextTank, VehicleRow } from '../importer.types';

import { slugify } from '../../../../../common/lib';
import { MODULE_TYPE, VEHICLE_TYPE } from '../importer.constants';
import { prices, vehicleModules } from './vehicle-modules';

export const buildVehicleRows = (vehicles: VehicleSpec[]): VehicleRow[] => {
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
      prevTankIds: unique(prevByTank.get(vehicle.tankId) ?? [])
    };
  });
};
