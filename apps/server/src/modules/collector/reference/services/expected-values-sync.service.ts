import { parseXvmExpectedValues } from '@bronevik/ratings';
import { Injectable } from '@nestjs/common';

import { SOURCES } from '../../../../config';
import { PrismaService } from '../../../../core';
import { http } from '../../../../lib/http';
import { REFERENCE } from '../config';
import { expectedValuesDate } from '../lib/community-data';

@Injectable()
export class ExpectedValuesSyncService {
  constructor(private readonly prisma: PrismaService) {}

  async sync() {
    const { header, table } = parseXvmExpectedValues(await http.get(SOURCES.wn8Expected).json());
    const date = expectedValuesDate({ header, now: new Date() });

    const rows = [...table.values()].map((values) => ({
      tankId: values.tankId,
      date,
      source: REFERENCE.wn8Source,
      expDamage: values.expDamage,
      expFrags: values.expFrag,
      expSpotted: values.expSpot,
      expDefense: values.expDef,
      expWinRate: values.expWinRate
    }));

    const { count } = await this.prisma.wn8ExpectedValue.createMany({ data: rows, skipDuplicates: true });

    return { date: date.toISOString().slice(0, 10), vehicles: rows.length, inserted: count };
  }
}
