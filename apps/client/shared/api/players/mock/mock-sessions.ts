import type { Session, SessionBattle, SessionListItem, SessionsPage } from '@bronevik/schemas';

import { addMinutes, subDays } from 'date-fns';
import { sortBy } from 'remeda';

import { seededRandom } from '@/shared/lib';
import { MOCK_TANKS } from '@/shared/mocks';

import type { MockSessionInput, MockSessionsInput, SessionOfInput, SessionSeedInput } from './mock.types';

import { NotFoundError } from '../../source/source.errors';
import { mockPlayerById } from './mock-player';
import { clamp, isoDateDaysAgo, mockStatsBlock, mockUuid, mockVehicle, round } from './mock.helpers';

const SESSION_DAYS = 45;

const MAPS = [
  'Прохоровка',
  'Химмельсдорф',
  'Малиновка',
  'Рудники',
  'Энск',
  'Ласвилль',
  'Утёс',
  'Мурованка',
  'Степи',
  'Эрленберг',
  'Вестфилд',
  'Карелия'
];

const battlesOf = ({ player, random, count, startedAt }: SessionSeedInput): SessionBattle[] =>
  Array.from({ length: count }, (_, index) => {
    const tank = MOCK_TANKS[Math.floor(random() * 15)];
    const isWin = random() < player.winRate / 100;
    const damageDealt = round(tank.avgDamage * Math.sqrt(player.wn8 / 2000) * (0.3 + random() * 1.4));

    return {
      id: mockUuid(random),
      arenaUniqueId: String(round(random() * 1e12)),
      vehicle: mockVehicle(tank),
      arenaId: `arena_${index}`,
      mapName: MAPS[Math.floor(random() * MAPS.length)],
      battleType: 'random',
      result: isWin ? 'win' : 'loss',
      survived: random() > 0.55,
      damageDealt,
      damageAssisted: round(random() * 1400),
      damageBlocked: round(random() * 1800),
      spotted: round(random() * 4),
      frags: round(random() * random() * 5),
      xp: round(damageDealt * 0.3 + (isWin ? 400 : 120)),
      credits: round(15_000 + random() * 60_000),
      moePercent: round(clamp(60 + random() * 35, 0, 100), 2),
      moePercentDelta: round((random() - 0.45) * 1.6, 2),
      queueTimeSec: round(8 + random() * 50),
      durationSec: round(240 + random() * 300),
      shots: null,
      startedAt: addMinutes(new Date(startedAt), index * 8).toISOString()
    };
  });

const sessionOf = ({ player, offset }: SessionOfInput): Session => {
  const random = seededRandom(player.id * 7 + offset * 131);
  const battles = round(6 + random() * 44);
  const form = 0.8 + random() * 0.45;
  const startedAt = subDays(new Date(), offset);
  const isMod = offset % 3 === 0;
  const stats = mockStatsBlock({
    battles,
    winRate: player.winRate + (form - 1) * 25,
    avgDamage: player.avgDamage * form,
    wn8: player.wn8 * form,
    broneIndex: player.broneIndex,
    random
  });

  startedAt.setHours(18, round(random() * 50), 0, 0);

  const tanks = sortBy(
    Array.from({ length: 2 + Math.floor(random() * 4) }, (_, index) => ({
      vehicle: mockVehicle(MOCK_TANKS[(index * 5 + offset) % MOCK_TANKS.length]),
      stats: mockStatsBlock({
        battles: round(2 + random() * 12),
        winRate: player.winRate + (random() - 0.5) * 30,
        avgDamage: player.avgDamage * (0.6 + random() * 0.9),
        wn8: player.wn8 * (0.6 + random() * 0.9),
        broneIndex: player.broneIndex,
        random
      })
    })),
    [({ stats: block }) => block.wn8.value ?? 0, 'desc']
  );

  return {
    id: mockUuid(random),
    accountId: player.id,
    kind: offset === 0 ? 'live' : 'day',
    source: isMod ? 'mod' : 'api',
    isLive: offset === 0,
    day: isoDateDaysAgo(offset),
    startedAt: startedAt.toISOString(),
    endedAt: offset === 0 ? null : addMinutes(startedAt, battles * 8).toISOString(),
    stats,
    credits: round(battles * (20_000 + random() * 25_000)),
    tanks,
    battles: isMod ? battlesOf({ player, random, count: Math.min(battles, 14), startedAt: startedAt.toISOString() }) : null,
    best: tanks[0] ?? null,
    worst: tanks.length > 1 ? tanks[tanks.length - 1] : null
  };
};

const allSessions = (accountId: number): Session[] => {
  const player = mockPlayerById(accountId);
  const random = seededRandom(accountId + 55);

  return Array.from({ length: SESSION_DAYS }, (_, offset) => offset)
    .filter((offset) => offset === 0 || random() < 0.62)
    .map((offset) => sessionOf({ player, offset }));
};

export const mockSessions = ({ accountId, limit, offset }: MockSessionsInput): SessionsPage => {
  const sessions = allSessions(accountId);
  const items: SessionListItem[] = sessions
    .slice(offset, offset + limit)
    .map(({ id, kind, source, isLive, day, startedAt, endedAt, stats }) => ({ id, kind, source, isLive, day, startedAt, endedAt, stats }));

  return { items, total: sessions.length, limit, offset };
};

export const mockSession = ({ accountId, sessionId }: MockSessionInput): Session => {
  const session = allSessions(accountId).find(({ id }) => id === sessionId);

  if (!session) {
    throw new NotFoundError(sessionId);
  }

  return session;
};
