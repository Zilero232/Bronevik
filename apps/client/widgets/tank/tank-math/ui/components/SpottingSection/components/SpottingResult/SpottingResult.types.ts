import type { BadgeTone } from '@/ui-kit';

import type { SpottingView } from '../../../../../lib/spotting-view';

export type SpottingResultProps = {
  view: SpottingView;
  tone: BadgeTone;
  meters: (value: number) => string;
  percent: (value: number) => string;
};
