'use client';

import { useFormatter } from 'next-intl';

import type { TargetValues } from '../../../lib/calc-defaults';

import { TARGET } from '../../../config';
import { averageCurve, battlesToAverage } from '../../../lib/battles-to-target';

export const useTargetResults = (values: TargetValues) => {
  const format = useFormatter();

  const { digits, suffix } = TARGET.metrics[values.metric];
  const input = { battles: values.battles ?? 0, current: values.current ?? 0, expected: values.expected ?? 0, target: values.target ?? 0 };
  const outcome = battlesToAverage(input);
  const curve =
    outcome.kind === 'battles'
      ? averageCurve({ ...input, horizon: Math.ceil(outcome.battles * TARGET.curveOvershoot), points: TARGET.curvePoints })
      : [];

  const formatValue = (value: number) => `${format.number(value, { maximumFractionDigits: digits })}${suffix}`;

  return { input, outcome, curve, formatValue };
};
