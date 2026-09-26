import { describe, expect, it, vi } from 'vitest';

import type { LestaTokenCheck, LestaTokenInfo, LestaTokenVerifier, VerifyLestaLoginInput } from '../lesta-id.types';

import { LESTA_ERROR_CODE, LestaApiError, LestaNetworkError } from '../../../lesta';
import { LESTA_ID } from '../lesta-id.constants';
import { safeCallbackUrl, verifyLestaLogin, withError } from '../lesta-id.verify';

const login: VerifyLestaLoginInput['login'] = { status: 'ok', accessToken: 'token', accountId: 7, nickname: 'FromQuery', expiresAt: 1_800_000_000 };

const lestaReturning = (info: (input: LestaTokenCheck) => Promise<Record<string, LestaTokenInfo | null>>): LestaTokenVerifier => ({
  account: { info: vi.fn(info) }
});

describe('verifyLestaLogin', () => {
  it('trusts the account only after Lesta honours the token', async () => {
    const lesta = lestaReturning(async () => ({
      [login.accountId]: { account_id: login.accountId, nickname: 'FromLesta', private: { credits: 1 } }
    }));

    const identity = await verifyLestaLogin({ login, lesta });

    expect(identity?.accountId).toBe(login.accountId);
    expect(identity?.nickname).toBe('FromLesta');
    expect(identity?.expiresAt.getTime()).toBe(login.expiresAt * 1000);
    expect(lesta.account.info).toHaveBeenCalledWith(expect.objectContaining({ accountIds: [login.accountId], accessToken: login.accessToken }));
  });

  it('refuses a token that does not unlock private data', async () => {
    const lesta = lestaReturning(async () => ({ [login.accountId]: { account_id: login.accountId, nickname: 'x', private: null } }));

    expect(await verifyLestaLogin({ login, lesta })).toBeNull();
  });

  it('refuses a callback whose account id is not the token owner', async () => {
    const lesta = lestaReturning(async () => ({ [login.accountId]: { account_id: login.accountId + 1, nickname: 'x', private: {} } }));

    expect(await verifyLestaLogin({ login, lesta })).toBeNull();
  });

  it('refuses an unknown account', async () => {
    const lesta = lestaReturning(async () => ({ [login.accountId]: null }));

    expect(await verifyLestaLogin({ login, lesta })).toBeNull();
  });

  it('refuses an invalid access token', async () => {
    const lesta = lestaReturning(async () => {
      throw new LestaApiError({ code: LESTA_ERROR_CODE.invalidAccessToken, method: 'account/info' });
    });

    expect(await verifyLestaLogin({ login, lesta })).toBeNull();
  });

  it('propagates an outage instead of calling it a bad token', async () => {
    const lesta = lestaReturning(async () => {
      throw new LestaNetworkError({ method: 'account/info', cause: new Error('down') });
    });

    await expect(verifyLestaLogin({ login, lesta })).rejects.toBeInstanceOf(LestaNetworkError);
  });
});

describe('safeCallbackUrl', () => {
  const webUrl = 'http://localhost:3000';

  it('keeps a path on the site', () => {
    expect(safeCallbackUrl({ requested: '/p/neki', webUrl })).toBe(`${webUrl}/p/neki`);
  });

  it('never redirects to another origin', () => {
    expect(safeCallbackUrl({ requested: 'https://evil.example/', webUrl })).toBe(webUrl);
    expect(safeCallbackUrl({ requested: '//evil.example/', webUrl })).toBe(webUrl);
    expect(safeCallbackUrl({ requested: '/\\evil.example/', webUrl })).toBe(webUrl);
  });

  it('keeps the query of a return path', () => {
    expect(safeCallbackUrl({ requested: '/en/plus?ref=abc', webUrl })).toBe(`${webUrl}/en/plus?ref=abc`);
  });
});

describe('withError', () => {
  it('adds the error code to the callback url', () => {
    expect(new URL(withError({ url: 'http://localhost:3000/', code: 'x' })).searchParams.get(LESTA_ID.errorParam)).toBe('x');
  });
});
