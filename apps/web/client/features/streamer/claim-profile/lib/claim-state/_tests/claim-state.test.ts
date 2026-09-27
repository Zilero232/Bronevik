import type { StreamerClaim } from '@otmetki/schemas';

import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { fromServer } from '@/shared/api/source';

import { claimFailure, claimStage } from '../claim-state';

const CLAIM: StreamerClaim = {
  id: '6f1c2b1e-3a4d-4b8e-9f00-1234567890ab',
  slug: 'nick',
  method: 'bio_code',
  status: 'open',
  code: 'otmetki-a1b2c3',
  createdAt: '2026-09-26T10:00:00.000Z',
  resolvedAt: null
};

const httpError = (status: number) =>
  new AxiosError('failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    data: {},
    headers: {},
    config: { headers: new AxiosHeaders() }
  });

describe('claimStage', () => {
  it('starts with no claim', () => {
    expect(claimStage(null)).toBe('none');
  });

  it('waits for the code while a bio claim is open', () => {
    expect(claimStage(CLAIM)).toBe('code');
  });

  it('waits for a moderator on a manual claim', () => {
    expect(claimStage({ ...CLAIM, method: 'manual', code: null })).toBe('review');
  });

  it('reports the outcome once the claim is closed', () => {
    expect(claimStage({ ...CLAIM, status: 'resolved' })).toBe('resolved');
    expect(claimStage({ ...CLAIM, status: 'dismissed' })).toBe('dismissed');
  });
});

describe('claimFailure', () => {
  it('treats a missing or already claimed page as nothing to claim', async () => {
    const notFound: unknown = await fromServer(() => Promise.reject(httpError(404))).catch((error: unknown) => error);

    expect(claimFailure(notFound)).toBe('missing');
    expect(claimFailure(httpError(409))).toBe('missing');
  });

  it('treats anything else as a failure to retry', () => {
    expect(claimFailure(httpError(500))).toBe('failed');
    expect(claimFailure(new Error('offline'))).toBe('failed');
  });
});
