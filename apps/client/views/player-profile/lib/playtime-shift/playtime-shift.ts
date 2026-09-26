import { clamp } from 'remeda';

import { PLAYTIME } from '../../config';

export const playtimeShift = (rate: number | null) =>
  rate === null ? 0 : clamp((rate - PLAYTIME.neutralRate) / PLAYTIME.rateSpread, { min: -1, max: 1 });
