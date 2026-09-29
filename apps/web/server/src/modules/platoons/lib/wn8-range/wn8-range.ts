import type { Wn8RangeInput } from './wn8-range.types';

export const inWn8Range = ({ wn8, minWn8, maxWn8 }: Wn8RangeInput): boolean =>
  (minWn8 === undefined || (wn8 !== null && wn8 >= minWn8)) && (maxWn8 === undefined || (wn8 !== null && wn8 <= maxWn8));
