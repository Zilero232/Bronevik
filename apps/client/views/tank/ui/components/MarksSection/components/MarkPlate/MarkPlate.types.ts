import type { MarkCount } from '@bronevik/icons';

import type { MoeKey } from '../../../../../lib';

export type MarkPlateDelta = {
  days: number;
  value: number | null;
};

export type MarkPlateProps = {
  moeKey: MoeKey;
  percent: number;
  marks: MarkCount;
  value: number | null;
  deltas: MarkPlateDelta[];
  isFeatured: boolean;
};
