import { Injectable, Logger } from '@nestjs/common';
import { ZodError } from 'zod';

import type { Replay } from '../../../../generated';
import type { ReplayTrack } from '../lib';
import type { ParseOutcome, ParseReplayInput, TracksOfInput } from '../replays.types';

import { errorMessage, toJsonValue } from '../../../common/lib';
import { ObjectStorage, PrismaService } from '../../../core';
import { parsePackets, parseReplay, ReplayFormatError } from '../../../lib/replay';
import { REPLAY_PARSE, REPLAY_UPLOAD } from '../config';
import { buildTracks, replayColumns, tracksStorageKey } from '../lib';
import { HeatmapService } from './heatmap.service';

@Injectable()
export class ReplayParseService {
  private readonly logger = new Logger(ReplayParseService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: ObjectStorage,
    private readonly heatmaps: HeatmapService
  ) {}

  async parse({ replayId, isFinalAttempt }: ParseReplayInput): Promise<ParseOutcome> {
    const replay = await this.prisma.replay.findUnique({ where: { id: replayId } });

    if (!replay) {
      return { status: 'missing', hasTracks: false };
    }

    await this.prisma.replay.update({ where: { id: replayId }, data: { status: 'parsing' } });

    try {
      return await this.run(replay);
    } catch (error) {
      await this.prisma.replay.update({
        where: { id: replayId },
        data: {
          status: isFinalAttempt ? 'failed' : 'uploaded',
          parseError: errorMessage(error).slice(0, REPLAY_PARSE.maxErrorLength)
        }
      });

      throw error;
    }
  }

  private async run(replay: Replay): Promise<ParseOutcome> {
    const replayId = replay.id;
    const bytes = await this.storage.get(replay.storageKey);
    let parsed: ReturnType<typeof parseReplay>;

    try {
      parsed = parseReplay(bytes);
    } catch (error) {
      if (error instanceof ReplayFormatError || error instanceof ZodError) {
        await this.prisma.replay.update({
          where: { id: replayId },
          data: { status: 'failed', parseError: error.message.slice(0, REPLAY_PARSE.maxErrorLength) }
        });

        return { status: 'failed', hasTracks: false };
      }

      throw error;
    }

    const columns = replayColumns(parsed.summary);
    const [vehicle, battle] = await Promise.all([
      columns.tankId === null ? null : this.prisma.vehicle.findUnique({ where: { tankId: columns.tankId }, select: { type: true } }),
      columns.accountId === null || columns.arenaUniqueId === null
        ? null
        : this.prisma.battle.findUnique({
            where: { accountId_arenaUniqueId: { accountId: columns.accountId, arenaUniqueId: columns.arenaUniqueId } },
            select: { id: true }
          })
    ]);

    const tracks = this.tracks({ bytes, summary: parsed.summary });
    const timelineKey = tracks.length > 0 ? tracksStorageKey(replay.storageKey) : null;

    if (timelineKey) {
      await this.storage.put({
        key: timelineKey,
        body: new TextEncoder().encode(JSON.stringify({ tracks })),
        contentType: REPLAY_UPLOAD.contentType
      });
    }

    await this.prisma.replay.update({
      where: { id: replayId },
      data: {
        ...columns,
        vehicleType: vehicle?.type ?? null,
        battleId: battle?.id ?? null,
        summary: toJsonValue({ ...parsed.summary, warnings: parsed.warnings }),
        status: 'parsed',
        parseError: null,
        parsedAt: new Date(),
        hasTracks: tracks.length > 0,
        timelineKey
      }
    });

    if (tracks.length > 0 && columns.arenaId && !replay.heatmapAppliedAt) {
      await this.heatmaps.apply({ replayId, arenaId: columns.arenaId, mode: columns.gameplayMode, tracks });
    }

    return { status: 'parsed', hasTracks: tracks.length > 0 };
  }

  private tracks({ bytes, summary }: TracksOfInput): ReplayTrack[] {
    try {
      const { packets } = parsePackets({ replay: bytes, kinds: ['position'] });

      return buildTracks({ packets, players: summary.players, stepSeconds: REPLAY_PARSE.trackStepSeconds });
    } catch (error) {
      this.logger.warn(`packet parse skipped: ${errorMessage(error)}`);

      return [];
    }
  }
}
