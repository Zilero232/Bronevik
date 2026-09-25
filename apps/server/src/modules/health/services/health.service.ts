import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { z } from 'zod';

import type { Health } from '../health.types';

import { PrismaService, REDIS } from '../../../core';
import { COLLECTOR_STATE_KEY } from '../../collector';
import { HEALTH } from '../config';
import { healthSchema } from '../dto';

const heartbeatSchema = z.object({ collectedAt: z.iso.datetime() });
const circuitSchema = z.object({ state: healthSchema.shape.lestaCircuit });

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis
  ) {}

  async check(): Promise<Health> {
    const [database, redis, worker, lestaCircuit] = await Promise.all([
      this.prisma.$queryRaw`SELECT 1`.then(
        () => 'ok' as const,
        () => 'down' as const
      ),
      this.redis.ping().then(
        () => 'ok' as const,
        () => 'down' as const
      ),
      this.worker(),
      this.lestaCircuit()
    ]);

    return { status: database === 'ok' && redis === 'ok' ? 'ok' : 'degraded', database, redis, worker, lestaCircuit };
  }

  private async worker(): Promise<Health['worker']> {
    const heartbeat = heartbeatSchema.safeParse(await this.state(COLLECTOR_STATE_KEY.queues));

    if (!heartbeat.success) {
      return 'unknown';
    }

    return Date.now() - new Date(heartbeat.data.collectedAt).getTime() < HEALTH.workerStaleMs ? 'ok' : 'stale';
  }

  private async lestaCircuit(): Promise<Health['lestaCircuit']> {
    const circuit = circuitSchema.safeParse(await this.state(COLLECTOR_STATE_KEY.circuitBreaker));

    return circuit.success ? circuit.data.state : 'unknown';
  }

  private async state(key: string): Promise<unknown> {
    const row = await this.prisma.collectorState.findUnique({ where: { key }, select: { value: true } }).catch(() => null);

    return row?.value;
  }
}
