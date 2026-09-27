import { SEASON_TRACK, seasonOf } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { SeasonProgress, UserLestaAccount } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { EntitlementsService } from '../../../billing';
import { SeasonService } from '../season.service';
import { ShellLedgerService } from '../shell-ledger.service';

const now = new Date('2026-09-26T10:00:00Z');
const season = seasonOf(now).code;
const pointsForLevel = (level: number) => level * SEASON_TRACK.pointsPerLevel;
const rewardsUpTo = (level: number) => SEASON_TRACK.rewards.filter((reward) => reward.level <= level);

const row = (fields: Pick<SeasonProgress, 'points'> & Partial<SeasonProgress>) => Object.assign(mock<SeasonProgress>(), { season, ...fields });

const setup = () => {
  const prisma = mockDeep<PrismaService>();
  const ledger = mock<ShellLedgerService>();
  const entitlements = mock<EntitlementsService>();

  entitlements.isPlus.mockResolvedValue(true);
  ledger.grant.mockResolvedValue(true);
  prisma.seasonProgress.findUnique.mockResolvedValue(null);
  prisma.cosmeticOwnership.createMany.mockResolvedValue({ count: 1 });

  return { prisma, ledger, entitlements, service: new SeasonService(prisma, ledger, entitlements) };
};

describe('SeasonService.track', () => {
  it('starts a new season at level zero with every reward unclaimed', async () => {
    const { service } = setup();

    const track = await service.track({ userId: 'u', now });

    expect(track).toMatchObject({ points: 0, level: 0, maxLevel: SEASON_TRACK.maxLevel, isAccruing: true });
    expect(track.rewards.every((reward) => !reward.isClaimed)).toBe(true);
  });

  it('marks rewards up to the current level as claimed', async () => {
    const { prisma, service } = setup();
    const level = SEASON_TRACK.rewards[1].level;

    prisma.seasonProgress.findUnique.mockResolvedValue(row({ points: pointsForLevel(level) }));

    const track = await service.track({ userId: 'u', now });

    expect(track.level).toBe(level);
    expect(track.rewards.filter((reward) => reward.isClaimed)).toHaveLength(rewardsUpTo(level).length);
  });

  it('reports that points do not accrue without Plus', async () => {
    const { entitlements, service } = setup();

    entitlements.isPlus.mockResolvedValue(false);

    expect((await service.track({ userId: 'u', now })).isAccruing).toBe(false);
  });

  it('describes the season containing now', async () => {
    const { service } = setup();

    const { season: window } = await service.track({ userId: 'u', now });

    expect(new Date(window.startsAt).getTime()).toBeLessThanOrEqual(now.getTime());
    expect(new Date(window.endsAt).getTime()).toBeGreaterThan(now.getTime());
  });
});

describe('SeasonService.history', () => {
  it('is empty for an account nobody linked', async () => {
    const { prisma, service } = setup();

    prisma.userLestaAccount.findUnique.mockResolvedValue(null);

    expect(await service.history(7)).toEqual({ items: [] });
    expect(prisma.seasonProgress.findMany).not.toHaveBeenCalled();
  });

  it('lists past seasons with the level their points reached', async () => {
    const { prisma, service } = setup();

    prisma.userLestaAccount.findUnique.mockResolvedValue(Object.assign(mock<UserLestaAccount>(), { userId: 'u' }));
    prisma.seasonProgress.findMany.mockResolvedValue([row({ season: '2026-q2', points: pointsForLevel(3) + 1 })]);

    expect(await service.history(7)).toEqual({ items: [{ season: '2026-q2', points: pointsForLevel(3) + 1, level: 3 }] });
  });
});

describe('SeasonService.claimRewards', () => {
  it('claims nothing below the first reward level', async () => {
    const { ledger, prisma, service } = setup();

    expect(await service.claimRewards({ userId: 'u', now })).toBe(0);
    expect(ledger.grant).not.toHaveBeenCalled();
    expect(prisma.cosmeticOwnership.createMany).not.toHaveBeenCalled();
  });

  it('grants every earned shell and cosmetic reward', async () => {
    const { prisma, ledger, service } = setup();
    const level = SEASON_TRACK.rewards[2].level;
    const earned = rewardsUpTo(level);

    prisma.seasonProgress.findUnique.mockResolvedValue(row({ points: pointsForLevel(level) }));

    expect(await service.claimRewards({ userId: 'u', now })).toBe(earned.length);
    expect(ledger.grant).toHaveBeenCalledTimes(earned.filter((reward) => reward.kind === 'shells').length);
    expect(prisma.cosmeticOwnership.createMany).toHaveBeenCalledTimes(earned.filter((reward) => reward.kind === 'cosmetic').length);
  });

  it('grants season shells without adding season points', async () => {
    const { prisma, ledger, service } = setup();

    prisma.seasonProgress.findUnique.mockResolvedValue(row({ points: pointsForLevel(SEASON_TRACK.maxLevel) }));

    await service.claimRewards({ userId: 'u', now });

    expect(ledger.grant.mock.calls.every(([input]) => input.points === 0 && input.reason === 'season')).toBe(true);
  });

  it('counts nothing on a re-run where every reward already exists', async () => {
    const { prisma, ledger, service } = setup();

    prisma.seasonProgress.findUnique.mockResolvedValue(row({ points: pointsForLevel(SEASON_TRACK.maxLevel) }));
    ledger.grant.mockResolvedValue(false);
    prisma.cosmeticOwnership.createMany.mockResolvedValue({ count: 0 });

    expect(await service.claimRewards({ userId: 'u', now })).toBe(0);
    expect(prisma.cosmeticOwnership.createMany).toHaveBeenCalledWith(expect.objectContaining({ skipDuplicates: true }));
  });

  it('keys each shell reward by season and level', async () => {
    const { prisma, ledger, service } = setup();

    prisma.seasonProgress.findUnique.mockResolvedValue(row({ points: pointsForLevel(SEASON_TRACK.maxLevel) }));

    await service.claimRewards({ userId: 'u', now });

    const keys = ledger.grant.mock.calls.map(([input]) => input.key);

    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.every((key) => key.includes(season))).toBe(true);
  });
});
