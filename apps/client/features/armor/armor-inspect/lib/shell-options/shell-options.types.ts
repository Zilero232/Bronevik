import type { ArmorGunModuleData, ArmorShellOptionData } from '@bronevik/schemas';

export type PickShellInput = {
  gun: ArmorGunModuleData | undefined;
  shellName?: string;
};

export type ResolveShellInput = {
  option: ArmorShellOptionData;
  distance: number;
};
