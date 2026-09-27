import { betterAuth } from 'better-auth';
import { memoryAdapter } from 'better-auth/adapters/memory';
import { addMilliseconds } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { AccountInfo, LestaClient } from '../../../lesta';
import type { LestaAccountStore } from '../lesta-id.types';

import { LESTA_ERROR_CODE, LestaApiError, LestaNetworkError, parseLoginCallback } from '../../../lesta';
import { AUTH_PROVIDER } from '../../auth.constants';
import { LESTA_ID, LESTA_ID_ERROR } from '../lesta-id.constants';
import { lestaId } from '../lesta-id.plugin';

const API_URL = 'http://localhost:4000';
const WEB_URL = 'http://localhost:3000';
const NOW = new Date('2026-09-26T12:00:00.000Z');
const LESTA_LOGIN = 'https://lesta.example/login';

const LOGIN = { status: 'ok', access_token: 'token', account_id: '42', nickname: 'Tanker', expires_at: '1790000000' };

type Tables = Record<'account' | 'session' | 'user' | 'verification', Record<string, unknown>[]>;

const cookiesOf = (response: Response) =>
  response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';')[0])
    .join('; ');

const sessionCookieOf = (response: Response) =>
  response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';')[0] ?? '')
    .filter((cookie) => cookie.includes('session_token'))
    .join('; ');

const createAuth = () => {
  const lesta = mockDeep<LestaClient>();
  const store = mock<LestaAccountStore>();
  const db: Tables = { user: [], session: [], account: [], verification: [] };

  lesta.auth.loginUrl.mockImplementation(({ redirectUri }) => `${LESTA_LOGIN}?redirect_uri=${encodeURIComponent(redirectUri)}`);
  lesta.auth.parseLoginCallback.mockImplementation(parseLoginCallback);
  lesta.account.info.mockResolvedValue({ '42': mock<AccountInfo>({ account_id: 42, nickname: 'Tanker', private: {} }) });
  store.findUserId.mockResolvedValue(null);
  store.link.mockResolvedValue(true);

  const auth = betterAuth({
    basePath: '/auth',
    baseURL: API_URL,
    secret: 'test-secret-not-used-outside-tests-000',
    trustedOrigins: [WEB_URL],
    database: memoryAdapter(db),
    plugins: [lestaId({ lesta, store, apiUrl: API_URL, webUrl: WEB_URL })]
  });

  const get = (path: string, headers?: Record<string, string>) => auth.handler(new Request(`${API_URL}/auth${path}`, { headers }));

  const start = async ({ query = '', cookie }: { query?: string; cookie?: string } = {}) => {
    const response = await get(`/lesta/start${query}`, cookie ? { cookie } : undefined);
    const redirectUri = lesta.auth.loginUrl.mock.lastCall?.[0].redirectUri ?? '';
    const flowCookie = [cookie, cookiesOf(response)].filter(Boolean).join('; ');

    return { response, state: new URL(redirectUri).searchParams.get('state') ?? '', cookie: flowCookie };
  };

  const callback = (params: Record<string, string>, cookie?: string) =>
    get(`/lesta/callback?${new URLSearchParams(params).toString()}`, cookie ? { cookie } : undefined);

  const signIn = async () => {
    const { state, cookie } = await start();
    const response = await callback({ ...LOGIN, state }, cookie);

    return sessionCookieOf(response);
  };

  return { auth, lesta, store, db, get, start, callback, signIn };
};

const locationOf = (response: Response) => new URL(response.headers.get('location') ?? '');
const errorOf = (response: Response) => locationOf(response).searchParams.get(LESTA_ID.errorParam);

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('lestaId /lesta/start', () => {
  it('redirects to the Lesta login with a callback that carries a fresh state', async () => {
    const { start, db } = createAuth();

    const { response, state } = await start();

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatch(new RegExp(`^${LESTA_LOGIN}`));
    expect(state).not.toBe('');
    expect(db.verification).toHaveLength(1);
  });

  it('issues a different state on every start', async () => {
    const { start } = createAuth();

    const first = await start();
    const second = await start();

    expect(first.state).not.toBe(second.state);
  });

  it('never sends the user back to a foreign origin after login', async () => {
    const { start, callback } = createAuth();

    const { state, cookie: flow } = await start({ query: `?callbackURL=${encodeURIComponent('https://evil.example/steal')}` });
    const response = await callback({ ...LOGIN, state }, flow);

    expect(locationOf(response).origin).toBe(WEB_URL);
  });
});

