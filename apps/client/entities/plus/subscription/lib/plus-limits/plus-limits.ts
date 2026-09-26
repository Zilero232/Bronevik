import { plusLimit } from '@otmetki/schemas';
import { mapToObj } from 'remeda';

import type { PlusLimits } from './plus-limits.types';

import { PLUS_COUNT_KEYS } from '../../config';

export const plusLimitsFor = (isPlus: boolean): PlusLimits => mapToObj(PLUS_COUNT_KEYS, (key) => [key, plusLimit({ key, isPlus })]);
