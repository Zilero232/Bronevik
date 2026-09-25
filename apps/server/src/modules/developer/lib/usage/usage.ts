import type { ApiUsagePoint } from '@bronevik/schemas';

import { groupBy, sortBy, sumBy } from 'remeda';

import type { AddCountersInput, EndpointLabelInput, TopEndpoint, UsageCounters, UsagePointInput, UsageRow } from './usage.types';

import { API_USAGE } from '../../config';

export const usageDay = (date: Date): string => date.toISOString().slice(0, 10);

export const endpointLabel = ({ method, route }: EndpointLabelInput): string => `${method.toUpperCase()} ${route ?? API_USAGE.unmatchedEndpoint}`;

export const emptyCounters = (): UsageCounters => ({ requests: 0, errors: 0, throttled: 0, latencyMs: 0 });

export const addCounters = ({ left, right }: AddCountersInput): UsageCounters => ({
  requests: left.requests + right.requests,
  errors: left.errors + right.errors,
  throttled: left.throttled + right.throttled,
  latencyMs: left.latencyMs + right.latencyMs
});

const toPoint = ({ day, rows }: UsagePointInput): ApiUsagePoint => {
  const requests = sumBy(rows, (row) => row.requests);
  const latency = sumBy(rows, (row) => row.latencyMsTotal);

  return {
    day,
    requests,
    errors: sumBy(rows, (row) => row.errors),
    throttled: sumBy(rows, (row) => row.throttled),
    avgLatencyMs: requests > 0 ? Math.round(latency / requests) : null
  };
};

export const usagePoints = (rows: readonly UsageRow[]): ApiUsagePoint[] =>
  sortBy(Object.entries(groupBy(rows, (row) => row.day)), ([day]) => day).map(([day, dayRows]) => toPoint({ day, rows: dayRows }));

export const usagePointOf = ({ rows, day }: UsagePointInput): ApiUsagePoint => toPoint({ day, rows: rows.filter((row) => row.day === day) });

export const topEndpoints = (rows: readonly UsageRow[]): TopEndpoint[] =>
  sortBy(
    Object.entries(groupBy(rows, (row) => row.endpoint)).map(([endpoint, endpointRows]) => ({
      endpoint,
      requests: sumBy(endpointRows, (row) => row.requests)
    })),
    [(entry) => entry.requests, 'desc']
  ).slice(0, API_USAGE.topEndpoints);
