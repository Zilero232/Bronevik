import type {
  ClanEventsPage,
  ClanListItem,
  ClanListPage,
  ClanListSortField,
  ClanMember,
  ClanMemberEvent,
  ClanPage,
  ClanRole,
  ClanStronghold
} from '@bronevik/schemas';

import { ratingTier } from '@bronevik/ratings';
import { addDays, formatISO, parseISO } from 'date-fns';
import { clamp, sumBy } from 'remeda';

import type { MockClan } from '@/shared/mocks';

import { seededRandom } from '@/shared/lib';
import { MOCK_CLANS } from '@/shared/mocks';

import type { ClanEventsInput, ClanListInput } from './clans.types';

import { CLAN_MOCK } from './clans.constants';

const at = (daysAgo: number) => formatISO(addDays(parseISO(CLAN_MOCK.now), -daysAgo));

const percent = (value: number) => clamp(Math.round(value * 10) / 10, { min: 0, max: 100 });

const nickname = (random: () => number) => {
  const pick = (list: readonly string[]) => list[Math.floor(random() * list.length)] ?? list[0];

  return `${pick(CLAN_MOCK.nickStarts)}_${pick(CLAN_MOCK.nickEnds)}${random() > 0.5 ? Math.floor(random() * 99) : ''}`;
};

const roleOf = (index: number): ClanRole => CLAN_MOCK.roleLadder.find(({ until }) => index < until)?.role ?? 'private';

const findClan = (idOrTag: number | string) =>
  MOCK_CLANS.find(({ id, tag }) => id === Number(idOrTag) || tag.toLowerCase() === String(idOrTag).toLowerCase());

const members = (clan: MockClan): ClanMember[] => {
  const random = seededRandom(clan.id * 97);

  return Array.from({ length: clan.members }, (_, index) => {
    const inactiveDays = random() > 0.8 ? Math.floor(random() * 60) : Math.floor(random() * 3);
    const wn8 = Math.round(clan.rating * (0.45 + random() * 0.9));
    const recent = Math.round(wn8 * (0.85 + random() * 0.35));

    return {
      accountId: 30_000_000 + clan.id * 1_000 + index,
      nickname: nickname(random),
      role: roleOf(index),
      joinedAt: at(Math.floor(30 + random() * 1_400)),
      lastBattleAt: at(inactiveDays),
      inactiveDays,
      battles: Math.round(4_000 + random() * 50_000),
      winRate: percent(clan.winRate + (random() - 0.5) * 12),
      wn8: { value: wn8, tier: ratingTier({ scale: 'wn8', value: wn8 }) },
      recentWn8: { value: recent, tier: ratingTier({ scale: 'wn8', value: recent }) }
    };
  });
};

const events = (clan: MockClan): ClanMemberEvent[] => {
  const random = seededRandom(clan.id * 31);

  return Array.from({ length: CLAN_MOCK.eventCount }, (_, index) => {
    const type = CLAN_MOCK.eventTypes[Math.floor(random() * CLAN_MOCK.eventTypes.length)] ?? 'joined';
    const isRoleChange = type === 'role_changed';

    return {
      accountId: 31_000_000 + clan.id * 1_000 + index,
      nickname: nickname(random),
      type,
      oldRole: isRoleChange ? 'private' : null,
      newRole: isRoleChange ? 'junior_officer' : null,
      occurredAt: at(index * 2 + Math.floor(random() * 2))
    };
  });
};

const summaryOf = (clan: MockClan): ClanPage['clan'] => ({
  clanId: clan.id,
  tag: clan.tag,
  name: clan.name,
  color: CLAN_MOCK.colors[clan.id % CLAN_MOCK.colors.length] ?? null,
  motto: CLAN_MOCK.mottos[clan.id % CLAN_MOCK.mottos.length] ?? null,
  emblem: null,
  membersCount: clan.members,
  createdAt: at(1_800 + clan.id * 120),
  isDisbanded: false
});

const statsOf = (clan: MockClan): ClanPage['stats'] => ({
  avgWinRate: clan.winRate,
  avgWn8: { value: clan.rating, tier: ratingTier({ scale: 'wn8', value: clan.rating }) },
  avgBattlesPerDay: Math.round(clan.members * 4.2),
  activeMembers7d: members(clan).filter(({ inactiveDays }) => (inactiveDays ?? Number.POSITIVE_INFINITY) <= 7).length,
  eloRating10: Math.round(clan.rating / 1.6),
  strongholdLevel: clamp(Math.round(clan.rating / 250), { min: 1, max: 10 }),
  provincesCount: Math.max(0, Math.round((clan.rating - 1_600) / 90))
});

