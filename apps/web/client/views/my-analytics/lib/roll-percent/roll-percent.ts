import type { RngBucket } from '@otmetki/schemas';

import { ANALYTICS_VIEW } from '../../config';

const roundHalfAway = (value: number): number =>
  (Math.sign(value) * Math.round(Math.abs(value) * ANALYTICS_VIEW.labelPrecision)) / ANALYTICS_VIEW.labelPrecision;

export const bucketMidpoint = ({ from, to }: Pick<RngBucket, 'from' | 'to'>): number =>
  roundHalfAway(((from + to) / 2) * ANALYTICS_VIEW.percentScale);
