import { sortBy } from 'remeda';

import type { MockActivity, MockClan, MockClanStint, MockClanTier, MockPlayer, MockWorld } from '../../lesta-mock.types';
import type {
  AccountExistsAtInput,
  AddStintInput,
  AssignMembersInput,
  BetweenInput,
  BuildClansInput,
  ClanMembersAtInput,
  CreateMockWorldInput,
  JoinedAtForInput,
  LastBattleBeforeAnchorInput,
  OfficerRolesInput,
  StintAtInput
} from './world.types';

import { MOCK_ACTIVITY, MOCK_CAREER, MOCK_CLANS, MOCK_SALT, MOCK_SKILL, MOCK_TIME, MOCK_WORLD } from '../../config';
import { clanIdentity, uniqueNickname } from '../names';
import { createRng } from '../random';
import { dayOf } from '../time';

const DAY = MOCK_TIME.daySec;
const YEAR = 365.25 * DAY;
const ACTIVITIES: readonly MockActivity[] = ['regular', 'casual', 'lapsed'];

const between = ({ rng, range }: BetweenInput): number => range[0] + rng.float() * (range[1] - range[0]);

const accountIdAt = (createdAt: number): number => {
  const knots = MOCK_WORLD.accountIdKnots;

  for (let index = 1; index < knots.length; index += 1) {
    const [toTime, toId] = knots[index] ?? [0, 0];
    const [fromTime, fromId] = knots[index - 1] ?? [0, 0];

    if (createdAt <= toTime) {
      return Math.round(fromId + ((createdAt - fromTime) / (toTime - fromTime)) * (toId - fromId));
    }
  }

  return knots.at(-1)?.[1] ?? 1;
};

const creationDates = ({ seed, count }: { seed: number; count: number }): number[] => {
  const rng = createRng(seed, MOCK_SALT.accounts);

  return sortBy(
    Array.from({ length: count }, () =>
      Math.round(
        rng.chance(MOCK_WORLD.earlyShare)
          ? between({ rng, range: [MOCK_WORLD.firstAccountAt, MOCK_WORLD.earlyUntil] })
          : between({ rng, range: [MOCK_WORLD.earlyUntil, MOCK_WORLD.lastAccountAt] })
      )
    ),
    (value) => value
  );
};

const lastBattleBeforeAnchor = ({ rng, activity, createdAt }: LastBattleBeforeAnchorInput): number => {
  const gap =
    activity === 'lapsed' ? MOCK_ACTIVITY.lapsedGapDays : activity === 'casual' ? MOCK_ACTIVITY.casualGapDays : MOCK_ACTIVITY.regularGapDays;

  const at = MOCK_TIME.anchor - Math.round(between({ rng, range: gap }) * DAY) - rng.int({ min: 0, max: DAY - 1 });

  return Math.max(createdAt + 7 * DAY, at);
};

