import { utc } from '@date-fns/utc';
import { Injectable } from '@nestjs/common';
import { startOfDay } from 'date-fns';

import { FEATURES, SOURCES } from '../../../../config';
import { PrismaService } from '../../../../core';
import { http } from '../../../../lib/http';
import { moeThresholdLevels } from '../../../reference';
import { parsePoliroidMoe } from '../lib/community-data';

@Injectable()
export class MoeThresholdsSyncService {
  constructor(private readonly prisma: PrismaService) {}

  async sync() {
    if (!FEATURES.moePoliroid) {
      return { skipped: true };
    }

    const rows = parsePoliroidMoe(await http.get(SOURCES.poliroidMoe).json());
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
