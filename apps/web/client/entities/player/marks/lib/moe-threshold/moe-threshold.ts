import type { DeltaVerdict } from '@/shared/lib';

import { deltaVerdict } from '@/shared/lib';

export const thresholdVerdict = (delta: number | null): DeltaVerdict => deltaVerdict({ value: delta ?? Number.NaN, isLowerBetter: true });
