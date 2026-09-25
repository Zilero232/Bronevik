import type {
  ApiErrorLog,
  ApiKey,
  ApiUsage,
  ApiUsagePoint,
  CreateApiKeyInput,
  CreatedApiKey,
  CreatedWebhookEndpoint,
  CreateWebhookEndpointInput,
  DeveloperOverview,
  WebhookDeliveries,
  WebhookDelivery,
  WebhookEndpoint
} from '@bronevik/schemas';

import { API_KEY, API_PLAN_LIMITS, WEBHOOK } from '@bronevik/schemas';
import { addMinutes, subDays, subHours, subMinutes } from 'date-fns';
import { match } from 'ts-pattern';

import { seededRandom } from '@/shared/lib';
import { MOCK_CLANS, MOCK_PLAYERS, mockHex, mockUuid } from '@/shared/mocks';

import type { ApiKeyUsageInput, UpdateWebhookInput } from '../developer.types';
import type { DeliveryFixtureInput, KeyFixtureInput, UsagePointInput } from './developer.mock.types';

import { DEVELOPER_MOCK } from './developer.mock.constants';

const random = seededRandom(4_242);
const PLAN = 'free' as const;
const now = () => new Date().toISOString();

const keyFixture = ({ name, daysAgo, usedMinutesAgo }: KeyFixtureInput): ApiKey => ({
  id: mockUuid(random),
  name,
  prefix: `brv_${mockHex({ random, length: API_KEY.prefixLength - 4 })}`,
  plan: PLAN,
  scopes: ['read'],
  createdAt: subDays(new Date(), daysAgo).toISOString(),
  lastUsedAt: usedMinutesAgo === null ? null : subMinutes(new Date(), usedMinutesAgo).toISOString(),
  expiresAt: null,
  revokedAt: null
});

const keys: ApiKey[] = [
  keyFixture({ name: 'Clan Discord bot', daysAgo: 64, usedMinutesAgo: 3 }),
  keyFixture({ name: 'OBS widget', daysAgo: 21, usedMinutesAgo: 190 }),
  keyFixture({ name: 'Local experiments', daysAgo: 2, usedMinutesAgo: null })
];

const webhooks: WebhookEndpoint[] = [
  {
    id: mockUuid(random),
    url: 'https://bot.example.org/bronevik/hooks',
    events: ['mark.gained', 'session.ended'],
    filter: { accountIds: MOCK_PLAYERS.slice(0, 3).map(({ id }) => id) },
    isActive: true,
    failureCount: 0,
    disabledAt: null,
    createdAt: subDays(new Date(), 30).toISOString()
  },
  {
    id: mockUuid(random),
    url: 'https://clan.example.org/roster-feed',
    events: ['clan.member_changed'],
    filter: { clanIds: MOCK_CLANS.slice(0, 1).map(({ id }) => id) },
    isActive: false,
    failureCount: 20,
    disabledAt: subDays(new Date(), 2).toISOString(),
    createdAt: subDays(new Date(), 50).toISOString()
  }
];

const usagePoint = ({ day, scale }: UsagePointInput): ApiUsagePoint => {
  const requests = Math.round(DEVELOPER_MOCK.baseRequests * scale * (0.55 + random() * 0.9));

  return {
    day: day.toISOString().slice(0, 10),
    requests,
    errors: Math.round(requests * random() * DEVELOPER_MOCK.errorShare),
    throttled: random() > 0.8 ? Math.round(random() * 40) : 0,
    avgLatencyMs: Math.round(40 + random() * 90)
  };
};

const secret = (prefix: string) => `${prefix}${mockHex({ random: Math.random, length: 48 })}`;

