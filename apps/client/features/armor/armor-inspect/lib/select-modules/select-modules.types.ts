import type { ArmorGunModuleData, ArmorModulesData, ArmorTurretModuleData } from '@bronevik/schemas';

export type ResolveSelectionInput = {
  modules: ArmorModulesData;
  turretName?: string;
  gunName?: string;
};

export type ModuleSelection = {
  turret: ArmorTurretModuleData | undefined;
  gun: ArmorGunModuleData | undefined;
};
