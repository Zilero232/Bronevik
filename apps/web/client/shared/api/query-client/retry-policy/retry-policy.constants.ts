export const QUERY_RETRY = {
  networkAttempts: 2,
  gatewayAttempts: 1,
  gatewayStatuses: [502, 504]
} as const;
