import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { uniqueBy } from 'remeda';

import type { ParsedTank } from '../lib';
import type { DevSeedInput } from '../supertest.types';
import type { DevSeedSummary } from './supertest-dev-seed.types';

import { PrismaService } from '../../../core';
import { readVehicleStats } from '../../reference';
import { SUPERTEST_DEV, SUPERTEST_SOURCES, SUPERTEST_VIEW } from '../config';
import { devChanges, devNewVehicleChanges } from '../lib';
import { SupertestStoreService } from './supertest-store.service';

@Injectable()
export class SupertestDevSeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly store: SupertestStoreService
  ) {}

  async seed({ apiUrl, now }: DevSeedInput): Promise<DevSeedSummary> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { tier: SUPERTEST_DEV.tier, isActive: true, profiles: { some: { profileId: SUPERTEST_VIEW.topProfile } } },
      orderBy: { tankId: 'asc' },
      select: { tankId: true, name: true, type: true, profiles: { where: { profileId: SUPERTEST_VIEW.topProfile }, select: { data: true } } }
    });

    const picked = uniqueBy(vehicles, (vehicle) => vehicle.type)
      .concat(vehicles)
      .flatMap((vehicle) => {
        const stats = readVehicleStats(vehicle.profiles[0]?.data);

        return stats ? [{ tankId: vehicle.tankId, name: vehicle.name, stats }] : [];
      });

    const chosen = uniqueBy(picked, (vehicle) => vehicle.tankId).slice(0, SUPERTEST_DEV.tanksPerAnnouncement * SUPERTEST_DEV.announcements);
    let changes = 0;

    for (let index = 0; index < SUPERTEST_DEV.announcements; index += 1) {
      const group = chosen.slice(index * SUPERTEST_DEV.tanksPerAnnouncement, (index + 1) * SUPERTEST_DEV.tanksPerAnnouncement);
      const tanks: ParsedTank[] = group.map((vehicle, position) => ({
        tankId: vehicle.tankId,
        name: vehicle.name,
        isNewVehicle: false,
        changes: devChanges({ stats: vehicle.stats, variant: index * SUPERTEST_DEV.tanksPerAnnouncement + position })
      }));

      const withPrototype =
        index === SUPERTEST_DEV.announcements - 1
          ? [...tanks, { tankId: null, name: SUPERTEST_DEV.newVehicleName, isNewVehicle: true, changes: devNewVehicleChanges() }]
          : tanks;

      changes += await this.store.store({
        announcement: {
          url: new URL(`${SUPERTEST_DEV.path}/${index + 1}`, apiUrl).href,
          title: `[dev] Супертест: изменения баланса №${index + 1}`,
          summary: 'Сгенерировано dev:seed по текущим характеристикам машин — не официальный анонс Lesta.',
          image: null,
          source: SUPERTEST_SOURCES.dev,
          publishedAt: subDays(now, index * SUPERTEST_DEV.daysApart)
        },
        tanks: withPrototype,
        now
      });
    }

    return { announcements: SUPERTEST_DEV.announcements, tanks: chosen.length, changes };
  }
}