describe('lestaId /lesta/callback', () => {
  it('signs in a new player, stores the Lesta sign-in and returns to the requested page', async () => {
    const { start, callback, store, db } = createAuth();

    const { state, cookie: flow } = await start({ query: '?callbackURL=/me' });
    const response = await callback({ ...LOGIN, state }, flow);

    expect(locationOf(response).toString()).toBe(`${WEB_URL}/me`);
    expect(response.headers.getSetCookie().some((cookie) => cookie.includes('session_token'))).toBe(true);
    expect(store.link).toHaveBeenCalledWith(expect.objectContaining({ accountId: 42, nickname: 'Tanker', accessToken: 'token' }));
    expect(db.user).toHaveLength(1);
    expect(db.account).toEqual([expect.objectContaining({ providerId: AUTH_PROVIDER.lesta, accountId: '42' })]);
  });

  it('rejects a callback without a known state', async () => {
    const { callback, lesta } = createAuth();

    const response = await callback({ ...LOGIN, state: 'forged' });

    expect(errorOf(response)).toBe(LESTA_ID_ERROR.state);
    expect(lesta.account.info).not.toHaveBeenCalled();
  });

  it('rejects a callback in a browser that did not start the sign-in', async () => {
    const { start, callback, lesta, store } = createAuth();

    const { state } = await start();

    expect(errorOf(await callback({ ...LOGIN, state }))).toBe(LESTA_ID_ERROR.state);
    expect(lesta.account.info).not.toHaveBeenCalled();
    expect(store.link).not.toHaveBeenCalled();
  });

  it('rejects a state that belongs to another sign-in flow', async () => {
    const { start, callback } = createAuth();

    const victim = await start();
    const attacker = await start();

    expect(errorOf(await callback({ ...LOGIN, state: attacker.state }, victim.cookie))).toBe(LESTA_ID_ERROR.state);
  });

  it('clears the state cookie on the callback', async () => {
    const { start, callback } = createAuth();

    const { state, cookie: flow } = await start();
    const response = await callback({ ...LOGIN, state }, flow);
    const cleared = response.headers.getSetCookie().find((cookie) => cookie.includes(LESTA_ID.stateCookie));

    expect(cleared).toMatch(/Max-Age=0/i);
  });

  it('rejects a replayed state', async () => {
    const { start, callback } = createAuth();

    const { state, cookie: flow } = await start();

    await callback({ ...LOGIN, state }, flow);
    const replay = await callback({ ...LOGIN, state }, flow);

    expect(errorOf(replay)).toBe(LESTA_ID_ERROR.state);
  });

  it('rejects a state older than its lifetime', async () => {
    const { start, callback } = createAuth();

    const { state, cookie: flow } = await start();

    vi.setSystemTime(addMilliseconds(NOW, LESTA_ID.stateTtlMs + 1));

    expect(errorOf(await callback({ ...LOGIN, state }, flow))).toBe(LESTA_ID_ERROR.state);
  });

  it('reports a login the player cancelled at Lesta', async () => {
    const { start, callback } = createAuth();

    const { state, cookie: flow } = await start();

    expect(errorOf(await callback({ status: 'error', code: 'AUTH_CANCEL', state }, flow))).toBe(LESTA_ID_ERROR.denied);
  });

  it('refuses a token Lesta does not confirm for that account', async () => {
    const { start, callback, lesta, store } = createAuth();

    lesta.account.info.mockResolvedValue({ '42': mock<AccountInfo>({ account_id: 42, nickname: 'Tanker', private: null }) });

    const { state, cookie: flow } = await start();

    expect(errorOf(await callback({ ...LOGIN, state }, flow))).toBe(LESTA_ID_ERROR.token);
    expect(store.link).not.toHaveBeenCalled();
  });

  it('refuses a token issued for another account id', async () => {
    const { start, callback, lesta } = createAuth();

    lesta.account.info.mockResolvedValue({ '42': mock<AccountInfo>({ account_id: 43, nickname: 'Other', private: {} }) });

    const { state, cookie: flow } = await start();

    expect(errorOf(await callback({ ...LOGIN, state }, flow))).toBe(LESTA_ID_ERROR.token);
  });

  it('treats an invalid access token error from Lesta as a bad token', async () => {
    const { start, callback, lesta } = createAuth();

    lesta.account.info.mockRejectedValue(
      new LestaApiError({ code: LESTA_ERROR_CODE.invalidAccessToken, method: 'account/info', status: 407, field: null, value: null })
    );

    const { state, cookie: flow } = await start();

    expect(errorOf(await callback({ ...LOGIN, state }, flow))).toBe(LESTA_ID_ERROR.token);
  });

  it('reports Lesta as unavailable when the check itself fails', async () => {
    const { start, callback, lesta } = createAuth();

    lesta.account.info.mockRejectedValue(new LestaNetworkError({ method: 'account/info', cause: new Error('timeout') }));

    const { state, cookie: flow } = await start();

    expect(errorOf(await callback({ ...LOGIN, state }, flow))).toBe(LESTA_ID_ERROR.unavailable);
  });

  it('reports the plan limit when the account cannot be linked', async () => {
    const { start, callback, store } = createAuth();

    store.link.mockResolvedValue(false);

    const { state, cookie: flow } = await start();
    const response = await callback({ ...LOGIN, state }, flow);

    expect(errorOf(response)).toBe(LESTA_ID_ERROR.limit);
    expect(response.headers.getSetCookie().some((cookie) => cookie.includes('session_token'))).toBe(false);
  });

  it('signs a returning player into the same user without a second sign-in method', async () => {
    const { signIn, store, db } = createAuth();

    await signIn();
    store.findUserId.mockResolvedValue(String(db.user[0]?.id));
    await signIn();

    expect(db.user).toHaveLength(1);
    expect(db.account).toHaveLength(1);
  });

  it('refuses to link an account that belongs to another user', async () => {
    const { signIn, start, callback, store } = createAuth();

    const cookie = await signIn();

    store.findUserId.mockResolvedValue('someone-else');

    const { state, cookie: flow } = await start({ cookie });

    expect(errorOf(await callback({ ...LOGIN, state }, flow))).toBe(LESTA_ID_ERROR.taken);
  });
});

