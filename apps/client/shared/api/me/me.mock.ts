import type {
  BindCode,
  CreateFavoriteInput,
  CreateGoalInput,
  Favorite,
  Goal,
  LinkedAccounts,
  ModDevice,
  NotificationSettings
} from '@bronevik/schemas';

import { addDays, addMinutes, subDays } from 'date-fns';

import { seededRandom } from '@/shared/lib';
import { MOCK_PLAYERS } from '@/shared/mocks';

import type { MockGoalSeed } from './me.types';

import { mockUuid } from '../players/mock/mock.helpers';

const BIND_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const random = seededRandom(9_001);
const [own, ...others] = MOCK_PLAYERS;
const now = () => new Date().toISOString();
const daysAgo = (days: number) => subDays(new Date(), days).toISOString();

const favorites: Favorite[] = [
  { id: mockUuid(random), kind: 'player', targetId: own.id, label: null, isOwn: true, title: own.nickname, createdAt: daysAgo(90) },
  ...others.slice(0, 3).map((player, index) => ({
    id: mockUuid(random),
    kind: 'player' as const,
    targetId: player.id,
    label: null,
    isOwn: false,
    title: player.nickname,
    createdAt: daysAgo(30 - index * 7)
  }))
];

const GOAL_SEEDS: MockGoalSeed[] = [
  { metric: 'winRate', target: 66, baseline: 64.2, current: 64.9 },
  { metric: 'wn8', target: 3_600, baseline: 3_300, current: 3_470 },
  { metric: 'battles', target: 500, baseline: 0, current: 500 },
  { metric: 'moe', target: 85, baseline: 78.5, current: 81.2 }
];

const goals: Goal[] = GOAL_SEEDS.map(({ metric, target, baseline, current }, index) => ({
  id: mockUuid(random),
  accountId: own.id,
  metric,
  tankId: null,
  target,
  baseline,
  current,
  status: current >= target ? 'achieved' : 'active',
  startsAt: daysAgo(10 + index),
  endsAt: addDays(new Date(), 5 + index * 6).toISOString(),
  achievedAt: current >= target ? daysAgo(1) : null,
  createdAt: daysAgo(10 + index)
}));

let notifications: NotificationSettings = {
  channels: ['site', 'telegram'],
  events: ['moe_gained', 'moe_threshold_dropped', 'session_finished', 'goal_reached'],
  quietHours: { start: 23, end: 8 },
  sessionReport: true,
  weeklyDigest: false
};

const devices: ModDevice[] = [
  {
    id: 'dev_7f3a9c',
    accountId: own.id,
    name: 'DESKTOP-TANKS',
    modVersion: '0.3.1',
    gameVersion: '2.2.0.1',
    lastSeenAt: daysAgo(1),
    revokedAt: null,
    createdAt: daysAgo(40)
  }
];

const removeFrom =
  <T extends { id: string }>(items: T[]) =>
  (id: string) => {
    const index = items.findIndex((item) => item.id === id);

    if (index >= 0) {
      items.splice(index, 1);
    }
  };

export const mockMe = {
  favorites: () => [...favorites],
  addFavorite: ({ kind, targetId, label, isOwn = false }: CreateFavoriteInput): Favorite => {
    const title = MOCK_PLAYERS.find(({ id }) => id === targetId)?.nickname ?? null;
    const favorite: Favorite = { id: mockUuid(Math.random), kind, targetId, label: label ?? null, isOwn, title, createdAt: now() };

    favorites.push(favorite);

    return favorite;
  },
  removeFavorite: removeFrom(favorites),
  goals: () => [...goals],
  addGoal: ({ accountId, metric, tankId, target, endsAt }: CreateGoalInput): Goal => {
    const goal: Goal = {
      id: mockUuid(Math.random),
      accountId,
      metric,
      tankId: tankId ?? null,
      target,
      baseline: target * 0.9,
      current: target * 0.93,
      status: 'active',
      startsAt: now(),
      endsAt,
      achievedAt: null,
      createdAt: now()
    };

    goals.unshift(goal);

    return goal;
  },
  removeGoal: removeFrom(goals),
  notifications: () => notifications,
  updateNotifications: (patch: Partial<NotificationSettings>) => {
    notifications = { ...notifications, ...patch };

    return notifications;
  },
  accounts: (): LinkedAccounts => ({
    userId: 'mock-user',
    name: own.nickname,
    email: null,
    lesta: [
      {
        accountId: own.id,
        nickname: own.nickname,
        isPrimary: true,
        linkedAt: daysAgo(90),
        tokenExpiresAt: addDays(new Date(), 12).toISOString()
      }
    ],
    telegram: { telegramId: '100200300', username: 'stalevar' }
  }),
  bindCode: (): BindCode => ({
    code: Array.from({ length: 8 }, () => BIND_ALPHABET[Math.floor(Math.random() * BIND_ALPHABET.length)]).join(''),
    accountId: own.id,
    expiresAt: addMinutes(new Date(), 15).toISOString()
  }),
  devices: () => devices.filter(({ revokedAt }) => revokedAt === null),
  revokeDevice: (id: string) => {
    const device = devices.find((item) => item.id === id);

    if (device) {
      device.revokedAt = now();
    }
  }
};
