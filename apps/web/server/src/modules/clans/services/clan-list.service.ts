import type { ClanListPage, ClanListQuery } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import type { ClanListRow } from '../queries';

import { toNumber } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { toClanListItem } from '../mappers';
import { clanListSql } from '../queries';

@Injectable()
export class ClanListService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ClanListQuery): Promise<ClanListPage> {
    const rows = await this.prisma.$queryRaw<ClanListRow[]>(clanListSql(query));

    return {
      items: rows.map(toClanListItem),
      total: rows[0] ? toNumber(rows[0].total) : 0,
      limit: query.limit,
      offset: query.offset
    };
  }
}
