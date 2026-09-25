import type { FinalStats } from '@bronevik/gamedata';

import type { ProfileStats, SummarizeVehicleInput, VehicleSummary } from './importer.types';

export const profileStats = ({
  crew: _crew,
  factors: _factors,
  staticAttributes: _static,
  terrainResistance: _terrain,
  ...stats
}: FinalStats): ProfileStats => stats;

export const summarizeVehicle = ({ vehicle, stock, top }: SummarizeVehicleInput): VehicleSummary => {
  const guns: VehicleSummary['guns'] = {};

  for (const turret of vehicle.turrets) {
    for (const gun of turret.guns) {
      guns[`${turret.name}/${gun.name}`] = {
        reloadTime: gun.reloadTime,
        aimingTime: gun.aimingTime,
        dispersion: gun.shotDispersionRadius,
        shells: Object.fromEntries(gun.shots.map((shot) => [shot.shell, { damage: shot.damage?.armor ?? 0, penetration: shot.piercingPower.at100m }]))
      };
    }
  }

  return {
    tier: vehicle.tier,
    type: vehicle.type,
    isPremium: vehicle.isPremium,
    price: vehicle.price,
    armor: {
      hull: vehicle.hull.primaryArmor,
      turrets: Object.fromEntries(vehicle.turrets.map((turret) => [turret.name, turret.primaryArmor]))
    },
    stock: stock ? profileStats(stock) : undefined,
    top: top ? profileStats(top) : undefined,
    guns,
    engines: Object.fromEntries(vehicle.engines.map((engine) => [engine.name, engine.power])),
    chassis: Object.fromEntries(vehicle.chassis.map((chassis) => [chassis.name, chassis.rotationSpeed])),
    speed: vehicle.speedLimits
  };
};
