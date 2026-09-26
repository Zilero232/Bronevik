import { sign as signInitData } from '@telegram-apps/init-data-node';
import { betterAuth } from 'better-auth';
import { memoryAdapter } from 'better-auth/adapters/memory';
import { getUnixTime, subSeconds } from 'date-fns';
import { createHash, createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { TelegramAccountStore, WidgetPayload } from '../telegram-login.types';

import { AUTH_PROVIDER } from '../../auth.constants';
import { telegramLogin } from '../telegram-login.plugin';
import { WEBAPP_AUTH } from '../webapp-auth.constants';
import { WIDGET_AUTH } from '../widget-auth.constants';

const API_URL = 'http://localhost:4000';
const WEB_URL = 'http://localhost:3000';
const BOT_TOKEN = '123456:test-token';
const NOW = new Date('2026-09-26T12:00:00.000Z');

type Tables = Record<'account' | 'session' | 'user' | 'verification', Record<string, unknown>[]>;

const signWidget = ({ payload, token = BOT_TOKEN }: { payload: WidgetPayload; token?: string }): WidgetPayload => {
  const secret = createHash('sha256').update(token).digest();
  const data = Object.entries(payload)
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join(WIDGET_AUTH.separator);

  return { ...payload, hash: createHmac('sha256', secret).update(data).digest('hex') };
};

const widget = (overrides: WidgetPayload = {}) =>
  signWidget({ payload: { id: '42', first_name: 'Ivan', username: 'ivan', auth_date: String(getUnixTime(NOW)), ...overrides } });

const initData = (authDate = NOW) => signInitData({ user: { id: 42, first_name: 'Ivan', username: 'ivan' }, query_id: 'q' }, BOT_TOKEN, authDate);

const createAuth = ({ botToken = BOT_TOKEN, botUsername = 'otmetki_bot' }: { botToken?: string; botUsername?: string } = {}) => {
  const store = mock<TelegramAccountStore>();
  const db: Tables = { user: [], session: [], account: [], verification: [] };

  store.findUserId.mockResolvedValue(null);

  const auth = betterAuth({
    basePath: '/auth',
    baseURL: API_URL,
    secret: 'test-secret-not-used-outside-tests-000',
    trustedOrigins: [WEB_URL],
    database: memoryAdapter(db),
    plugins: [telegramLogin({ botToken, botUsername, store })]
  });

  const post = (path: string, body: unknown, cookie?: string) =>
    auth.handler(
      new Request(`${API_URL}/auth${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', origin: WEB_URL, ...(cookie ? { cookie } : {}) },
        body: JSON.stringify(body)
      })
    );

  const cookieOf = (response: Response) =>
    response.headers
      .getSetCookie()
      .map((cookie) => cookie.split(';')[0])
      .join('; ');

  return { auth, store, db, post, cookieOf };
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('telegramLogin /telegram/widget', () => {
  it('reports the widget enabled only with both a token and a username', async () => {
    const enabled = await createAuth().auth.handler(new Request(`${API_URL}/auth/telegram/widget`));
    const disabled = await createAuth({ botToken: '' }).auth.handler(new Request(`${API_URL}/auth/telegram/widget`));

    expect(await enabled.json()).toEqual({ botUsername: 'otmetki_bot', enabled: true });
    expect(await disabled.json()).toMatchObject({ enabled: false });
  });
});

describe('telegramLogin /telegram/callback', () => {
  it('signs in a new Telegram user with a session and a Telegram sign-in method', async () => {
    const { post, store, db } = createAuth();

    const response = await post('/telegram/callback', widget());

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ token: expect.any(String), user: { name: 'ivan' } });
    expect(db.account).toEqual([expect.objectContaining({ providerId: AUTH_PROVIDER.telegram, accountId: '42' })]);
    expect(store.link).toHaveBeenCalledWith(expect.objectContaining({ telegramId: 42n, username: 'ivan' }));
  });

  it('accepts numeric fields the widget sends as numbers', async () => {
    const { post } = createAuth();
    const { id: _id, auth_date: _authDate, ...rest } = widget();
    const numeric = { ...rest, id: 42, auth_date: getUnixTime(NOW) };

    expect((await post('/telegram/callback', numeric)).status).toBe(200);
  });

  it('rejects a payload signed with another bot token', async () => {
    const { post, db } = createAuth();
    const forged = signWidget({ payload: { id: '42', first_name: 'Ivan', auth_date: String(getUnixTime(NOW)) }, token: '999:other' });

    expect((await post('/telegram/callback', forged)).status).toBe(401);
    expect(db.user).toHaveLength(0);
  });

  it('rejects a payload whose fields were changed after signing', async () => {
    const { post } = createAuth();

    expect((await post('/telegram/callback', { ...widget(), id: '43' })).status).toBe(401);
  });

  it('rejects a payload older than the allowed age', async () => {
    const { post } = createAuth();
    const stale = widget({ auth_date: String(getUnixTime(subSeconds(NOW, WIDGET_AUTH.maxAgeSeconds + 1))) });

    expect((await post('/telegram/callback', stale)).status).toBe(401);
  });

  it('rejects every payload when no bot token is configured', async () => {
    const { post } = createAuth({ botToken: '' });

    expect((await post('/telegram/callback', widget())).status).toBe(401);
  });

  it('signs a known Telegram user into the owning user without adding another sign-in method', async () => {
    const { post, store, db, cookieOf } = createAuth();

    await post('/telegram/callback', widget());
    store.findUserId.mockResolvedValue(String(db.user[0]?.id));
    const second = await post('/telegram/callback', widget());

    expect(cookieOf(second)).toContain('session_token');
    expect(db.user).toHaveLength(1);
    expect(db.account).toHaveLength(1);
  });

  it('refuses to link a Telegram account owned by another user to the signed-in user', async () => {
    const { post, store, cookieOf } = createAuth();

    const cookie = cookieOf(await post('/telegram/callback', widget({ id: '1', username: 'first' })));

    store.findUserId.mockResolvedValue('someone-else');

    expect((await post('/telegram/callback', widget(), cookie)).status).toBe(409);
  });

  it('links a new Telegram account to the signed-in user', async () => {
    const { post, store, db, cookieOf } = createAuth();

    const cookie = cookieOf(await post('/telegram/callback', widget({ id: '1', username: 'first' })));

    await post('/telegram/callback', widget(), cookie);

    expect(db.user).toHaveLength(1);
    expect(store.link).toHaveBeenLastCalledWith(expect.objectContaining({ telegramId: 42n, userId: db.user[0]?.id }));
  });
});

describe('telegramLogin /telegram/webapp', () => {
  it('signs in with Mini App init data signed by our bot', async () => {
    const { post } = createAuth();

    const response = await post('/telegram/webapp', { initData: initData() });

    expect(response.status).toBe(200);
  });

  it('rejects expired init data', async () => {
    const { post } = createAuth();

    expect((await post('/telegram/webapp', { initData: initData(subSeconds(NOW, WEBAPP_AUTH.maxAgeSeconds + 1)) })).status).toBe(401);
  });

  it('rejects init data longer than the limit before verifying it', async () => {
    const { post, store } = createAuth();

    expect((await post('/telegram/webapp', { initData: 'x'.repeat(WEBAPP_AUTH.initDataMaxLength + 1) })).status).toBe(400);
    expect(store.findUserId).not.toHaveBeenCalled();
  });
});
