export type UsageCounters = {
  requests: number;
  errors: number;
  throttled: number;
  latencyMs: number;
};

export type EndpointLabelInput = {
  method: string;
  route: string | undefined;
};

export type AddCountersInput = {
  left: UsageCounters;
  right: UsageCounters;
};
