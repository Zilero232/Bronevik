import type { ArmorAttackerGunData, ArmorShellOptionData } from '@otmetki/schemas';

export type PickGunInput = {
  guns: readonly ArmorAttackerGunData[];
  gunName?: string | null;
  fallbackName?: string;
};

export type PickShellInput = {
  gun: Pick<ArmorAttackerGunData, 'shells'> | undefined;
  shellName?: string | null;
};

export type ResolveShellInput = {
  option: ArmorShellOptionData;
  distance: number;
};
