import type { ExpectedValuesTable } from '@bronevik/ratings';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../core';
import { CATALOG } from '../config';

@Injectable()
export class ExpectedValuesService {
  private table: ExpectedValuesTable = new Map();
  private loadedAt = 0;
  private pending: Promise<ExpectedValuesTable> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<ExpectedValuesTable> {
    if (Date.now() - this.loadedAt < CATALOG.ttlMs && this.table.size > 0) {
      return this.table;
    }

    this.pending ??= this.load().finally(() => {
      this.pending = null;
    });

    return this.pending;
  }

  private async load(): Promise<ExpectedValuesTable> {
    const rows = await this.prisma.wn8ExpectedValue.findMany({
      distinct: ['tankId'],
      orderBy: [{ tankId: 'asc' }, { date: 'desc' }]
    });

    this.table = new Map(
      rows.map((row) => [
        row.tankId,
        {
          tankId: row.tankId,
          expDamage: row.expDamage,
          expSpot: row.expSpotted,
          expFrag: row.expFrags,
          expDef: row.expDefense,
          expWinRate: row.expWinRate
        }
      ])
    );

    this.loadedAt = Date.now();

    return this.table;
  }
}
