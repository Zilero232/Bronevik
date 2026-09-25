import type { TankReference } from '@bronevik/ratings';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../core';
import { BRONYA_REFERENCE, parseBronyaReference } from '../../collector';
import { CATALOG } from '../config';

@Injectable()
export class BronyaReferencesService {
  private table: Map<number, TankReference> = new Map();
  private loadedAt = 0;
  private pending: Promise<Map<number, TankReference>> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<Map<number, TankReference>> {
    if (Date.now() - this.loadedAt < CATALOG.ttlMs) {
      return this.table;
    }

    this.pending ??= this.load().finally(() => {
      this.pending = null;
    });

    return this.pending;
  }

  private async load(): Promise<Map<number, TankReference>> {
    const latest = await this.prisma.tankPercentile.aggregate({ where: { distribution: BRONYA_REFERENCE.distribution }, _max: { date: true } });
    const date = latest._max.date;
    const rows = date ? await this.prisma.tankPercentile.findMany({ where: { distribution: BRONYA_REFERENCE.distribution, date } }) : [];

    this.table = new Map(
      rows.flatMap((row) => {
        const reference = parseBronyaReference({ tankId: row.tankId, value: row.percentiles });

        return reference ? [[row.tankId, reference] as const] : [];
      })
    );

    this.loadedAt = Date.now();

    return this.table;
  }
}