const createPlayer = ({
  seed,
  index,
  createdAt,
  accountId,
  taken
}: {
  seed: number;
  index: number;
  createdAt: number;
  accountId: number;
  taken: Set<string>;
}): MockPlayer => {
  const rng = createRng(seed, MOCK_SALT.player, index);
  const ageYears = (MOCK_TIME.anchor - createdAt) / YEAR;
  const skill = rng.normal() + MOCK_SKILL.ageBoostPerYear * ageYears;
  const winSkill = MOCK_SKILL.winCorrelation * skill + Math.sqrt(1 - MOCK_SKILL.winCorrelation ** 2) * rng.normal();
  const activity = rng.weighted({ items: ACTIVITIES, weight: (key) => MOCK_ACTIVITY.shares[key] });
  const ageFactor = Math.min(1.6, (Math.max(ageYears, 0.1) / MOCK_CAREER.ageMedianYears) ** 0.6);
  const cap = ((MOCK_TIME.anchor - createdAt) / DAY) * MOCK_CAREER.battlesPerDayCap;
  const career =
    rng.logNormal({ median: MOCK_CAREER.battlesMedian * ageFactor, sigma: MOCK_CAREER.battlesSigma }) *
    Math.exp(0.15 * skill) *
    (activity === 'lapsed' ? 0.6 : 1);

  const chronotype = rng.weighted({ items: MOCK_ACTIVITY.chronotypes, weight: (entry) => entry.share });
  const sessionHour = Math.min(
    MOCK_ACTIVITY.latestHour - 2,
    Math.max(MOCK_ACTIVITY.earliestHour, rng.normal({ mean: chronotype.mean, deviation: chronotype.sigma }))
  );

  return {
    index,
    accountId,
    nickname: uniqueNickname({ rng: createRng(seed, MOCK_SALT.nickname, index), taken }),
    createdAt,
    skill,
    winSkill,
    drift: rng.normal({ mean: MOCK_SKILL.driftMean, deviation: MOCK_SKILL.driftSigma }),
    careerBattles: Math.round(Math.max(MOCK_CAREER.minBattles, Math.min(cap, career))),
    activity,
    dayChance: between({ rng, range: MOCK_ACTIVITY.dayChance[activity] }),
    sessionBattles: rng.logNormal({ median: MOCK_ACTIVITY.sessionMedian[activity], sigma: 0.35 }),
    sessionHour,
    lastBattleBeforeAnchor: lastBattleBeforeAnchor({ rng, activity, createdAt }),
    premiumShare: Math.min(MOCK_CAREER.premiumShare[1], Math.max(MOCK_CAREER.premiumShare[0], rng.float() + 0.1 * skill)),
    stints: []
  };
};

const createPlayers = ({ seed, count }: { seed: number; count: number }): MockPlayer[] => {
  const taken = new Set<string>();
  const idRng = createRng(seed, MOCK_SALT.accounts, 1);
  let previousId = 0;

  return creationDates({ seed, count }).map((createdAt, index) => {
    const accountId = Math.max(previousId + idRng.int({ min: 1, max: 900 }), accountIdAt(createdAt) + idRng.int({ min: -400, max: 400 }));

    previousId = accountId;

    return createPlayer({ seed, index, createdAt, accountId, taken });
  });
};

const tierOf = (index: number): MockClanTier => {
  if (index < MOCK_CLANS.tiers.top) {
    return 'top';
  }

  return index < MOCK_CLANS.tiers.top + MOCK_CLANS.tiers.mid ? 'mid' : 'small';
};

const buildClans = ({ seed, count }: BuildClansInput): MockClan[] => {
  const takenTags = new Set<string>();
  const clans: MockClan[] = [];
  let clanId = MOCK_WORLD.clanIdBase;

  for (let index = 0; index < count; index += 1) {
    const rng = createRng(seed, MOCK_SALT.clan, index);
    const tier = tierOf(index);
    const isAcademy = tier === 'mid' && index < MOCK_CLANS.tiers.top + MOCK_CLANS.academies;
    const parent = isAcademy ? clans[index - MOCK_CLANS.tiers.top] : undefined;
    const identity = clanIdentity({ rng, takenTags, parent });
    const renamed = rng.chance(MOCK_CLANS.renameChance);
    const createdAt = Math.round(
      between({ rng, range: [MOCK_CLANS.createdFrom, tier === 'top' ? MOCK_CLANS.createdFrom + 4 * YEAR : MOCK_CLANS.createdTo] })
    );

    clanId += rng.int({ min: MOCK_WORLD.clanIdStep[0], max: MOCK_WORLD.clanIdStep[1] });

    clans.push({
      index,
      clanId,
      ...identity,
      createdAt,
      tier,
      strongholdLevel: rng.int({ min: MOCK_CLANS.stronghold[tier][0], max: MOCK_CLANS.stronghold[tier][1] }),
      onGlobalMap: rng.chance(MOCK_CLANS.globalMapChance[tier]),
      elo: {
        6: Math.round(between({ rng, range: MOCK_CLANS.elo[tier] }) * 0.92),
        8: Math.round(between({ rng, range: MOCK_CLANS.elo[tier] }) * 0.97),
        10: Math.round(between({ rng, range: MOCK_CLANS.elo[tier] }))
      },
      oldTag: renamed ? `${identity.tag.slice(0, 3)}${rng.int({ min: 1, max: 9 })}` : null,
      oldName: renamed ? `${identity.name} ${rng.int({ min: 2, max: 9 })}` : null,
      renamedAt: renamed ? Math.round(between({ rng, range: [createdAt + YEAR, MOCK_TIME.anchor - 30 * DAY] })) : null,
      acceptsJoinRequests: rng.chance(tier === 'top' ? 0.3 : 0.75),
      memberships: []
    });
  }

  return clans;
};

