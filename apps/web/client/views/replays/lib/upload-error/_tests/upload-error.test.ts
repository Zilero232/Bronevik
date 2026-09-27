import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { replayUploadErrorKind } from '../upload-error';

const apiError = (status: number, code: string) =>
  new AxiosError('failed', String(status), undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { statusCode: status, code, error: 'failed' }
  });

describe('replayUploadErrorKind', () => {
  it('names an unreadable file instead of a generic failure', () => {
    expect(replayUploadErrorKind(apiError(400, 'REPLAY_INVALID'))).toBe('invalid');
  });

  it('treats a duplicate upload as a conflict', () => {
    expect(replayUploadErrorKind(apiError(409, 'REPLAY_DUPLICATE'))).toBe('conflict');
  });

  it('falls back to the community error kinds', () => {
    expect(replayUploadErrorKind(apiError(429, 'RATE_LIMITED'))).toBe('rateLimited');
    expect(replayUploadErrorKind(new Error('offline'))).toBe('unknown');
  });
});