describe('lestaId account linking', () => {
  it('refuses to link when the callback runs without the session that started it', async () => {
    const { signIn, start, callback, store } = createAuth();

    const session = await signIn();

    store.link.mockClear();

    const { state, cookie: flow } = await start({ cookie: session });
    const stateOnly = flow
      .split('; ')
      .filter((cookie) => !cookie.includes('session_token'))
      .join('; ');

    expect(errorOf(await callback({ ...LOGIN, state }, stateOnly))).toBe(LESTA_ID_ERROR.state);
    expect(store.link).not.toHaveBeenCalled();
  });

  it('links to the signed-in user when the same session finishes the flow', async () => {
    const { signIn, start, callback, store, db } = createAuth();

    const session = await signIn();
    const userId = String(db.user[0]?.id);

    store.findUserId.mockResolvedValue(userId);

    const { state, cookie: flow } = await start({ cookie: session });
    const response = await callback({ ...LOGIN, state }, flow);

    expect(errorOf(response)).toBeNull();
    expect(store.link).toHaveBeenLastCalledWith(expect.objectContaining({ userId }));
  });
});

describe('lestaId /lesta/logout', () => {
  it('requires a session', async () => {
    const { auth, store } = createAuth();

    const response = await auth.handler(new Request(`${API_URL}/auth/lesta/logout`, { method: 'POST', headers: { origin: WEB_URL } }));

    expect(response.status).toBe(401);
    expect(store.revokeTokens).not.toHaveBeenCalled();
  });

  it('revokes the Lesta tokens and ends the session', async () => {
    const { auth, signIn, store, db } = createAuth();

    const cookie = await signIn();
    const userId = String(db.user[0]?.id);
    const response = await auth.handler(new Request(`${API_URL}/auth/lesta/logout`, { method: 'POST', headers: { cookie, origin: WEB_URL } }));

    expect(response.status).toBe(200);
    expect(store.revokeTokens).toHaveBeenCalledWith(userId);
    expect(db.session).toHaveLength(0);
  });
});
