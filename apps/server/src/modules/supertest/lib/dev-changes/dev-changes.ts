import type { ParsedChange } from '../supertest-article';
import type { DevChangesInput, RoundInput } from './dev-changes.types';

import { SUPERTEST_DEV } from '../../config';
import { liveValue } from '../live-value';
import { paramMeta } from '../param-key';

const russian = (value: number): string => String(value).replace('.', ',');

const round = ({ value, digits }: RoundInput): number => Number(value.toFixed(digits));

export const devChanges = ({ stats, variant }: DevChangesInput): ParsedChange[] => {
  const plan = SUPERTEST_DEV.plans[variant % SUPERTEST_DEV.plans.length] ?? [];

  return plan.flatMap(({ param, label, shift, digits }) => {
    const live = liveValue({ param, label, stats });

    if (live === null || live <= 0) {
      return [];
    }

    const from = round({ value: live, digits });
    const to = round({ value: live * (1 + shift), digits });

    if (to === from) {
      return [];
    }

    return [{ param, label, from, to, unit: paramMeta(param)?.unit ?? null, raw: `${label}: ${russian(from)} → ${russian(to)}` }];
  });
};

export const devNewVehicleChanges = (): ParsedChange[] =>
  SUPERTEST_DEV.newVehicle.map(({ param, label, value, unit }) => ({
    param,
    label,
    from: null,
    to: value,
    unit,
    raw: `${label}: ${russian(value)}`
  }));
