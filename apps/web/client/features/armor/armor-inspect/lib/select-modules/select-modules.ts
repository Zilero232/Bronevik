import type { ModuleSelection, ResolveSelectionInput } from './select-modules.types';

export const resolveSelection = ({ modules, turretName, gunName }: ResolveSelectionInput): ModuleSelection => {
  const turret = modules.turrets.find(({ name }) => name === turretName) ?? modules.turrets.at(-1);
  const gun = turret?.guns.find(({ name }) => name === gunName) ?? turret?.guns.at(-1);

  return { turret, gun };
};
