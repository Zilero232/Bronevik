import type { PlatoonQuery } from '../../platoons.types';

export type Wn8RangeInput = Pick<PlatoonQuery, 'maxWn8' | 'minWn8'> & { wn8: number | null };
