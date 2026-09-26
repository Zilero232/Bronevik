import type { ApiUsage, ApiUsagePoint } from '@bronevik/schemas';

import { clamp, sumBy } from 'remeda';

import type { QuotaShareInput, QuotaTone, TopEndpointShare, UsageSeries, UsageTotals } from './usage-stats.types';

import { USAGE, USAGE_STATS } from '../../config';

export const usageSeries = (history: ApiUsagePoint[]): UsageSeries => ({
  days: history.map(({ day }) => day),
  requests: history.map(({ requests }) => requests),
  errors: history.map(({ errors }) => errors),
  throttled: history.map(({ throttled }) => throttled)
});

export const quotaShare = ({ used, limit }: QuotaShareInput): number => (limit > 0 ? clamp(used / limit, { min: 0, max: 1 }) : 0);

export const usageTotals = (history: ApiUsagePoint[]): UsageTotals => {
  const requests = sumBy(history, (point) => point.requests);
  const errors = sumBy(history, (point) => point.errors);

  return { requests, errors, throttled: sumBy(history, (point) => point.throttled), errorRate: requests > 0 ? errors / requests : 0 };
};

export const quotaTone = (share: number): QuotaTone => {
  if (share >= USAGE_STATS.dangerShare) {
    return 'bad';
  }

  return share >= USAGE_STATS.warnShare ? 'average' : 'accent';
};

export const topEndpointShares = (endpoints: ApiUsage['topEndpoints']): TopEndpointShare[] => {
  const top = endpoints.slice(0, USAGE.topEndpoints);
  const peak = Math.max(0, ...top.map(({ requests }) => requests));

  return top.map(({ endpoint, requests }) => ({ endpoint, requests, share: quotaShare({ used: requests, limit: peak }) }));
};
