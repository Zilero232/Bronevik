export type UsageRow = {
  day: string;
  endpoint: string;
  requests: number;
  errors: number;
  throttled: number;
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
