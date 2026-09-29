export const HTTP_STATUS = {
  unauthorized: 401,
  notFound: 404,
  conflict: 409
} as const;

export const PLUS_REQUIRED_CODES = ['SUBSCRIPTION_REQUIRED', 'PLAN_LIMIT_REACHED'] as const;
