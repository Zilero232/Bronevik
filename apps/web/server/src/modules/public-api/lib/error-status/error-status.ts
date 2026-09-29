import { HttpException, HttpStatus } from '@nestjs/common';
import { isPlainObject, isString } from 'remeda';

import type { ErrorStatus } from './error-status.types';

import { isLestaError, LESTA_NOT_CONNECTED } from '../../../../common/filters';
import { LestaNotConfiguredError } from '../../../../lib/lesta';

export const errorStatus = (error: unknown): ErrorStatus => {
  if (error instanceof HttpException) {
    const body = error.getResponse();

    return { status: error.getStatus(), code: isPlainObject(body) && isString(body.code) ? body.code : null };
  }

  if (error instanceof LestaNotConfiguredError) {
    return { status: LESTA_NOT_CONNECTED.status, code: LESTA_NOT_CONNECTED.code };
  }

  if (isLestaError(error)) {
    return { status: HttpStatus.SERVICE_UNAVAILABLE, code: 'LESTA_UNAVAILABLE' };
  }

  return { status: HttpStatus.INTERNAL_SERVER_ERROR, code: 'INTERNAL_ERROR' };
};
