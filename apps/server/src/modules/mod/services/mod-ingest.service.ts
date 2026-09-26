import { accountWn8 } from '@bronevik/ratings';
import { Inject, Injectable } from '@nestjs/common';
import { fromUnixTime } from 'date-fns';
import { groupBy, sortBy, sumBy } from 'remeda';

import type { WebhookEmitter } from '../../../core';
import type { IngestResponse } from '../lib';
import type { BattleEventInput, IngestInput, LedgeredEventInput, MarkGainedInput, SessionRef, SessionSummary } from '../mod.types';

import { isUniqueViolation, PrismaService, WEBHOOK_EMITTER } from '../../../core';
import { ExpectedValuesService } from '../../reference';
import { countsForSession, moePercent, sessionIncrement, sessionUuid, toBattleData } from '../lib';
import { EventLedgerService } from './event-ledger.service';

@Injectable()
export class ModIngestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: EventLedgerService,
    private readonly expected: ExpectedValuesService,
    @Inject(WEBHOOK_EMITTER) private readonly webhooks: WebhookEmitter
  ) {}

  async ingest({ device, batch }: IngestInput): Promise<IngestResponse> {
    let accepted = 0;
    let duplicates = 0;
    let lastSession: SessionRef | null = null;

    for (const event of sortBy(batch.events, (candidate) => candidate.occurred_at)) {
      const fresh = event.type === 'battle_result' ? await this.battle({ device, event }) : await this.ledgered({ device, event });

      if (fresh) {
        accepted += 1;
      } else {
        duplicates += 1;
      }

      if (event.type === 'battle_result' && event.session_id && countsForSession(event)) {
        lastSession = { id: sessionUuid({ accountId: device.accountId, sessionId: event.session_id }), modId: event.session_id };
      }
    }

    await this.prisma.modDevice.update({
      where: { id: device.id },
      data: { lastSeenAt: new Date(), modVersion: batch.mod_version, gameVersion: batch.client_version }
    });

    const session = lastSession ? await this.summarize(lastSession) : null;

    return { accepted, duplicates, ...(session ? { session } : {}) };
  }

  private async battle({ device, event }: BattleEventInput): Promise<boolean> {
    const { accountId } = device;
    const tankId = event.vehicle.tank_id;
    const sessionId = event.session_id && countsForSession(event) ? sessionUuid({ accountId, sessionId: event.session_id }) : null;
    const startedAt = fromUnixTime(event.arena_created_at);
    let previousMarks: number | null = null;

    try {
      await this.prisma.$transaction(async (tx) => {
        const previous = event.moe ? await tx.moeProgress.findUnique({ where: { accountId_tankId: { accountId, tankId } } }) : null;

        previousMarks = previous?.marks ?? null;

        if (sessionId) {
          await tx.playSession.upsert({
            where: { id: sessionId },
            create: { id: sessionId, accountId, source: 'mod', kind: 'live', status: 'open', startedAt, lastActivityAt: new Date(), credits: 0 },
            update: {}
          });
        }

        await tx.battle.create({
          data: toBattleData({ event, accountId, deviceId: device.id, sessionId, previousMoePercent: previous?.percent ?? null })
        });

        if (sessionId) {
          const increment = sessionIncrement(event);

          await tx.playSession.update({
            where: { id: sessionId },
            data: {
              battles: { increment: increment.battles },
              wins: { increment: increment.wins },
              losses: { increment: increment.losses },
              draws: { increment: increment.draws },
              damageDealt: { increment: increment.damageDealt },
              damageAssisted: { increment: increment.damageAssisted },
              damageBlocked: { increment: increment.damageBlocked },
              frags: { increment: increment.frags },
              spotted: { increment: increment.spotted },
              xp: { increment: increment.xp },
              survived: { increment: increment.survived },
              credits: { increment: increment.credits },
              lastActivityAt: new Date(),
              status: 'open'
            }
          });
        }

        if (event.moe) {
          const values = { marks: event.moe.marks_on_gun, percent: moePercent(event.moe.damage_rating), movingDamage: event.moe.moving_avg_damage };

          await tx.moeProgress.upsert({
            where: { accountId_tankId: { accountId, tankId } },
            create: { accountId, tankId, ...values },
            update: values
          });
        }
      });

      if (event.moe) {
        await this.markGained({
          accountId,
          tankId,
          marks: event.moe.marks_on_gun,
          previous: previousMarks,
          percent: moePercent(event.moe.damage_rating)
        });
      }

      return true;
    } catch (error) {
      if (isUniqueViolation(error)) {
        return false;
      }

      throw error;
    }
  }

  private async ledgered({ device, event }: LedgeredEventInput): Promise<boolean> {
    const key = { accountId: device.accountId, eventId: event.event_id };

    if (!(await this.ledger.claim(key))) {
      return false;
    }

    try {
      if (event.type === 'moe_snapshot') {
        const values = { marks: event.marks_on_gun, percent: moePercent(event.damage_rating), movingDamage: event.moving_avg_damage };
        const where = { accountId_tankId: { accountId: device.accountId, tankId: event.tank_id } };
        const previous = await this.prisma.moeProgress.findUnique({ where, select: { marks: true } });

        await this.prisma.moeProgress.upsert({
          where,
          create: { accountId: device.accountId, tankId: event.tank_id, ...values },
          update: values
        });

        await this.markGained({
          accountId: device.accountId,
          tankId: event.tank_id,
          marks: values.marks,
          previous: previous?.marks ?? null,
          percent: values.percent
        });
      }

      return true;
    } catch (error) {
      await this.ledger.release(key);

      throw error;
    }
  }

  private async markGained({ accountId, tankId, marks, previous, percent }: MarkGainedInput): Promise<void> {
    if (previous === null || marks <= previous) {
      return;
    }

    const player = await this.prisma.player.findUnique({ where: { accountId }, select: { clanId: true, nickname: true } });

    await this.webhooks.emit({
      event: 'mark.gained',
      subject: { accountIds: [Number(accountId)], clanIds: player?.clanId ? [Number(player.clanId)] : [] },
      data: { accountId: Number(accountId), nickname: player?.nickname ?? null, tankId, marks, previousMarks: previous, percent, source: 'mod' }
    });
  }

  private async summarize({ id, modId }: SessionRef): Promise<SessionSummary | null> {
    const battles = await this.prisma.battle.findMany({
      where: { sessionId: id },
      select: { tankId: true, result: true, damageDealt: true, frags: true, spotted: true }
    });

    if (battles.length === 0) {
      return null;
    }

    const expected = await this.expected.all();

    const tanks = Object.values(groupBy(battles, (battle) => String(battle.tankId))).map((rows) => ({
      tankId: rows[0]?.tankId ?? 0,
      battles: rows.length,
      wins: rows.filter((row) => row.result === 'win').length,
      damageDealt: sumBy(rows, (row) => row.damageDealt),
      frags: sumBy(rows, (row) => row.frags),
      spotted: sumBy(rows, (row) => row.spotted),
      capturePoints: 0,
      droppedCapturePoints: 0
    }));

    const { wn8 } = accountWn8({ tanks, expected });

    await this.prisma.playSession.update({ where: { id }, data: { wn8 } });

    return { session_id: modId, wn8, battles: battles.length };
  }
}