const delivery = ({ event, position, isFailing }: DeliveryFixtureInput): WebhookDelivery => {
  const createdAt = subHours(new Date(), position * 3 + 1);
  const status = match({ isFailing, position })
    .with({ isFailing: true }, () => 'failed' as const)
    .with({ position: 0 }, () => 'pending' as const)
    .with({ position: 2 }, () => 'failed' as const)
    .otherwise(() => 'succeeded' as const);

  return {
    id: mockUuid(random),
    event,
    status,
    attempt: match(status)
      .with('failed', () => 6)
      .with('pending', () => 2)
      .otherwise(() => 1),
    responseStatus: match(status)
      .with('succeeded', () => 200)
      .with('failed', () => 502)
      .otherwise(() => null),
    createdAt: createdAt.toISOString(),
    deliveredAt: status === 'succeeded' ? addMinutes(createdAt, 1).toISOString() : null,
    nextAttemptAt: status === 'pending' ? addMinutes(new Date(), 4).toISOString() : null
  };
};

export const mockDeveloper = {
  overview: (): DeveloperOverview => ({
    plan: PLAN,
    limits: API_PLAN_LIMITS[PLAN],
    keys: keys.filter(({ revokedAt }) => revokedAt === null),
    webhooks: webhooks.length
  }),
  keys: () => keys.filter(({ revokedAt }) => revokedAt === null),
  createKey: ({ name, expiresAt }: CreateApiKeyInput): CreatedApiKey => {
    const key: ApiKey = { ...keyFixture({ name, daysAgo: 0, usedMinutesAgo: null }), expiresAt: expiresAt ?? null, createdAt: now() };

    keys.unshift(key);

    return { key, secret: secret(key.prefix) };
  },
  revokeKey: (id: string) => {
    const key = keys.find((item) => item.id === id);

    if (key) {
      key.revokedAt = now();
    }
  },
  usage: ({ id, days = DEVELOPER_MOCK.usageDays }: ApiKeyUsageInput): ApiUsage => {
    const scale =
      1 /
      (Math.max(
        0,
        keys.findIndex((key) => key.id === id)
      ) +
        1);

    const history = Array.from({ length: days }, (_, offset) => usagePoint({ day: subDays(new Date(), days - offset - 1), scale }));

    return {
      apiKeyId: id,
      plan: PLAN,
      limits: API_PLAN_LIMITS[PLAN],
      today: history.at(-1) ?? usagePoint({ day: new Date(), scale }),
      history,
      topEndpoints: DEVELOPER_MOCK.endpoints.map((endpoint, position) => ({
        endpoint,
        requests: Math.round((DEVELOPER_MOCK.baseRequests * scale * 6) / (position + 1))
      }))
    };
  },
  errors: (): ApiErrorLog =>
    DEVELOPER_MOCK.errors.map(({ method, path, status, code, message }, position) => ({
      id: mockUuid(random),
      method,
      path,
      status,
      code,
      message,
      occurredAt: subMinutes(new Date(), 17 + position * 143).toISOString()
    })),
  webhooks: () => [...webhooks],
  createWebhook: ({ url, events, filter }: CreateWebhookEndpointInput): CreatedWebhookEndpoint => {
    const endpoint: WebhookEndpoint = {
      id: mockUuid(Math.random),
      url,
      events,
      filter,
      isActive: true,
      failureCount: 0,
      disabledAt: null,
      createdAt: now()
    };

    webhooks.unshift(endpoint);

    return { endpoint, secret: secret('whsec_') };
  },
  updateWebhook: ({ id, ...patch }: UpdateWebhookInput): WebhookEndpoint => {
    const index = Math.max(
      0,
      webhooks.findIndex((item) => item.id === id)
    );

    const current = webhooks[index];
    const next: WebhookEndpoint = {
      ...current,
      ...patch,
      failureCount: patch.isActive ? 0 : current.failureCount,
      disabledAt: patch.isActive ? null : current.disabledAt
    };

    webhooks.splice(index, 1, next);

    return next;
  },
  removeWebhook: (id: string) => {
    const index = webhooks.findIndex((item) => item.id === id);

    if (index >= 0) {
      webhooks.splice(index, 1);
    }
  },
  deliveries: (id: string): WebhookDeliveries => {
    const endpoint = webhooks.find((item) => item.id === id);
    const events = endpoint?.events ?? [...WEBHOOK.events];

    return Array.from({ length: DEVELOPER_MOCK.deliveries }, (_, position) =>
      delivery({ event: events[position % events.length], position, isFailing: endpoint?.isActive === false })
    );
  }
};
