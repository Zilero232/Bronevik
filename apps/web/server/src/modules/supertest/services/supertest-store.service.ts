import { Injectable } from '@nestjs/common';

import type { StoreAnnouncementInput } from '../supertest.types';

import { PrismaService } from '../../../core';
import { readVehicleStats } from '../../reference';
import { SUPERTEST_VIEW } from '../config';
import { toChangeRows } from '../mappers';

@Injectable()
export class SupertestStoreService {
  constructor(private readonly prisma: PrismaService) {}

  async store({ announcement, tanks, now }: StoreAnnouncementInput): Promise<number> {
    const tankIds = tanks.flatMap((tank) => (tank.tankId === null ? [] : [tank.tankId]));
    const profiles = await this.prisma.vehicleProfile.findMany({
      where: { tankId: { in: tankIds }, profileId: SUPERTEST_VIEW.topProfile },
      select: { tankId: true, data: true }
    });

    const stats = new Map(profiles.map((profile) => [profile.tankId, readVehicleStats(profile.data)]));

    const rows = tanks.flatMap((tank) => toChangeRows({ tank, stats: tank.tankId === null ? null : (stats.get(tank.tankId) ?? null) }));

    await this.prisma.$transaction(async (tx) => {
      const { id } = await tx.supertestAnnouncement.upsert({
        where: { url: announcement.url },
        create: { ...announcement, fetchedAt: now, parsedAt: now },
        update: { ...announcement, fetchedAt: now, parsedAt: now },
        select: { id: true }
      });

      await tx.supertestChange.deleteMany({ where: { announcementId: id } });
      await tx.supertestChange.createMany({ data: rows.map((row, position) => ({ ...row, announcementId: id, position })) });
    });

    return rows.length;
  }
}
