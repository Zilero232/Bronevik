import type { BattleAnalysis, MyBattle, MyBattlesPage, TankReference } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import type { Battle } from '../../../../generated';
import type { BattleInput, BattlesInput } from '../analytics.types';
import type { ReferenceRow } from '../lib';

import { AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { VehicleCatalogService } from '../../reference';
import { BATTLE_REVIEW } from '../config';
import { readStoredShots, reviewBattle, shotRolls, toMyBattle, toTankReference } from '../lib';
import { OwnAccountService } from './own-account.service';

@Injectable()
export class BattleReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly accounts: OwnAccountService
  ) {}

  async list({ userId, account, tankId, limit, offset }: BattlesInput): Promise<MyBattlesPage> {
    const accountId = await this.accounts.resolve({ userId, account });
    const where = { accountId, ...(tankId ? { tankId } : {}) };

    const [rows, total] = await Promise.all([
      this.prisma.battle.findMany({ where, orderBy: { startedAt: 'desc' }, skip: offset, take: limit }),
      this.prisma.battle.count({ where })
    ]);

    return { items: await this.present(rows), total, limit, offset };
  }

  async detail(input: BattleInput): Promise<MyBattle> {
    const [battle] = await this.present([await this.own(input)]);

    if (!battle) {
      throw new AppNotFoundException('NOT_FOUND', `No battle ${input.id}`);
    }

    return battle;
  }

  async analysis(input: BattleInput): Promise<BattleAnalysis> {
    const row = await this.own(input);
    const [[battle], reference, catalog] = await Promise.all([this.present([row]), this.reference(row), this.catalog.all()]);

    if (!battle) {
      throw new AppNotFoundException('NOT_FOUND', `No battle ${input.id}`);
    }

    return {
      battle,
      reference,
      rolls: shotRolls(readStoredShots(row.shots)),
      ...reviewBattle({ battle: row, reference, vehicleType: catalog.get(row.tankId)?.summary.type ?? null })
    };
  }

  private async own({ userId, id }: BattleInput): Promise<Battle> {
    const accountIds = await this.accounts.accountIds(userId);
    const battle = await this.prisma.battle.findFirst({ where: { id, accountId: { in: accountIds } } });

    if (!battle) {
      throw new AppNotFoundException('NOT_FOUND', `No battle ${id}`);
    }

    return battle;
  }

  private async reference(battle: Battle): Promise<TankReference | null> {
    const [row] = await this.prisma.$queryRaw<ReferenceRow[]>`
      SELECT count(*)::float8 AS battles,
             count(*) FILTER (WHERE result = 'win'::battle_result)::float8 AS wins,
             coalesce(sum(damage_dealt), 0)::float8 AS damage,
             coalesce(sum(greatest(damage_assisted_radio, damage_assisted_track, damage_assisted_stun)), 0)::float8 AS assisted,
             coalesce(sum(spotted), 0)::float8 AS spotted,
             coalesce(sum(frags), 0)::float8 AS frags,
             coalesce(sum(damage_blocked), 0)::float8 AS blocked
      FROM (
        SELECT * FROM battle
        WHERE account_id = ${battle.accountId} AND tank_id = ${battle.tankId} AND id <> ${battle.id} AND battle_type = ${battle.battleType}
        ORDER BY started_at DESC
        LIMIT ${BATTLE_REVIEW.referenceBattles}
      ) recent
    `;

    return row && row.battles >= BATTLE_REVIEW.minReferenceBattles ? toTankReference(row) : null;
  }

  private async present(rows: Battle[]): Promise<MyBattle[]> {
    const [catalog, arenas] = await Promise.all([
      this.catalog.all(),
      this.prisma.arena.findMany({ where: { arenaId: { in: [...new Set(rows.map((row) => row.arenaId))] } }, select: { arenaId: true, name: true } })
    ]);

    const nameOf = new Map(arenas.map((arena) => [arena.arenaId, arena.name]));

    return rows.map((battle) =>
      toMyBattle({ battle, vehicle: catalog.get(battle.tankId)?.summary ?? null, mapName: nameOf.get(battle.arenaId) ?? null })
    );
  }
}
