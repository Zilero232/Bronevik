import type { CreateChallengeInput, Overlay, OverlayConfig } from '@bronevik/schemas';

import { overlayConfigSchema } from '@bronevik/schemas';
import { addMinutes, subMinutes } from 'date-fns';

import { SITE } from '@/shared/config/site';
import { isBrowser, seededRandom } from '@/shared/lib';
import { MOCK_PLAYERS, mockHex, mockUuid } from '@/shared/mocks';

import type {
  ActivateChallengeInput,
  ConnectableProvider,
  CreateOverlayInput,
  OverlayData,
  StreamerChallenge,
  StreamerIntegration,
  StreamerProfile,
  UpdateOverlayInput,
  UpsertStreamerProfileInput
} from '../streamers.types';

import { PROVIDER_FROM_PATH } from '../streamers.constants';
import { STREAMERS_MOCK } from './streamers.mock.constants';

const random = seededRandom(2_026);
const [own] = MOCK_PLAYERS;
const origin = () => (isBrowser() ? window.location.origin : SITE.url);
const now = () => new Date().toISOString();

let profile: StreamerProfile = {
  slug: STREAMERS_MOCK.slug,
  displayName: own.nickname,
  accountId: own.id,
  bio: STREAMERS_MOCK.bio,
  links: { twitch: 'https://twitch.tv/stalevar', vk: 'https://live.vkvideo.ru/stalevar', telegram: 'https://t.me/stalevar_tanks' },
  isLive: true
};

const toOverlay = ({ name, kind, accountId, config }: CreateOverlayInput): Overlay => {
  const publicId = mockHex({ random, length: 32 });

  return {
    id: mockUuid(random),
    name,
    kind,
    accountId: accountId ?? own.id,
    config: overlayConfigSchema.parse(config),
    publicUrl: `${origin()}/overlay/${publicId}`,
    isPro: false,
    updatedAt: now()
  };
};

const overlays: Overlay[] = STREAMERS_MOCK.overlays.map(({ name, kind, metrics, theme, layout }) =>
  toOverlay({ name, kind, config: { theme, layout, metrics: [...metrics] } })
);

const challenges: StreamerChallenge[] = STREAMERS_MOCK.challenges.map(({ title, status, amount, donorName, minutesAgo, condition, progress }) => ({
  id: mockUuid(random),
  code: `#${mockHex({ random, length: 5 }).toUpperCase()}`,
  title,
  condition: { operator: 'gte', aggregate: 'single', ...condition },
  amount,
  currency: 'RUB',
  status,
  donorName,
  progress,
  createdAt: subMinutes(new Date(), minutesAgo).toISOString(),
  expiresAt: status === 'active' || status === 'pending' ? addMinutes(new Date(), 90).toISOString() : null,
  resolvedAt: status === 'succeeded' || status === 'failed' ? subMinutes(new Date(), minutesAgo - 20).toISOString() : null
}));

const integrations: StreamerIntegration[] = [
  { provider: 'donationAlerts', externalId: '884120', login: 'stalevar', connectedAt: subMinutes(new Date(), 60 * 24 * 12).toISOString() }
];

const configFor = (publicId: string): OverlayConfig =>
  overlays.find(({ publicUrl }) => publicUrl.endsWith(publicId))?.config ??
  overlayConfigSchema.parse({ metrics: [...STREAMERS_MOCK.defaultMetrics] });

const tick = () => Math.floor(Date.now() / STREAMERS_MOCK.tickMs);

export const mockStreamers = {
  profile: () => profile,
  saveProfile: ({ slug, displayName, accountId, bio, links }: UpsertStreamerProfileInput): StreamerProfile => {
    profile = { ...profile, slug: slug.trim().toLowerCase(), displayName, accountId: accountId ?? null, bio: bio ?? null, links: links ?? null };

    return profile;
  },
  bySlug: (slug: string): StreamerProfile => ({ ...profile, slug }),
  overlays: () => [...overlays],
  createOverlay: (input: CreateOverlayInput) => {
    const overlay = toOverlay(input);

    overlays.push(overlay);

    return overlay;
  },
  updateOverlay: ({ id, config, ...patch }: UpdateOverlayInput): Overlay => {
    const index = Math.max(
      0,
      overlays.findIndex((item) => item.id === id)
    );

    const current = overlays[index];
    const next: Overlay = { ...current, ...patch, config: config ? overlayConfigSchema.parse(config) : current.config, updatedAt: now() };

    overlays.splice(index, 1, next);

    return next;
  },
  removeOverlay: (id: string) => {
    const index = overlays.findIndex((item) => item.id === id);

    if (index >= 0) {
      overlays.splice(index, 1);
    }
  },
  challenges: () => [...challenges],
  createChallenge: ({
    title,
    condition,
    amount,
    expiresInMinutes = STREAMERS_MOCK.defaultExpiryMinutes
  }: CreateChallengeInput): StreamerChallenge => {
    const challenge: StreamerChallenge = {
      id: mockUuid(Math.random),
      code: `#${mockHex({ random: Math.random, length: 5 }).toUpperCase()}`,
      title,
      condition,
      amount,
      currency: 'RUB',
      status: 'pending',
      donorName: null,
      progress: null,
      createdAt: now(),
      expiresAt: addMinutes(new Date(), expiresInMinutes).toISOString(),
      resolvedAt: null
    };

    challenges.unshift(challenge);

    return challenge;
  },
  activateChallenge: ({ id, donorName }: ActivateChallengeInput): StreamerChallenge => {
    const challenge = challenges.find((item) => item.id === id) ?? challenges[0];

    Object.assign(challenge, { status: 'active', donorName: donorName ?? null, progress: { battles: 0, value: 0 } });

    return challenge;
  },
  cancelChallenge: (id: string): StreamerChallenge => {
    const challenge = challenges.find((item) => item.id === id) ?? challenges[0];

    Object.assign(challenge, { status: 'cancelled', resolvedAt: now() });

    return challenge;
  },
  integrations: () => [...integrations],
  connectUrl: (provider: ConnectableProvider) => ({ url: `${origin()}/me/streamer?connected=${provider}` }),
  disconnect: (provider: ConnectableProvider) => {
    const index = integrations.findIndex((item) => item.provider === PROVIDER_FROM_PATH[provider]);

    if (index >= 0) {
      integrations.splice(index, 1);
    }
  },
  overlayData: (publicId: string): OverlayData => {
    const step = tick() % STREAMERS_MOCK.sessionLength;
    const battles = STREAMERS_MOCK.sessionStart + step;
    const wins = Math.round(battles * 0.62);
    const damage = STREAMERS_MOCK.damage[step % STREAMERS_MOCK.damage.length];

    return {
      kind: 'session',
      name: 'Session',
      config: configFor(publicId),
      player: { accountId: own.id, nickname: own.nickname },
      session: {
        battles,
        wins,
        winRate: (wins / battles) * 100,
        avgDamage: 3_050 + step * 23,
        frags: battles + 4,
        wn8: 3_420 + step * 11,
        winStreak: step % 5,
        lastBattle: { tankId: 7_937, tankName: 'Объект 140', result: step % 3 === 0 ? 'loss' : 'win', damage }
      },
      overall: { battles: own.battles, winRate: own.winRate, wn8: own.wn8 },
      moe: { tankName: 'Объект 140', marks: 2, percent: 88.4 + step * 0.12 },
      challenge: {
        title: '3000 урона на ЛТ',
        code: '#K7Q2M',
        status: 'active',
        battles: step % 3,
        battlesNeeded: 3,
        value: 2_140 + step * 40,
        target: 3_000
      },
      updatedAt: now()
    };
  }
};
