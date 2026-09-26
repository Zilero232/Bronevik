import type { INestApplication } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { getQueueToken } from '@nestjs/bullmq';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Replay } from '../../../../generated';

import { LocalDiskStorage, ObjectStorage, PrismaService } from '../../../core';
import { FIXTURE, readFixture } from '../../../lib/replay/_tests/fixtures';
import { ModDeviceService } from '../../mod';
import { REPLAYS_QUEUE } from '../config';
import { ReplaysController } from '../replays.controller';
import { HeatmapService, ReplayOwnerService, ReplayParseService, ReplayQueryService, ReplayUploadService } from '../services';

const prisma = mockDeep<PrismaService>();
const queue = mock<Queue>();
const replayId = '0b0f9a6e-9a36-4f59-8a61-1d1a4b6a0c11';
const replayRow = (overrides: Partial<Replay>): Replay => ({
  id: replayId,
  uploaderUserId: 'user-1',
  deviceId: null,
  storageKey: 'key',
  timelineKey: null,
  fileName: 'battle.wotreplay',
  fileSize: 1,
  sha256: 'sha',
  status: 'uploaded',
  parseError: null,
  visibility: 'public',
  gameVersion: null,
  arenaUniqueId: null,
  arenaId: null,
  battleType: null,
  gameplayMode: null,
  mapName: null,
  vehicleType: null,
  battleId: null,
  accountId: null,
  tankId: null,
  result: null,
  damageDealt: null,
  damageAssisted: null,
  frags: null,
  xp: null,
  medals: [],
  summary: null,
  playerAccountIds: [],
  hasTracks: false,
  heatmapAppliedAt: null,
  isFeatured: false,
  views: 0,
  playedAt: null,
  parsedAt: null,
  createdAt: new Date(),
  ...overrides
});

let app: INestApplication;
let root: string;
let storage: LocalDiskStorage;

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), 'bronevik-replays-'));
  storage = new LocalDiskStorage(root);

  const moduleRef = await Test.createTestingModule({
    controllers: [ReplaysController],
    providers: [
      ReplayUploadService,
      { provide: PrismaService, useValue: prisma },
      { provide: ObjectStorage, useValue: storage },
      { provide: ModDeviceService, useValue: mock<ModDeviceService>() },
      { provide: getQueueToken(REPLAYS_QUEUE.name), useValue: queue },
      { provide: ReplayQueryService, useValue: mock<ReplayQueryService>() },
      { provide: ReplayOwnerService, useValue: mock<ReplayOwnerService>() },
      { provide: HeatmapService, useValue: mock<HeatmapService>() },
      { provide: APP_PIPE, useClass: ZodValidationPipe },
      { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor }
    ]
  }).compile();

  app = moduleRef.createNestApplication();

  app.use((req: { session?: unknown }, _res: unknown, next: () => void) => {
    req.session = { user: { id: 'user-1' } };
    next();
  });

  await app.init();
});

afterAll(async () => {
  await app.close();
  await rm(root, { recursive: true, force: true });
});

describe('POST /replays', () => {
  it('stores the file, records it and queues the parse job, which fills the summary', async () => {
    prisma.replay.findUnique.mockResolvedValueOnce(null);
    prisma.replay.create.mockResolvedValue(replayRow({ id: replayId, status: 'uploaded' }));

    const response = await request(app.getHttpServer())
      .post('/replays')
      .attach('file', Buffer.from(readFixture(FIXTURE.wgFull)), 'battle.wotreplay');

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: replayId, status: 'uploaded' });

    const created = prisma.replay.create.mock.calls[0]?.[0].data;

    expect(created?.uploaderUserId).toBe('user-1');
    expect(queue.add).toHaveBeenCalledWith(REPLAYS_QUEUE.jobs.parse, { replayId }, expect.objectContaining({ jobId: `parse-${replayId}` }));

    const stored = await storage.get(String(created?.storageKey));

    expect(stored.byteLength).toBe(readFixture(FIXTURE.wgFull).byteLength);

    prisma.replay.findUnique.mockResolvedValueOnce(replayRow({ id: replayId, storageKey: String(created?.storageKey) }));

    const heatmaps = mock<HeatmapService>();
    const outcome = await new ReplayParseService(prisma, storage, heatmaps).parse({ replayId, isFinalAttempt: true });
    const update = prisma.replay.update.mock.calls.at(-1)?.[0].data;

    expect(outcome).toEqual({ status: 'parsed', hasTracks: true });
    expect(update).toMatchObject({ status: 'parsed', arenaId: '14_siegfried_line', gameplayMode: 'ctf', tankId: 11265, result: 'win' });
    expect(heatmaps.apply).toHaveBeenCalledWith(expect.objectContaining({ replayId, arenaId: '14_siegfried_line', mode: 'ctf' }));
  });

  it('rejects a file that is not a replay', async () => {
    const response = await request(app.getHttpServer()).post('/replays').attach('file', Buffer.from('not a replay'), 'battle.mtreplay');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('REPLAY_INVALID');
  });

  it('rejects another extension before reading it', async () => {
    const response = await request(app.getHttpServer())
      .post('/replays')
      .attach('file', Buffer.from(readFixture(FIXTURE.wgFull)), 'battle.zip');

    expect(response.status).toBe(400);
  });

  it('answers 409 for a replay uploaded before', async () => {
    prisma.replay.findUnique.mockResolvedValueOnce(replayRow({ id: replayId }));

    const response = await request(app.getHttpServer())
      .post('/replays')
      .attach('file', Buffer.from(readFixture(FIXTURE.wgFull)), 'battle.wotreplay');

    expect(response.status).toBe(409);
  });
});
