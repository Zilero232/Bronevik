import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import type { PurgeTableInput, RetentionResult } from '../purge.types';

import { PrismaService } from '../../../../core';
import { RETENTION } from '../config';

@Injectable()
export class RetentionService {
  constructor(private readonly prisma: PrismaService) {}

  async purgeExpired(now = new Date()): Promise<RetentionResult> {
    const result: RetentionResult = {};

    for (const rule of RETENTION.rules) {
      result[rule.table] = await this.purgeTable({ rule, cutoff: subDays(now, rule.days) });
    }

    return result;
  }

  private async purgeTable({ rule, cutoff }: PurgeTableInput): Promise<number> {
    const filter = `${rule.column} < $1${rule.where ? ` AND ${rule.where}` : ''}`;
    const statement = `DELETE FROM ${rule.table} WHERE ctid IN (SELECT ctid FROM ${rule.table} WHERE ${filter} LIMIT ${RETENTION.deleteBatch})`;
    let deleted = 0;

    for (;;) {
      const count = await this.prisma.$executeRawUnsafe(statement, cutoff);

      deleted += count;

      if (count < RETENTION.deleteBatch) {
        return deleted;
      }
    }
  }
}
