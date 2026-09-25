import type { Loadout } from '@bronevik/schemas';

import type { BuildModule } from '../../../lib/build-catalog';

export type UseBuildStatsInput = {
  tankId: number;
  loadout: Loadout | null;
  modules: readonly BuildModule[];
  still: boolean;
};
