import type { AccessToken as DonationAlertsToken } from '@donation-alerts/auth';
import type { TokenInfo, AccessToken as TwitchToken } from '@twurple/auth';

import { ConfigService } from '@nestjs/config';
import { addSeconds } from 'date-fns';
import RedisMock from 'ioredis-mock';
import { describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { Env } from '../../../../config/env';
import type { IntegrationStoreService } from '../integration-store.service';

import { AppBadRequestException } from '../../../../common/exceptions';
import { AppConfigService } from '../../../../config';
import { DONATION_ALERTS, INTEGRATIONS, TWITCH } from '../../config';
import { IntegrationsService } from '../integrations.service';
import { OAuthStateService } from '../oauth-state.service';

const oauth = vi.hoisted(() => ({
  exchangeCode: vi.fn<(clientId: string, clientSecret: string, code: string, redirectUri: string) => Promise<TwitchToken>>(),
  getTokenInfo: vi.fn<(accessToken: string, clientId?: string) => Promise<TokenInfo>>(),
  getAccessToken: vi.fn<(clientId: string, clientSecret: string, redirectUri: string, code: string) => Promise<DonationAlertsToken>>(),
  addUserForToken: vi.fn<(token: DonationAlertsToken) => Promise<DonationAlertsToken & { userId: number }>>()
}));

vi.mock('@twurple/auth', () => ({ exchangeCode: oauth.exchangeCode, getTokenInfo: oauth.getTokenInfo }));

vi.mock('@donation-alerts/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@donation-alerts/auth')>()),
  getAccessToken: oauth.getAccessToken,
  RefreshingAuthProvider: class {
    addUserForToken = oauth.addUserForToken;
  }
}));

const API_URL = 'http://api.test';
const WEB_URL = 'http://web.test';
const OBTAINED = new Date('2026-09-01T12:00:00.000Z').getTime();

const ENV = {
  API_URL,
  WEB_URL,
  TWITCH_CLIENT_ID: 'twitch-id',
  TWITCH_CLIENT_SECRET: 'twitch-secret',
  DONATIONALERTS_CLIENT_ID: 'da-id',
  DONATIONALERTS_CLIENT_SECRET: 'da-secret'
} satisfies Partial<Env>;

const TWITCH_TOKEN: TwitchToken = {
  accessToken: 'tw-access',
  refreshToken: 'tw-refresh',
  scope: [...TWITCH.scopes],
  expiresIn: 3600,
  obtainmentTimestamp: OBTAINED
};

const DA_TOKEN: DonationAlertsToken = { accessToken: 'da-access', refreshToken: 'da-refresh', expiresIn: 7200, obtainmentTimestamp: OBTAINED };

const createService = (env: Partial<Env> = ENV) => {
  const states = new OAuthStateService(new RedisMock());
  const store = mock<IntegrationStoreService>();
  const service = new IntegrationsService(new AppConfigService(new ConfigService<Env, true>(env)), states, store);

  return { service, states, store };
};

const doneUrl = new URL(INTEGRATIONS.doneRedirectPath, WEB_URL).href;
const failedUrl = new URL(INTEGRATIONS.failedRedirectPath, WEB_URL).href;

describe('IntegrationsService.connectUrl', () => {
  it('refuses a provider whose client id is not configured', async () => {
    const { service } = createService({ ...ENV, TWITCH_CLIENT_ID: '' });

    await expect(service.connectUrl({ userId: 'u1', provider: 'twitch' })).rejects.toBeInstanceOf(AppBadRequestException);
  });

  it('refuses a provider without an OAuth app', async () => {
    const { service } = createService();

    await expect(service.connectUrl({ userId: 'u1', provider: 'youtube' })).rejects.toBeInstanceOf(AppBadRequestException);
  });

  it('points Twitch back at the API callback with the chat scopes', async () => {
    const { service } = createService();

    const url = new URL(await service.connectUrl({ userId: 'u1', provider: 'twitch' }));

    expect(`${url.origin}${url.pathname}`).toBe(TWITCH.authorizeUrl);
    expect(url.searchParams.get('client_id')).toBe(ENV.TWITCH_CLIENT_ID);
    expect(url.searchParams.get('redirect_uri')).toBe(new URL(TWITCH.callbackPath, API_URL).href);
    expect(url.searchParams.get('scope')).toBe(TWITCH.scopes.join(' '));
    expect(url.searchParams.get('response_type')).toBe('code');
  });

  it('embeds a state that resolves back to the requesting user and provider', async () => {
    const { service, states } = createService();

    const url = new URL(await service.connectUrl({ userId: 'u1', provider: 'donationAlerts' }));

    expect(url.searchParams.get('redirect_uri')).toBe(new URL(DONATION_ALERTS.callbackPath, API_URL).href);
    await expect(states.consume(url.searchParams.get('state') ?? '')).resolves.toEqual({ provider: 'donationAlerts', userId: 'u1' });
  });
});

