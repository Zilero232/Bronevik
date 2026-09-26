import type { ApiUsageDaily } from '../../../../../generated';

export type UsageRow = Pick<ApiUsageDaily, 'endpoint' | 'errors' | 'requests' | 'throttled'> & {
  day: string;
  latencyMsTotal: number;
};

export type UsagePointInput = {
  day: string;
  rows: readonly UsageRow[];
};

export type TopEndpoint = {
  endpoint: string;
  requests: number;
};
