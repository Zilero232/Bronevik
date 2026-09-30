import type { MyModeLine } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { NotFoundError, PlusRequiredError, UnauthorizedError } from '@/shared/api/source';

import type { MyModeStatusInput } from '../my-mode-status.types';

import { MY_MODE } from '../../../config';
import { myModeStatus, shouldRetryMyMode } from '../my-mode-status';

const LINE: MyModeLine = {
  mode: 'frontline',
  battles: 12,
  wins: 6,
  winRate: 50,
  avgDamage: 1000,
  avgXp: 800,
  avgFrags: 1,
  survivalRate: 30,
  lastBattleAt: null,
  tanks: []
};

const READY: MyModeStatusInput = { isSignedIn: true, isSessionPending: false, isPending: false, error: null, line: LINE };

const PLUS_REQUIRED = new PlusRequiredError({ code: 'SUBSCRIPTION_REQUIRED', details: {}, message: 'plus' });

describe('myModeStatus', () => {
  it('shows the line once it has battles', () => {
    expect(myModeStatus(READY)).toBe('ready');
  });

  it('waits for the session before deciding anything', () => {
    expect(myModeStatus({ ...READY, isSignedIn: false, isSessionPending: true })).toBe('session');
  });

  it('asks a signed-out visitor to log in', () => {
    expect(myModeStatus({ ...READY, isSignedIn: false, line: null })).toBe('signedOut');
    expect(myModeStatus({ ...READY, error: new UnauthorizedError() })).toBe('signedOut');
  });

  it('asks to link a Lesta account on 404', () => {
    expect(myModeStatus({ ...READY, error: new NotFoundError(), line: null })).toBe('noAccount');
  });

  it('reports other failures as errors', () => {
    expect(myModeStatus({ ...READY, error: new Error('boom'), line: null })).toBe('error');
  });

  it('is empty without battles in the mode', () => {
    expect(myModeStatus({ ...READY, line: null })).toBe('empty');
    expect(myModeStatus({ ...READY, line: { ...LINE, battles: 0 } })).toBe('empty');
  });
});

describe('shouldRetryMyMode', () => {
  it('never retries answers that will not change', () => {
    [PLUS_REQUIRED, new NotFoundError(), new UnauthorizedError()].forEach((error) => {
      expect(shouldRetryMyMode({ failureCount: 0, error })).toBe(false);
    });
  });

  it('retries other failures up to the limit', () => {
    expect(shouldRetryMyMode({ failureCount: 0, error: new Error('boom') })).toBe(true);
    expect(shouldRetryMyMode({ failureCount: MY_MODE.retryAttempts, error: new Error('boom') })).toBe(false);
  });
});
