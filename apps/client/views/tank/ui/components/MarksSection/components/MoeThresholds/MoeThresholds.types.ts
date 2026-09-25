import type { MarkCount } from '@bronevik/icons';
import type { MoeThreshold } from '@bronevik/schemas';

import type { MoeKey } from '../../../../../lib';

export type MoeThresholdsProps = {
  moe: MoeThreshold;
};

export type MoePlateConfig = {
  key: MoeKey;
  percent: number;
  marks: MarkCount;
  isFeatured: boolean;
};
