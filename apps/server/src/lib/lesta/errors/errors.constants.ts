export const LESTA_ERROR_CODE = {
  invalidApplicationId: 'INVALID_APPLICATION_ID',
  requestLimitExceeded: 'REQUEST_LIMIT_EXCEEDED',
  sourceNotAvailable: 'SOURCE_NOT_AVAILABLE',
  accountIdListLimitExceeded: 'ACCOUNT_ID_LIST_LIMIT_EXCEEDED',
  invalidAccessToken: 'INVALID_ACCESS_TOKEN',
  applicationIsBlocked: 'APPLICATION_IS_BLOCKED',
  invalidIpAddress: 'INVALID_IP_ADDRESS',
  methodNotFound: 'METHOD_NOT_FOUND',
  methodDisabled: 'METHOD_DISABLED',
  notEnoughSearchLength: 'NOT_ENOUGH_SEARCH_LENGTH',
  invalidResponse: 'INVALID_RESPONSE'
} as const;

export const RETRYABLE_LESTA_CODES: ReadonlySet<string> = new Set([LESTA_ERROR_CODE.requestLimitExceeded, LESTA_ERROR_CODE.sourceNotAvailable]);

export const RETRYABLE_HTTP_STATUS = {
  tooManyRequests: 429,
  serverErrorFrom: 500
} as const;
