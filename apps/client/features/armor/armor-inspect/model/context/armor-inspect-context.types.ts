import type { ArmorGunModuleData, ArmorModulesData, ArmorShellOptionData, ArmorTurretModuleData } from '@bronevik/schemas';
import type { ReactNode } from 'react';

import type { ArmorShellState } from '@/entities/armor/armor-model';

import type { ARMOR_LAYERS } from '../../config';

export type ArmorLayerKey = (typeof ARMOR_LAYERS)[number];

export type ArmorInspectContextValue = {
  modules: ArmorModulesData;
  turret: ArmorTurretModuleData | undefined;
  gun: ArmorGunModuleData | undefined;
  shellOption: ArmorShellOptionData | undefined;
  shellState: ArmorShellState | undefined;
  distance: number;
  randomness: number;
  layers: ArmorLayerKey[];
  setTurret: (name: string) => void;
  setGun: (name: string) => void;
  setShell: (name: string) => void;
  setDistance: (distance: number) => void;
  setRandomness: (randomness: number) => void;
  setLayers: (layers: ArmorLayerKey[]) => void;
};

export type ArmorInspectProviderProps = {
  modules: ArmorModulesData;
  children: ReactNode;
};
