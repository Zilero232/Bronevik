import type { ModuleSelection, PickModuleInput, ResolvedModules, ResolveModulesInput } from '../loadout.types';

const pickModule = <T extends { name: string; tier?: number }>({ items, name, preset }: PickModuleInput<T>): T | undefined => {
  if (name) {
    const selected = items.find((item) => item.name === name);

    if (!selected) {
      throw new Error(`Unknown module ${name}`);
    }

    return selected;
  }

  if (preset === 'stock') {
    return items[0];
  }

  return items.reduce<T | undefined>((best, item) => (!best || (item.tier ?? 0) >= (best.tier ?? 0) ? item : best), undefined);
};

export const resolveModules = ({ vehicle, modules = 'top' }: ResolveModulesInput): ResolvedModules => {
  const preset = typeof modules === 'string' ? modules : 'top';
  const selection: ModuleSelection = typeof modules === 'string' ? {} : modules;
  const chassis = pickModule({ items: vehicle.chassis, name: selection.chassis, preset });
  const turret = pickModule({ items: vehicle.turrets, name: selection.turret, preset });
  const gun = turret ? pickModule({ items: turret.guns, name: selection.gun, preset }) : undefined;
  const engine = pickModule({ items: vehicle.engines, name: selection.engine, preset });
  const radio = pickModule({ items: vehicle.radios, name: selection.radio, preset });
  const fuelTank = pickModule({ items: vehicle.fuelTanks, name: selection.fuelTank, preset });

  if (!chassis || !turret || !gun || !engine || !radio) {
    throw new Error(`Vehicle ${vehicle.tag} has an incomplete module set`);
  }

  return { chassis, turret, gun, engine, radio, fuelTank };
};
