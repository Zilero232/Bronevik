import { max, min, subDays } from 'date-fns';

import type { HistoryWindow, HistoryWindowInput } from './history-window.types';

export const historyWindow = ({ from, to, now, policy }: HistoryWindowInput): HistoryWindow => {
  const end = to ? new Date(to) : now;
  const earliest = subDays(now, policy.limitDays);
  const requested = from ? new Date(from) : subDays(end, policy.defaultDays);
  const start = max([requested, earliest]);

  return { from: min([start, end]), to: end };
};