const officerRoles = ({ rng, slots }: OfficerRolesInput): string[] =>
  Object.entries(slots).flatMap(([role, range]) => Array.from<string>({ length: rng.int({ min: range[0], max: range[1] }) }).fill(role));

const joinedAtFor = ({ rng, clan, player }: JoinedAtForInput): number => {
  const from = Math.max(clan.createdAt, player.createdAt + 14 * DAY);

  if (rng.chance(MOCK_CLANS.windowJoinShare)) {
    return Math.round(between({ rng, range: [MOCK_TIME.anchor, MOCK_TIME.anchor + MOCK_TIME.horizonDays * DAY] }));
  }

  return Math.round(between({ rng, range: [from, Math.max(from + DAY, MOCK_TIME.anchor - DAY)] }));
};

const addStint = ({ clan, player, stint }: AddStintInput) => {
  player.stints.push(stint);
  clan.memberships.push({ player, stint });
};

const assignMembers = ({ seed, clans, players }: AssignMembersInput) => {
  const rng = createRng(seed, MOCK_SALT.membership);
  const candidates = players.filter((player) =>
    rng.chance(player.activity === 'lapsed' ? MOCK_CLANS.joinChance.lapsed : MOCK_CLANS.joinChance.active)
  );

  const ranked = sortBy(
    candidates.map((player) => ({ player, score: player.skill + rng.normal({ mean: 0, deviation: 0.6 }) })),
    [({ score }) => score, 'desc']
  ).map(({ player }) => player);

  const pool = [...ranked];
  const smallStart = MOCK_CLANS.tiers.top + MOCK_CLANS.tiers.mid;

  for (const clan of clans) {
    if (clan.index === smallStart) {
      pool.splice(0, pool.length, ...rng.shuffle(pool));
    }

    const size = rng.int({ min: MOCK_CLANS.size[clan.tier][0], max: MOCK_CLANS.size[clan.tier][1] });
    const members: MockPlayer[] = [];
    const skipped: MockPlayer[] = [];

    while (members.length < size && pool.length > 0) {
      const next = pool.shift();

      if (!next) {
        break;
      }

      if (clan.tier !== 'small' && rng.chance(MOCK_CLANS.headSkip)) {
        skipped.push(next);
      } else {
        members.push(next);
      }
    }

    pool.unshift(...skipped);

    const founder = sortBy(members, (member) => member.createdAt)[0];

    if (!founder) {
      continue;
    }

    clan.createdAt = Math.min(MOCK_TIME.anchor - 30 * DAY, Math.max(clan.createdAt, founder.createdAt + 30 * DAY));

    const officers = officerRoles({ rng, slots: MOCK_CLANS.officers });
    const joined = sortBy(
      members.filter((member) => member !== founder).map((member) => ({ member, joinedAt: joinedAtFor({ rng, clan, player: member }) })),
      ({ joinedAt }) => joinedAt
    );

    addStint({ clan, player: founder, stint: { clanId: clan.clanId, joinedAt: clan.createdAt, leftAt: null, role: 'commander' } });

    for (const [position, { member, joinedAt }] of joined.entries()) {
      const officer = joinedAt < MOCK_TIME.anchor ? officers[position] : undefined;
      const roll = rng.float();
      const role =
        officer ??
        (roll < MOCK_CLANS.juniorShare
          ? 'junior_officer'
          : roll < MOCK_CLANS.juniorShare + MOCK_CLANS.recruitShare
            ? 'recruit'
            : roll < MOCK_CLANS.juniorShare + MOCK_CLANS.recruitShare + MOCK_CLANS.reservistShare
              ? 'reservist'
              : 'private');

      const leaves = !officer && rng.chance(MOCK_CLANS.leaveChance);
      const leftAt = leaves
        ? Math.round(between({ rng, range: [Math.max(joinedAt, MOCK_TIME.anchor) + DAY, MOCK_TIME.anchor + MOCK_TIME.horizonDays * DAY] }))
        : null;

      addStint({ clan, player: member, stint: { clanId: clan.clanId, joinedAt, leftAt, role } });
    }
  }

  const hopTargets = clans.filter((clan) => clan.tier !== 'top' && clan.memberships.some(({ stint }) => stint.role === 'commander'));

  for (const player of players) {
    const current = player.stints[0];

    if (current?.leftAt && rng.chance(MOCK_CLANS.hopChance)) {
      const target = rng.pick(hopTargets.filter((clan) => clan.clanId !== current.clanId));

      addStint({
        clan: target,
        player,
        stint: { clanId: target.clanId, joinedAt: current.leftAt + rng.int({ min: 1, max: 30 }) * DAY, leftAt: null, role: 'private' }
      });
    }

    const firstJoin = current?.joinedAt ?? MOCK_TIME.anchor - 60 * DAY;
    const hasPast = rng.chance(current ? MOCK_CLANS.pastStintChance : MOCK_CLANS.clanlessPastChance);
    const pastEnd = firstJoin - rng.int({ min: 1, max: 200 }) * DAY;
    const pastStart = pastEnd - rng.int({ min: 30, max: 900 }) * DAY;

    const pastTargets =
      hasPast && pastStart > player.createdAt + 14 * DAY
        ? hopTargets.filter((clan) => clan.clanId !== current?.clanId && clan.createdAt < pastStart)
        : [];

    if (pastTargets.length > 0) {
      const target = rng.pick(pastTargets);

      addStint({ clan: target, player, stint: { clanId: target.clanId, joinedAt: pastStart, leftAt: pastEnd, role: 'private' } });
    }

    player.stints.sort((left, right) => left.joinedAt - right.joinedAt);
  }

  for (const clan of clans) {
    clan.memberships.sort((left, right) => left.stint.joinedAt - right.stint.joinedAt);
  }
};

