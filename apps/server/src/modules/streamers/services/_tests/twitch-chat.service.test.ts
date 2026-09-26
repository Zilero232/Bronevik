import type { AccessToken } from '@twurple/auth';

import { ConfigService } from '@nestjs/config';
import { addSeconds } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { StreamerIntegration } from '../../../../../generated';
import type { Env } from '../../../../config/env';
import type { IntegrationStoreService } from '../integration-store.service';
import type { StreamerStatsService } from '../streamer-stats.service';

import { AppConfigService } from '../../../../config';
import { TWITCH } from '../../config';
import { TwitchChatService } from '../twitch-chat.service';

const { FakeAuthProvider, FakeChatClient } = vi.hoisted(() => {
  class FakeAuthProvider {
    static instances: FakeAuthProvider[] = [];
    readonly addUser = vi.fn<(userId: string, token: AccessToken, intents: string[]) => void>();
    readonly removeUser = vi.fn<(userId: string) => void>();
    readonly onRefresh = vi.fn<(handler: (userId: string, token: AccessToken) => void) => void>();

    constructor(readonly options: { clientId: string; clientSecret: string }) {
      FakeAuthProvider.instances.push(this);
    }
  }

  class FakeChatClient {
    static instances: FakeChatClient[] = [];
    readonly onMessage = vi.fn<(handler: (channel: string, user: string, text: string) => void) => void>();
    readonly connect = vi.fn<() => void>();
    readonly quit = vi.fn<() => void>();
    readonly say = vi.fn<(channel: string, text: string) => Promise<void>>().mockResolvedValue(undefined);

    constructor(readonly options: { channels: string[]; authIntents: string[] }) {
      FakeChatClient.instances.push(this);
    }

    receive(channel: string, text: string) {
      for (const [handler] of this.onMessage.mock.calls) {
        handler(channel, 'viewer', text);
      }
    }
  }

  return { FakeAuthProvider, FakeChatClient };
});

vi.mock('@twurple/auth', () => ({ RefreshingAuthProvider: FakeAuthProvider }));
vi.mock('@twurple/chat', () => ({ ChatClient: FakeChatClient }));

const now = new Date('2026-09-25T12:00:00Z');

const enabledEnv = { TWITCH_CLIENT_ID: 'client-id', TWITCH_CLIENT_SECRET: 'client-secret', NODE_ENV: 'production' } satisfies Partial<Env>;

const integration = (fields: Partial<StreamerIntegration> = {}) =>
  mock<StreamerIntegration>({
    userId: 'streamer-1',
    externalId: 'tw-1',
    accessToken: 'access',
    refreshToken: 'refresh',
    tokenExpiresAt: addSeconds(now, 600),
    config: { login: 'jove' },
    ...fields
  });

const flush = () => new Promise((resolve) => setImmediate(resolve));

const createService = (env: Partial<Env> = enabledEnv) => {
  const store = mock<IntegrationStoreService>();
  const stats = mock<StreamerStatsService>();

  store.byProvider.mockResolvedValue([]);
  store.storeToken.mockResolvedValue(undefined);

  return { service: new TwitchChatService(new AppConfigService(new ConfigService<Env, true>(env)), store, stats), store, stats };
};

const boot = async (integrations: StreamerIntegration[] = [integration()]) => {
  const context = createService();

  context.store.byProvider.mockResolvedValue(integrations);
  context.service.onApplicationBootstrap();
  await flush();

  return { ...context, auth: FakeAuthProvider.instances[0] };
};

