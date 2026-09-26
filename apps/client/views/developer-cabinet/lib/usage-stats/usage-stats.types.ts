import type { ApiUsagePoint } from '@otmetki/schemas';

export type QuotaShareInput = {
  used: number;
  limit: number;
};

export type UsageSeries = {
  days: string[];
  requests: number[];
  errors: number[];
  throttled: number[];
};

export type UsageTotals = Pick<ApiUsagePoint, 'errors' | 'requests' | 'throttled'> & {
  errorRate: number;
};

export type QuotaTone = 'accent' | 'average' | 'bad';

export type TopEndpointShare = {
  endpoint: string;
  requests: number;
  share: number;
};
