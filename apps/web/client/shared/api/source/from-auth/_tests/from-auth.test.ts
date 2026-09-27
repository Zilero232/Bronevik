import { describe, expect, it } from 'vitest';

import { fromAuth, isNotFoundError, isUnauthorizedError } from '../..';

describe('fromAuth', () => {
  it('resolves with the data of a successful auth call', async () => {
    await expect(fromAuth(Promise.resolve({ data: 1, error: null }))).resolves.toBe(1);
  });

  it('turns a 401 from the auth server into an unauthorized error', async () => {
    await expect(fromAuth(Promise.resolve({ data: null, error: { status: 401 } }))).rejects.toSatisfy(isUnauthorizedError);
  });

  it('turns a 404 into a not-found error', async () => {
    await expect(fromAuth(Promise.resolve({ data: null, error: { status: 404 } }))).rejects.toSatisfy(isNotFoundError);
  });

  it('rejects other failures with the server message', async () => {
    await expect(fromAuth(Promise.resolve({ data: null, error: { status: 500, message: 'boom' } }))).rejects.toThrow('boom');
  });
});