beforeEach(() => {
  FakeAuthProvider.instances = [];
  FakeChatClient.instances = [];
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(now);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('TwitchChatService bootstrap', () => {
  it('stays disabled without Twitch credentials', async () => {
    const { service, store } = createService({ TWITCH_CLIENT_ID: '', TWITCH_CLIENT_SECRET: '', NODE_ENV: 'production' });

    service.onApplicationBootstrap();
    await service.sync();

    expect(FakeAuthProvider.instances).toHaveLength(0);
    expect(store.byProvider).not.toHaveBeenCalled();
  });

  it('never connects to Twitch in the test environment', async () => {
    const { service, store } = createService({ ...enabledEnv, NODE_ENV: 'test' });

    service.onApplicationBootstrap();
    await service.sync();

    expect(FakeAuthProvider.instances).toHaveLength(0);
    expect(store.byProvider).not.toHaveBeenCalled();
  });

  it('joins the chat of every connected streamer on start', async () => {
    const { auth } = await boot([integration(), integration({ userId: 'streamer-2', externalId: 'tw-2', config: { login: 'near_you' } })]);

    expect(auth?.options).toEqual({ clientId: enabledEnv.TWITCH_CLIENT_ID, clientSecret: enabledEnv.TWITCH_CLIENT_SECRET });
    expect(FakeChatClient.instances.map((client) => client.options.channels)).toEqual([['jove'], ['near_you']]);
    expect(FakeChatClient.instances.every((client) => client.connect.mock.calls.length === 1)).toBe(true);
  });

  it('registers the streamer token under a per-user chat intent with its remaining lifetime', async () => {
    const { auth } = await boot();
    const intent = `${TWITCH.intentPrefix}tw-1`;

    expect(auth?.addUser).toHaveBeenCalledWith(
      'tw-1',
      { accessToken: 'access', refreshToken: 'refresh', expiresIn: 600, obtainmentTimestamp: now.getTime() },
      [intent]
    );

    expect(FakeChatClient.instances[0]?.options.authIntents).toEqual([intent]);
  });

  it('treats an already expired token as zero seconds left and a token without expiry as open-ended', async () => {
    const { auth } = await boot([
      integration({ tokenExpiresAt: addSeconds(now, -60) }),
      integration({ userId: 'streamer-2', externalId: 'tw-2', tokenExpiresAt: null })
    ]);

    expect(auth?.addUser.mock.calls.map(([, token]) => token.expiresIn)).toEqual([0, null]);
  });

  it('skips integrations without a login or an access token', async () => {
    await boot([
      integration({ config: {} }),
      integration({ userId: 'streamer-2', accessToken: null }),
      integration({ userId: 'streamer-3', config: { login: 42 } })
    ]);

    expect(FakeChatClient.instances).toHaveLength(0);
  });

  it('persists refreshed tokens with an absolute expiry', async () => {
    const { auth, store } = await boot();
    const [handler] = auth?.onRefresh.mock.calls[0] ?? [];
    const obtainedAt = now.getTime();

    handler?.('tw-1', { accessToken: 'new-access', refreshToken: 'new-refresh', scope: [], expiresIn: 3600, obtainmentTimestamp: obtainedAt });
    handler?.('tw-1', { accessToken: 'forever', refreshToken: null, scope: [], expiresIn: null, obtainmentTimestamp: obtainedAt });

    expect(store.storeToken).toHaveBeenNthCalledWith(1, {
      provider: 'twitch',
      externalId: 'tw-1',
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
      expiresAt: addSeconds(obtainedAt, 3600)
    });

    expect(store.storeToken).toHaveBeenNthCalledWith(2, expect.objectContaining({ accessToken: 'forever', expiresAt: null }));
  });
});

describe('TwitchChatService.sync', () => {
  it('keeps existing connections instead of reconnecting', async () => {
    const { service } = await boot();

    await service.sync();

    expect(FakeChatClient.instances).toHaveLength(1);
  });

  it('leaves the chat and forgets the token of a disconnected streamer', async () => {
    const { service, store, auth } = await boot();
    const [client] = FakeChatClient.instances;

    store.byProvider.mockResolvedValue([]);
    await service.sync();

    expect(client?.quit).toHaveBeenCalledTimes(1);
    expect(auth?.removeUser).toHaveBeenCalledWith('tw-1');

    await service.announce({ streamerUserId: 'streamer-1', text: 'hi' });
    expect(client?.say).not.toHaveBeenCalled();
  });

  it('survives a failing integration lookup', async () => {
    const { service, store } = await boot();

    store.byProvider.mockRejectedValue(new Error('db down'));

    await expect(service.sync()).resolves.toBeUndefined();
    expect(FakeChatClient.instances[0]?.quit).not.toHaveBeenCalled();
  });
});

describe('TwitchChatService.announce', () => {
  it('posts to the streamer channel', async () => {
    const { service } = await boot();

    await service.announce({ streamerUserId: 'streamer-1', text: 'Челлендж начался' });

    expect(FakeChatClient.instances[0]?.say).toHaveBeenCalledWith('jove', 'Челлендж начался');
  });

  it('is a no-op for a streamer without a chat connection', async () => {
    const { service } = await boot();

    await expect(service.announce({ streamerUserId: 'stranger', text: 'hi' })).resolves.toBeUndefined();
    expect(FakeChatClient.instances[0]?.say).not.toHaveBeenCalled();
  });
});

describe('TwitchChatService chat commands', () => {
  it('answers a known command in the channel it came from', async () => {
    const { stats } = await boot();
    const [client] = FakeChatClient.instances;

    stats.reply.mockResolvedValue('Jove: 55% побед');
    client?.receive('#jove', '!stat please');
    await flush();

    expect(stats.reply).toHaveBeenCalledWith({ streamerUserId: 'streamer-1', command: 'stat' });
    expect(client?.say).toHaveBeenCalledWith('#jove', 'Jove: 55% побед');
  });

  it('ignores ordinary messages and unknown commands', async () => {
    const { stats } = await boot();
    const [client] = FakeChatClient.instances;

    client?.receive('#jove', 'hello');
    client?.receive('#jove', '!dance');
    await flush();

    expect(stats.reply).not.toHaveBeenCalled();
  });

  it('stays silent when there is nothing to answer or the answer fails', async () => {
    const { stats } = await boot();
    const [client] = FakeChatClient.instances;

    stats.reply.mockResolvedValueOnce(null).mockRejectedValueOnce(new Error('no profile'));
    client?.receive('#jove', '!session');
    client?.receive('#jove', '!marks');
    await flush();

    expect(stats.reply).toHaveBeenCalledTimes(2);
    expect(client?.say).not.toHaveBeenCalled();
  });
});

describe('TwitchChatService.onModuleDestroy', () => {
  it('leaves every chat and drops the connections', async () => {
    const { service } = await boot([integration(), integration({ userId: 'streamer-2', externalId: 'tw-2', config: { login: 'near_you' } })]);

    service.onModuleDestroy();

    expect(FakeChatClient.instances.map((client) => client.quit.mock.calls.length)).toEqual([1, 1]);
    await service.announce({ streamerUserId: 'streamer-1', text: 'hi' });
    expect(FakeChatClient.instances[0]?.say).not.toHaveBeenCalled();
  });
});