describe('IntegrationsService.callback', () => {
  it('fails an unknown state without touching the provider', async () => {
    const { service, store } = createService();

    await expect(service.callback({ provider: 'twitch', code: 'c', state: 'forged' })).resolves.toBe(failedUrl);
    expect(oauth.exchangeCode).not.toHaveBeenCalled();
    expect(store.save).not.toHaveBeenCalled();
  });

  it('fails a state that was issued for another provider', async () => {
    const { service, states, store } = createService();
    const state = await states.create({ provider: 'donationAlerts', userId: 'u1' });

    await expect(service.callback({ provider: 'twitch', code: 'c', state })).resolves.toBe(failedUrl);
    expect(store.save).not.toHaveBeenCalled();
  });

  it('saves the Twitch channel login for the state owner', async () => {
    const { service, states, store } = createService();
    const state = await states.create({ provider: 'twitch', userId: 'u1' });

    oauth.exchangeCode.mockResolvedValue(TWITCH_TOKEN);
    oauth.getTokenInfo.mockResolvedValue(mock<TokenInfo>({ userId: '777', userName: 'jove' }));

    await expect(service.callback({ provider: 'twitch', code: 'c', state })).resolves.toBe(doneUrl);
    expect(oauth.exchangeCode).toHaveBeenCalledWith(ENV.TWITCH_CLIENT_ID, ENV.TWITCH_CLIENT_SECRET, 'c', new URL(TWITCH.callbackPath, API_URL).href);

    expect(store.save).toHaveBeenCalledWith({
      userId: 'u1',
      provider: 'twitch',
      externalId: '777',
      accessToken: TWITCH_TOKEN.accessToken,
      refreshToken: TWITCH_TOKEN.refreshToken,
      expiresAt: addSeconds(OBTAINED, 3600),
      scope: TWITCH.scopes.join(' '),
      config: { login: 'jove' }
    });
  });

  it('saves a non-expiring Twitch token without an expiry', async () => {
    const { service, states, store } = createService();
    const state = await states.create({ provider: 'twitch', userId: 'u1' });

    oauth.exchangeCode.mockResolvedValue({ ...TWITCH_TOKEN, expiresIn: null });
    oauth.getTokenInfo.mockResolvedValue(mock<TokenInfo>({ userId: '777', userName: 'jove' }));

    await service.callback({ provider: 'twitch', code: 'c', state });

    expect(store.save).toHaveBeenCalledWith(expect.objectContaining({ expiresAt: null }));
  });

  it('fails when Twitch returns a token without a user', async () => {
    const { service, states, store } = createService();
    const state = await states.create({ provider: 'twitch', userId: 'u1' });

    oauth.exchangeCode.mockResolvedValue(TWITCH_TOKEN);
    oauth.getTokenInfo.mockResolvedValue(mock<TokenInfo>({ userId: null, userName: null }));

    await expect(service.callback({ provider: 'twitch', code: 'c', state })).resolves.toBe(failedUrl);
    expect(store.save).not.toHaveBeenCalled();
  });

  it('fails when the code exchange is rejected', async () => {
    const { service, states } = createService();
    const state = await states.create({ provider: 'twitch', userId: 'u1' });

    oauth.exchangeCode.mockRejectedValue(new Error('invalid code'));

    await expect(service.callback({ provider: 'twitch', code: 'c', state })).resolves.toBe(failedUrl);
  });

  it('saves the DonationAlerts account id as a string with the donation scopes', async () => {
    const { service, states, store } = createService();
    const state = await states.create({ provider: 'donationAlerts', userId: 'u1' });

    oauth.getAccessToken.mockResolvedValue(DA_TOKEN);
    oauth.addUserForToken.mockResolvedValue({ ...DA_TOKEN, userId: 4242 });

    await expect(service.callback({ provider: 'donationAlerts', code: 'c', state })).resolves.toBe(doneUrl);

    expect(store.save).toHaveBeenCalledWith({
      userId: 'u1',
      provider: 'donationAlerts',
      externalId: '4242',
      accessToken: DA_TOKEN.accessToken,
      refreshToken: DA_TOKEN.refreshToken,
      expiresAt: addSeconds(OBTAINED, DA_TOKEN.expiresIn),
      scope: DONATION_ALERTS.scopes.join(' '),
      config: null
    });
  });

  it('fails a provider that cannot be connected even with a valid state', async () => {
    const { service, states, store } = createService();
    const state = await states.create({ provider: 'youtube', userId: 'u1' });

    await expect(service.callback({ provider: 'youtube', code: 'c', state })).resolves.toBe(failedUrl);
    expect(store.save).not.toHaveBeenCalled();
  });

  it('refuses to replay a state after a successful connect', async () => {
    const { service, states, store } = createService();
    const state = await states.create({ provider: 'twitch', userId: 'u1' });

    oauth.exchangeCode.mockResolvedValue(TWITCH_TOKEN);
    oauth.getTokenInfo.mockResolvedValue(mock<TokenInfo>({ userId: '777', userName: 'jove' }));

    await service.callback({ provider: 'twitch', code: 'c', state });

    await expect(service.callback({ provider: 'twitch', code: 'c', state })).resolves.toBe(failedUrl);
    expect(store.save).toHaveBeenCalledTimes(1);
  });
});
