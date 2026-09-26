import { utc } from '@date-fns/utc';
import { Inject, Injectable } from '@nestjs/common';
import { MASTERY_PERCENTILES } from '@otmetki/ratings';
import { startOfDay } from 'date-fns';

import type { LestaClients } from '../../../../core';

import { toJsonValue } from '../../../../common/lib';
import { LESTA_CLIENTS, PrismaService } from '../../../../core';
import { REFERENCE } from '../config';
import { masteryThresholdRows } from '../lib/community-data';

@Injectable()
export class MasteryThresholdsSyncService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(LESTA_CLIENTS) private readonly clients: LestaClients
  ) {}

  async sync() {
    const vehicles = await this.prisma.vehicle.findMany({ where: { isActive: true }, select: { tankId: true } });

    if (vehicles.length === 0) {
      return { vehicles: 0 };
    }

    const distribution = await this.clients.bulk.tanks.mastery({
      tankIds: vehicles.map((vehicle) => vehicle.tankId),
      distribution: REFERENCE.masteryDistribution,
      percentiles: Object.values(MASTERY_PERCENTILES)
    });

    const rows = masteryThresholdRows(distribution);

    if (rows.length === 0) {
      return { vehicles: 0 };
    }

    const date = startOfDay(new Date(), { in: utc });

    await this.prisma.$transaction([
      this.prisma.masteryThreshold.deleteMany({ where: { source: 'lesta', date } }),
      this.prisma.masteryThreshold.createMany({ data: rows.map((row) => ({ ...row, date, source: 'lesta' as const })) }),
      this.prisma.tankPercentile.deleteMany({ where: { distribution: REFERENCE.masteryDistribution, date } }),
      this.prisma.tankPercentile.createMany({
        data: Object.entries(distribution).map(([tankId, percentiles]) => ({
          tankId: Number(tankId),
          date,
          distribution: REFERENCE.masteryDistribution,
          percentiles: toJsonValue(percentiles)
        }))
      })
    ]);

    return { vehicles: rows.length };
  }
}