export const createMockWorld = ({
  catalog,
  seed = MOCK_WORLD.seed,
  players: count = MOCK_WORLD.players,
  clans: clanCount = MOCK_WORLD.clans
}: CreateMockWorldInput): MockWorld => {
  const players = createPlayers({ seed, count });
  const clans = buildClans({ seed, count: clanCount });

  assignMembers({ seed, clans, players });

  return {
    seed,
    anchor: MOCK_TIME.anchor,
    anchorDay: dayOf(MOCK_TIME.anchor),
    catalog,
    players,
    playerByAccountId: new Map(players.map((player) => [player.accountId, player])),
    nicknames: sortBy(
      players.map((player) => [player.nickname.toLowerCase(), player] as const),
      ([nickname]) => nickname
    ),
    clans,
    clanById: new Map(clans.map((clan) => [clan.clanId, clan]))
  };
};

export const stintAt = ({ player, at }: StintAtInput): MockClanStint | null =>
  player.stints.find((stint) => stint.joinedAt <= at && (stint.leftAt === null || stint.leftAt > at)) ?? null;

export const clanMembersAt = ({ clan, at }: ClanMembersAtInput) =>
  clan.memberships.filter(({ stint }) => stint.joinedAt <= at && (stint.leftAt === null || stint.leftAt > at));

export const accountExistsAt = ({ player, at }: AccountExistsAtInput): boolean => player.createdAt <= at;
