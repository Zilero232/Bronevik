import type { ArmorGunModuleData, ArmorShellOptionData } from '@otmetki/schemas';

export type PickShellInput = {
  gun: ArmorGunModuleData | undefined;
  shellName?: string;
};

export type ResolveShellInput = {
  option: ArmorShellOptionData;
  distance: number;
};
