import type { ArmorGunModuleData, ArmorModulesData, ArmorTurretModuleData } from '@otmetki/schemas';

export type ArmorInspectContextValue = {
  modules: ArmorModulesData;
  turret: ArmorTurretModuleData | undefined;
  gun: ArmorGunModuleData | undefined;
  setTurret: (name: string) => void;
  setGun: (name: string) => void;
};
