import type { RngBucket } from '@otmetki/schemas';

import { round } from 'remeda';

import { ANALYTICS_VIEW } from '../../config';

const roundHalfAway = (value: number): number => Math.sign(value) * round(Math.abs(value), ANALYTICS_VIEW.labelDigits);

export const bucketMidpoint = ({ from, to }: Pick<RngBucket, 'from' | 'to'>): number =>
  roundHalfAway(((from + to) / 2) * ANALYTICS_VIEW.percentScale);
