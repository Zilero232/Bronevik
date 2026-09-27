import type { BuildUsage, LoadoutResult } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { EntitlementsService } from '../../../billing';
import type { BuildUsageService } from '../build-usage.service';
import type { LoadoutService } from '../loadout.service';

import { AppBadRequestException, AppForbiddenException } from '../../../../common/exceptions';
import { RecommendedBuildService } from '../recommended-build.service';

const usage = (isEnough: boolean): BuildUsage => ({
  mode: 'random',
  cohort: 'top10',
  battles: isEnough ? 100 : 3,
  players: 10,
  minSample: 30,
  isEnough,
  windowDays: 30,
  gameVersion: null,
  computedAt: null,
  winRate: null,
  avgDamage: null,
  equipment: [],
  consumables: [],
  directives: [],
  shells: [],
  fieldModifications: [],
  crew: []
});

const createService = () => {
  const buildUsage = mock<BuildUsageService>();
  const loadouts = mock<LoadoutService>();
  const entitlements = mock<EntitlementsService>();

  return { buildUsage, loadouts, entitlements, service: new RecommendedBuildService(buildUsage, loadouts, entitlements) };
};

describe('RecommendedBuildService', () => {
  it('returns the sample size and no loadout without enough data', async () => {
    const { service, buildUsage, loadouts } = createService();

    buildUsage.usage.mockResolvedValue(usage(false));

    const result = await service.recommended({ tankId: 1, query: { mode: 'random', cohort: 'top10' }, viewerUserId: null });

    expect(result).toMatchObject({ tankId: 1, loadout: null, result: null, usage: { battles: 3 } });
    expect(loadouts.calculate).not.toHaveBeenCalled();
  });

  it('calculates the recommended loadout and keeps the build when the calculation is refused', async () => {
    const { service, buildUsage, loadouts } = createService();

    buildUsage.usage.mockResolvedValue(usage(true));
    loadouts.calculate.mockResolvedValueOnce(mock<LoadoutResult>({ tankId: 1 }));

    const calculated = await service.recommended({ tankId: 1, query: { mode: 'random', cohort: 'all' }, viewerUserId: null });

    expect(calculated.loadout?.profileId).toBe('top');
    expect(calculated.result?.tankId).toBe(1);

    loadouts.calculate.mockRejectedValueOnce(new AppBadRequestException('VALIDATION_FAILED', 'bad'));

    expect((await service.recommended({ tankId: 1, query: { mode: 'random', cohort: 'all' }, viewerUserId: null })).result).toBeNull();
  });

  it('keeps the top 1% cohort for Plus', async () => {
    const { service, buildUsage, entitlements } = createService();

    buildUsage.usage.mockResolvedValue(usage(false));

    await expect(service.recommended({ tankId: 1, query: { mode: 'random', cohort: 'top1' }, viewerUserId: null })).rejects.toBeInstanceOf(
      AppForbiddenException
    );

    entitlements.assertFeature.mockRejectedValueOnce(new AppForbiddenException('SUBSCRIPTION_REQUIRED', 'no'));

    await expect(service.recommended({ tankId: 1, query: { mode: 'random', cohort: 'top1' }, viewerUserId: 'u' })).rejects.toBeInstanceOf(
      AppForbiddenException
    );

    entitlements.assertFeature.mockResolvedValueOnce();

    await expect(service.recommended({ tankId: 1, query: { mode: 'random', cohort: 'top1' }, viewerUserId: 'u' })).resolves.toMatchObject({
      tankId: 1
    });

    expect(entitlements.assertFeature).toHaveBeenLastCalledWith({ userId: 'u', feature: 'analytics' });
  });
});
