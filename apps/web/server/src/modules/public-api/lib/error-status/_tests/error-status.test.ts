import { HttpStatus } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import { AppNotFoundException } from '../../../../../common/exceptions';
import { LestaNetworkError } from '../../../../../lib/lesta';
import { errorStatus } from '../error-status';

describe('errorStatus', () => {
  it('keeps the status and the code of an app exception', () => {
    expect(errorStatus(new AppNotFoundException('PLAYER_NOT_FOUND', 'no player'))).toEqual({
      status: HttpStatus.NOT_FOUND,
      code: 'PLAYER_NOT_FOUND'
    });
  });

  it('reports a Lesta outage the way the exception filter answers it', () => {
    expect(errorStatus(new LestaNetworkError({ method: 'account/info', cause: new Error('down') }))).toEqual({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      code: 'LESTA_UNAVAILABLE'
    });
  });

  it('treats anything else as an internal error', () => {
    expect(errorStatus(new Error('boom'))).toEqual({ status: HttpStatus.INTERNAL_SERVER_ERROR, code: 'INTERNAL_ERROR' });
  });
});
