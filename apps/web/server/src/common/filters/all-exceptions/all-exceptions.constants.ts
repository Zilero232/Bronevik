import type { ApiErrorCode } from '@otmetki/schemas';

import { HttpStatus } from '@nestjs/common';

import type { ModErrorCode } from '../../exceptions';

export const STATUS_TO_CODE: Partial<Record<number, ApiErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: 'VALIDATION_FAILED',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.PAYLOAD_TOO_LARGE]: 'VALIDATION_FAILED',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_FAILED',
  [HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMITED',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'LESTA_UNAVAILABLE'
};

export const LESTA_NOT_CONNECTED = {
  status: HttpStatus.NOT_FOUND,
  code: 'INTEGRATION_UNAVAILABLE',
  error: 'Lesta API is not connected'
} as const satisfies { status: number; code: ApiErrorCode; error: string };

export const MOD_REPLY = {
  pathPrefixes: ['/mod/', '/replays/mod'],
  serverTimeHeader: 'x-otmetki-server-time'
} as const;

export const STATUS_TO_MOD_ERROR: Partial<Record<number, ModErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: 'invalid_payload',
  [HttpStatus.UNAUTHORIZED]: 'unknown_device',
  [HttpStatus.FORBIDDEN]: 'account_mismatch',
  [HttpStatus.NOT_FOUND]: 'invalid_payload',
  [HttpStatus.PAYLOAD_TOO_LARGE]: 'too_large',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'invalid_payload',
  [HttpStatus.TOO_MANY_REQUESTS]: 'rate_limited'
};

export const PRISMA_TO_HTTP: Partial<Record<string, { status: number; code: ApiErrorCode }>> = {
  P2025: { status: HttpStatus.NOT_FOUND, code: 'NOT_FOUND' },
  P2002: { status: HttpStatus.CONFLICT, code: 'CONFLICT' }
};

export const MOD_CONTRACT_PATHS: readonly string[] = ['/mod/bind', '/mod/ingest'];
