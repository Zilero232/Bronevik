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
  invalidSearch: 'INVALID_SEARCH',
  searchNotSpecified: 'SEARCH_NOT_SPECIFIED',
  invalidResponse: 'INVALID_RESPONSE'
} as const;

export const EXTRA_REJECTION = {
  field: 'extra',
  codePattern: /EXTRA/u
} as const;

export const RETRYABLE_LESTA_CODES: ReadonlySet<string> = new Set([LESTA_ERROR_CODE.requestLimitExceeded, LESTA_ERROR_CODE.sourceNotAvailable]);

export const RETRYABLE_HTTP_STATUS = {
  tooManyRequests: 429,
  serverErrorFrom: 500
} as const;

export const SEARCH_REJECTION = {
  field: 'search',
  codes: new Set<string>([LESTA_ERROR_CODE.notEnoughSearchLength, LESTA_ERROR_CODE.invalidSearch, LESTA_ERROR_CODE.searchNotSpecified])
} as const;
