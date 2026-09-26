import type { RefObject } from 'react';

import type { ShowcaseMode } from '../../../lib/showcase-mode';
import type { ShowcaseDrag } from '../../../model/showcase.types';

export type ShowcaseCanvasProps = {
  slug: string;
  mode: Exclude<ShowcaseMode, 'flat'>;
  isActive: boolean;
  drag: RefObject<ShowcaseDrag>;
  onReady: (slug: string) => void;
};
