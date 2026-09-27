import { utc } from '@date-fns/utc';
import { Injectable } from '@nestjs/common';
import { startOfDay } from 'date-fns';

import { FEATURES, SOURCES } from '../../../../config';
import { HttpClientService, PrismaService } from '../../../../core';
import { moeThresholdLevels } from '../../../reference';
import { parsePoliroidMoe } from '../lib/community-data';

@Injectable()
export class MoeThresholdsSyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpClientService
  ) {}

  async sync() {
    if (!FEATURES.moePoliroid) {
      return { skipped: true };
    }

    const rows = parsePoliroidMoe(await this.http.getJson({ url: SOURCES.poliroidMoe }));
    const date = startOfDay(new Date(), { in: utc });

    await this.prisma.$transaction([
      this.prisma.tankThreshold.deleteMany({ where: { kind: 'moe', source: 'poliroid', date } }),
      this.prisma.tankThreshold.createMany({
        data: rows.map(({ tankId, ...levels }) => ({
          kind: 'moe' as const,
          tankId,
          date,
          source: 'poliroid' as const,
          ...moeThresholdLevels({ ...levels, p100: null })
        }))
      })
    ]);

    return { vehicles: rows.length };
  }
}
