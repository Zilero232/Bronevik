import RedisMock from 'ioredis-mock';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Battle, MoeProgress } from '../../../../generated';
import type { PrismaService, WebhookEmitter } from '../../../core';
import type { ExpectedValuesService } from '../../reference';
import type { AuthenticatedDevice } from '../mod.types';

import { Prisma } from '../../../../generated';
import { ingestBatchSchema } from '../lib';
import { EventLedgerService, ModIngestService } from '../services';

const example = ingestBatchSchema.parse(
  JSON.parse(readFileSync(new URL('../../../../../mod/contract/examples/ingest.example.json', import.meta.url), 'utf8'))
);

const battleEvents = example.events.filter((event) => event.type === 'battle_result');

const device: AuthenticatedDevice = {
  id: example.device_id,
  userId: 'user',
  accountId: BigInt(example.account_id),
  name: null,
  secretHash: 'hash',
  modVersion: null,
  gameVersion: null,
  lastSeenAt: null,
  revokedAt: null,
  createdAt: new Date()
};

const duplicate = () => new Prisma.PrismaClientKnownRequestError('duplicate', { code: 'P2002', clientVersion: 'test' });

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const expected = mock<ExpectedValuesService>();
  const webhooks = mock<WebhookEmitter>();

  prisma.$transaction.mockImplementation(async (run) => run(prisma));
  prisma.battle.create.mockResolvedValue(mock<Battle>());
  prisma.battle.findMany.mockResolvedValue(battleEvents.map((event) => mock<Battle>({ tankId: event.vehicle.tank_id, result: 'win' })));
  expected.all.mockResolvedValue(new Map());

  const service = new ModIngestService(prisma, new EventLedgerService(new RedisMock()), expected, webhooks);

  return { service, prisma, webhooks };
};

const incrementedSessions = (prisma: ReturnType<typeof createService>['prisma']) =>
  prisma.playSession.update.mock.calls.filter(([{ data }]) => 'battles' in data).length;

describe('ModIngestService', () => {
  it('accepts every event of a fresh batch', async () => {
    const { service, prisma } = createService();

    const result = await service.ingest({ device, batch: example });

    expect(result.accepted).toBe(example.events.length);
    expect(result.duplicates).toBe(0);
    expect(prisma.battle.create).toHaveBeenCalledTimes(battleEvents.length);
  });

  it('counts a replayed batch as duplicates and writes nothing twice', async () => {
    const { service, prisma } = createService();

    await service.ingest({ device, batch: example });

    const sessionIncrements = incrementedSessions(prisma);

    prisma.battle.create.mockRejectedValue(duplicate());

    const replay = await service.ingest({ device, batch: { ...example, batch_id: 'retry-with-new-batch-id' } });

    expect(replay.accepted).toBe(0);
    expect(replay.duplicates).toBe(example.events.length);
    expect(incrementedSessions(prisma)).toBe(sessionIncrements);
  });

  it('accepts only the new events of a partly seen batch', async () => {
    const { service } = createService();
    const [first, ...rest] = example.events;

    await service.ingest({ device, batch: { ...example, events: rest } });

    const result = await service.ingest({ device, batch: example });

    expect(first).toBeDefined();
    expect(result.accepted).toBe(1);
    expect(result.duplicates).toBe(rest.length);
  });

  it('reports the session the battles belong to', async () => {
    const { service } = createService();
    const [battle] = battleEvents;

    const result = await service.ingest({ device, batch: example });

    expect(battle?.type === 'battle_result' ? battle.session_id : null).toBe(result.session?.session_id);
    expect(result.session?.battles).toBe(battleEvents.length);
  });

  it('stores the MoE progress the battle reported', async () => {
    const { service, prisma } = createService();

    await service.ingest({ device, batch: example });

    expect(prisma.moeProgress.upsert).toHaveBeenCalled();
  });

  it('announces a mark the player did not have before', async () => {
    const { service, prisma, webhooks } = createService();
    const withMoe = battleEvents.filter((event) => event.type === 'battle_result' && event.moe);
    const [first] = withMoe;

    prisma.moeProgress.findUnique.mockResolvedValue(mock<MoeProgress>({ marks: -1 }));

    await service.ingest({ device, batch: { ...example, events: first ? [first] : [] } });

    expect(first).toBeDefined();
    expect(webhooks.emit).toHaveBeenCalledWith(expect.objectContaining({ event: 'mark.gained' }));
  });

  it('stays quiet when the marks did not change', async () => {
    const { service, prisma, webhooks } = createService();
    const [first] = battleEvents.filter((event) => event.type === 'battle_result' && event.moe);
    const marks = first?.type === 'battle_result' ? (first.moe?.marks_on_gun ?? 0) : 0;

    prisma.moeProgress.findUnique.mockResolvedValue(mock<MoeProgress>({ marks }));

    await service.ingest({ device, batch: { ...example, events: first ? [first] : [] } });

    expect(webhooks.emit).not.toHaveBeenCalled();
  });

  it('does not announce the first mark it ever sees for a tank', async () => {
    const { service, prisma, webhooks } = createService();
    const [first] = battleEvents.filter((event) => event.type === 'battle_result' && event.moe);

    prisma.moeProgress.findUnique.mockResolvedValue(null);

    await service.ingest({ device, batch: { ...example, events: first ? [first] : [] } });

    expect(webhooks.emit).not.toHaveBeenCalled();
  });
});
