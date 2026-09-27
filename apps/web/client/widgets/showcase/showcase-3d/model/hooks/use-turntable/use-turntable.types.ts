import type { RefObject } from 'react';

import type { HologramMaterials } from '../../../lib/hologram-material';
import type { ShowcaseRig } from '../../../lib/showcase-rig';
import type { ShowcaseDrag } from '../../showcase.types';

export type UseTurntableInput = {
  rig: ShowcaseRig;
  materials: HologramMaterials;
  sweep: number;
  isLive: boolean;
  drag: RefObject<ShowcaseDrag>;
};
