export type UsageCounters = {
  requests: number;
  errors: number;
  throttled: number;
  latencyMs: number;
};

export type UsageRow = {
  day: string;
  endpoint: string;
  requests: number;
  errors: number;
  throttled: number;
  latencyMsTotal: number;
};

export type EndpointLabelInput = {
  method: string;
  route: string | undefined;
};

export type AddCountersInput = {
  left: UsageCounters;
  right: UsageCounters;
};

export type UsagePointInput = {
  day: string;
  rows: readonly UsageRow[];
};

export type TopEndpoint = {
  endpoint: string;
  requests: number;
};
