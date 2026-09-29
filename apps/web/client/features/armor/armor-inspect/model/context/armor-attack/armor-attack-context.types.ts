import type { ArmorAttackerGunData, ArmorShellOptionData, VehicleSummary } from '@otmetki/schemas';

import type { ArmorShellState } from '@/entities/armor/armor-model';

import type { ARMOR_LAYERS, RANDOMNESS_KEYS } from '../../../config';

export type ArmorLayerKey = (typeof ARMOR_LAYERS)[number];

export type RandomnessKey = (typeof RANDOMNESS_KEYS)[number];

export type ArmorAttackContextValue = {
  attackerSlug: string | null;
  guns: ArmorAttackerGunData[];
  gun: ArmorAttackerGunData | undefined;
  shellOption: ArmorShellOptionData | undefined;
  shellState: ArmorShellState | undefined;
  distance: number;
  randomness: number;
  randomnessKey: RandomnessKey;
  layers: ArmorLayerKey[];
  heatmap: boolean;
  isAttackerLoading: boolean;
  isAttackerError: boolean;
  setAttacker: (vehicle: Pick<VehicleSummary, 'slug'> | null) => void;
  setGun: (name: string) => void;
  setShell: (name: string) => void;
  setDistance: (distance: number) => void;
  setRandomness: (key: RandomnessKey) => void;
  setLayers: (layers: ArmorLayerKey[]) => void;
  setHeatmap: (heatmap: boolean) => void;
};
