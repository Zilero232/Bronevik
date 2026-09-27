import type { RefObject } from 'react';

import type { ShowcaseRig } from '../../../lib/showcase-rig';
import type { ShowcaseDrag } from '../../showcase.types';

export type UseHologramStageInput = {
  rig: ShowcaseRig;
  sweep: number;
  isLive: boolean;
  drag: RefObject<ShowcaseDrag>;
};
