import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { NotFoundError, UnauthorizedError } from '@/shared/api/source';

import { apiErrorCode, communityErrorKey, communityErrorKind } from '../api-error';

const axiosFailure = (status: number, data: unknown) =>
  new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    data,
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() }
  });

describe('apiErrorCode', () => {
  it('reads the code from a server error body', () => {
    expect(apiErrorCode(axiosFailure(403, { error: 'Only clan officers can recruit', code: 'FORBIDDEN' }))).toBe('FORBIDDEN');
  });

  it('returns null when the body is not an api error', () => {
    expect(apiErrorCode(axiosFailure(502, '<html>bad gateway</html>'))).toBeNull();
  });

  it('returns null for a non-http error', () => {
    expect(apiErrorCode(new Error('boom'))).toBeNull();
  });
});

describe('communityErrorKind', () => {
  it('maps a forbidden code to the forbidden kind', () => {
    expect(communityErrorKind(axiosFailure(403, { error: 'x', code: 'FORBIDDEN' }))).toBe('forbidden');
  });

  it('maps a conflict code to the conflict kind', () => {
    expect(communityErrorKind(axiosFailure(409, { error: 'Registration is closed', code: 'CONFLICT' }))).toBe('conflict');
  });

  it('treats the normalised 401 and 404 errors as their own kinds', () => {
    expect(communityErrorKind(new UnauthorizedError())).toBe('unauthorized');
    expect(communityErrorKind(new NotFoundError())).toBe('notFound');
  });

  it('falls back to unknown for codes outside the community set', () => {
    expect(communityErrorKind(axiosFailure(500, { error: 'x', code: 'INTERNAL_ERROR' }))).toBe('unknown');
  });
});

describe('communityErrorKey', () => {
  it('builds the message key of the error kind inside the namespace', () => {
    expect(communityErrorKey('tournaments')(axiosFailure(409, { error: 'x', code: 'CONFLICT' }))).toBe('tournaments.errors.conflict');
    expect(communityErrorKey('coaching')(new Error('boom'))).toBe('coaching.errors.unknown');
  });
});