export const mockClanPage = (idOrTag: string): ClanPage | null => {
  const clan = findClan(idOrTag);

  if (!clan) {
    return null;
  }

  return {
    clan: summaryOf(clan),
    stats: statsOf(clan),
    members: members(clan),
    recentEvents: events(clan).slice(0, 10),
    updatedAt: CLAN_MOCK.now
  };
};

export const mockClanEvents = ({ clanId, limit = 25, offset = 0 }: ClanEventsInput): ClanEventsPage => {
  const clan = findClan(clanId);
  const all = clan ? events(clan) : [];

  return { items: all.slice(offset, offset + limit), total: all.length, limit, offset };
};

const SORT_VALUE: Record<ClanListSortField, (item: ClanListItem) => number | null> = {
  members: ({ clan }) => clan.membersCount,
  wn8: ({ avgWn8 }) => avgWn8.value,
  winRate: ({ avgWinRate }) => avgWinRate,
  eloRating10: ({ eloRating10 }) => eloRating10,
  strongholdLevel: ({ strongholdLevel }) => strongholdLevel,
  activeMembers: ({ activeMembers7d }) => activeMembers7d
};

const listItemOf = (clan: MockClan): ClanListItem => {
  const { avgWn8, avgWinRate, activeMembers7d, eloRating10, strongholdLevel } = statsOf(clan);

  return { clan: summaryOf(clan), avgWn8, avgWinRate, activeMembers7d, eloRating10, strongholdLevel };
};

const matches = ({ clan, needle }: { clan: MockClan; needle: string }) =>
  needle === '' || clan.tag.toLowerCase().includes(needle) || clan.name.toLowerCase().includes(needle);

export const mockClanList = ({ sort = 'members', order = 'desc', search, limit = 25, offset = 0 }: Omit<ClanListInput, 'signal'>): ClanListPage => {
  const needle = search?.trim().toLowerCase() ?? '';
  const direction = order === 'asc' ? 1 : -1;
  const valueOf = (item: ClanListItem) => SORT_VALUE[sort](item) ?? Number.NEGATIVE_INFINITY;
  const all = MOCK_CLANS.filter((clan) => matches({ clan, needle }))
    .map(listItemOf)
    .sort((a, b) => (valueOf(a) - valueOf(b)) * direction || a.clan.clanId - b.clan.clanId);

  return { items: all.slice(offset, offset + limit), total: all.length, limit, offset };
};

export const mockClanStronghold = (clanId: number): ClanStronghold | null => {
  const clan = findClan(clanId);

  if (!clan) {
    return null;
  }

  const random = seededRandom(clanId * 7);
  const stats = statsOf(clan);
  const level = stats.strongholdLevel ?? 1;
  const skirmishes = CLAN_MOCK.skirmishTiers.map((tier) => {
    const battles = Math.round(level * tier * 4 * (0.4 + random()));
    const wins = clamp(Math.round(battles * (clan.winRate / 100 + (random() - 0.5) * 0.1)), { min: 0, max: battles });

    return { tier, battles, wins, winRate: battles > 0 ? percent((wins / battles) * 100) : null };
  });

  const battles = sumBy(skirmishes, (tier) => tier.battles);
  const wins = sumBy(skirmishes, (tier) => tier.wins);
  const elo10 = stats.eloRating10;
  const provinces = CLAN_MOCK.provinces.slice(0, stats.provincesCount).map((name, index) => ({
    provinceId: `province_${clanId}_${index}`,
    name,
    arenaId: null,
    dailyRevenue: Math.round(200 + random() * 900)
  }));

  return {
    clanId,
    level,
    commandCenterArenaId: null,
    totalResources: Math.round(level * 1_200 * (0.5 + random())),
    buildingSlots: CLAN_MOCK.buildings.length,
    buildings: CLAN_MOCK.buildings.map(({ type, title }, position) => ({
      type,
      title,
      level: Math.max(1, level - Math.floor(random() * 3)),
      position,
      direction: null,
      arenaId: null,
      reserve: null
    })),
    reserves:
      clanId === CLAN_MOCK.reservesClanId
        ? CLAN_MOCK.reserves.map(({ type, title, bonusType }) => ({
            type,
            title,
            level: Math.max(1, Math.round(random() * 10)),
            status: 'ready_to_activate',
            count: Math.floor(random() * 12),
            bonusType,
            activatedAt: null,
            expiresAt: null
          }))
        : [],
    skirmishes,
    battles,
    winRate: battles > 0 ? percent((wins / battles) * 100) : null,
    globalMap: {
      provincesCount: provinces.length,
      eloRating6: elo10 === null ? null : Math.round(elo10 * 0.81),
      eloRating8: elo10 === null ? null : Math.round(elo10 * 0.92),
      eloRating10: elo10,
      provinces
    },
    updatedAt: CLAN_MOCK.now
  };
};
