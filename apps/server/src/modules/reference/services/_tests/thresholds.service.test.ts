import { describe, expect, it } from 'vitest';
import { matches, mock, mockDeep } from 'vitest-mock-extended';

import type { MasteryThreshold, MoeThreshold, Prisma } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { THRESHOLD_SOURCE_PRIORITY } from '../../config';
import { ThresholdsService } from '../thresholds.service';

const [PREFERRED, FALLBACK] = THRESHOLD_SOURCE_PRIORITY;

const moe = (tankId: number, source: MoeThreshold['source']): MoeThreshold => mock<MoeThreshold>({ tankId, source, p65: 1000 });

const readsTable = (table: string) =>
  matches<Prisma.Sql | TemplateStringsArray>((query) => ('strings' in query ? query.strings : query).join('').includes(`FROM ${table}`));

const createService = ({ moeRows = [], masteryRows = [] }: { moeRows?: MoeThreshold[]; masteryRows?: MasteryThreshold[] }) => {
  const prisma = mockDeep<PrismaService>();

  prisma.$queryRaw.calledWith(readsTable('moe_threshold')).mockResolvedValue(moeRows);
  prisma.$queryRaw.calledWith(readsTable('mastery_threshold')).mockResolvedValue(masteryRows);

  return { service: new ThresholdsService(prisma), prisma };
};

describe('ThresholdsService', () => {
  it('prefers the higher-priority source per tank', async () => {
    const { service } = createService({ moeRows: [moe(1, FALLBACK), moe(1, PREFERRED)] });

    expect((await service.moe(1))?.source).toBe(PREFERRED);
  });

  it('answers null for a tank without thresholds', async () => {
    const { service } = createService({ moeRows: [moe(1, PREFERRED)] });

    await expect(service.moe(2)).resolves.toBeNull();
    await expect(service.mastery(1)).resolves.toBeNull();
  });

  it('serves repeated reads of the latest thresholds from the cache', async () => {
    const { service, prisma } = createService({ moeRows: [moe(1, PREFERRED)] });

    await service.latest();
    await service.moe(1);

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(2);
  });

  it('caches each source separately', async () => {
    const { service, prisma } = createService({ moeRows: [moe(1, PREFERRED)] });

    await service.latest();
    await service.latest(FALLBACK);

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(4);
  });

  it('filters the MoE history only by the bounds that were given', async () => {
    const { service, prisma } = createService({});
    const from = new Date('2026-01-01T00:00:00.000Z');

    prisma.moeThreshold.findMany.mockResolvedValue([]);

    await service.moeHistory({ tankId: 1, from });

    expect(prisma.moeThreshold.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { tankId: 1, date: { gte: from } } }));
  });
});
