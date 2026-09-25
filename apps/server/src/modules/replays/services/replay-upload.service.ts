import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import type { UploadedReplay, UploadFromModInput, UploadReplayInput } from '../replays.types';

import { AppBadRequestException, AppConflictException } from '../../../common/exceptions';
import { isUniqueViolation, PrismaService } from '../../../core';
import { parseReplay } from '../../../lib/replay';
import { ModDeviceService } from '../../mod';
import { REPLAY_UPLOAD, REPLAYS_QUEUE } from '../config';
import { replayExtension, replayStorageKey, sha256Hex } from '../lib';
import { ReplayStorage } from '../storage';

@Injectable()
export class ReplayUploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: ReplayStorage,
    private readonly devices: ModDeviceService,
    @InjectQueue(REPLAYS_QUEUE.name) private readonly queue: Queue
  ) {}

  async upload({ file, uploaderUserId, deviceId, visibility }: UploadReplayInput): Promise<UploadedReplay> {
    if (!file || file.size === 0) {
      throw new AppBadRequestException('REPLAY_INVALID', `Attach the replay as the "${REPLAY_UPLOAD.field}" field`);
    }

    const extension = replayExtension(file.originalname);

    if (!extension) {
      throw new AppBadRequestException('REPLAY_INVALID', `Only ${REPLAY_UPLOAD.extensions.join(', ')} files are accepted`);
    }

    if (file.size > REPLAY_UPLOAD.maxBytes) {
      throw new AppBadRequestException('REPLAY_INVALID', 'The replay is too large');
    }

    const bytes = new Uint8Array(file.buffer);

    try {
      parseReplay(bytes);
    } catch (error) {
      throw new AppBadRequestException('REPLAY_INVALID', `Not a readable replay: ${error instanceof Error ? error.message : String(error)}`);
    }

    const sha256 = sha256Hex(bytes);
    const existing = await this.prisma.replay.findUnique({ where: { sha256 }, select: { id: true } });

    if (existing) {
      throw new AppConflictException('REPLAY_DUPLICATE', `This replay is already uploaded as ${existing.id}`);
    }

    const storageKey = replayStorageKey({ sha256, extension });

    await this.storage.put({ key: storageKey, body: bytes, contentType: REPLAY_UPLOAD.contentType });

    const replay = await this.prisma.replay
      .create({
        data: { storageKey, sha256, fileName: file.originalname.slice(0, 255), fileSize: file.size, uploaderUserId, deviceId, visibility },
        select: { id: true, status: true }
      })
      .catch((error: unknown) => {
        if (isUniqueViolation(error)) {
          throw new AppConflictException('REPLAY_DUPLICATE', 'This replay is already uploaded');
        }

        throw error;
      });

    await this.queue.add(
      REPLAYS_QUEUE.jobs.parse,
      { replayId: replay.id },
      { jobId: `parse-${replay.id}`, attempts: REPLAYS_QUEUE.parseAttempts, backoff: { type: 'exponential', delay: REPLAYS_QUEUE.parseBackoffMs } }
    );

    return replay;
  }

  async uploadFromMod({ file, deviceId, signature }: UploadFromModInput): Promise<UploadedReplay> {
    const device = await this.devices.authenticate({ deviceId, signature, rawBody: file?.buffer });

    return this.upload({ file, uploaderUserId: device.userId, deviceId: device.id, visibility: 'public' });
  }
}
