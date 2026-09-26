import type { BuildOptions, Loadout, VehicleSummary } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import type { BuildCatalog } from '../../lib/build-catalog';
import type { BuildSide } from '../../lib/stat-diff';

export type BuildContextValue = {
  vehicle: VehicleSummary;
  catalog: BuildCatalog;
  a: Loadout;
  b: Loadout | null;
  side: BuildSide;
  active: Loadout;
  isCompare: boolean;
  still: boolean;
  setSide: (side: BuildSide) => void;
  setStill: (still: boolean) => void;
  edit: (change: (loadout: Loadout) => Loadout) => void;
  setCompare: (isOn: boolean) => void;
  copyAToB: () => void;
  resetActive: () => void;
};

export type BuildProviderProps = {
  vehicle: VehicleSummary;
  options: BuildOptions;
  children: ReactNode;
};
