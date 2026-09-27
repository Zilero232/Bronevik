import type { HealthIndicatorResult } from '@nestjs/terminus';

import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { differenceInMilliseconds } from 'date-fns';

import { PrismaService } from '../../../core';
import { COLLECTOR_STATE_KEY } from '../../collector';
import { HEALTH } from '../config';
import { circuitSchema, heartbeatSchema } from '../dto';

@Injectable()
export class CollectorStateIndicator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly indicators: HealthIndicatorService
  ) {}

  async worker(): Promise<HealthIndicatorResult> {
    const indicator = this.indicators.check(HEALTH.key.worker);
    const heartbeat = heartbeatSchema.safeParse(await this.state(COLLECTOR_STATE_KEY.queues));

    if (!heartbeat.success) {
      return indicator.degraded({ state: 'unknown' });
    }

    const fresh = differenceInMilliseconds(new Date(), new Date(heartbeat.data.collectedAt)) < HEALTH.workerStaleMs;

    return fresh
      ? indicator.up({ state: 'ok', collectedAt: heartbeat.data.collectedAt })
      : indicator.degraded({ state: 'stale', collectedAt: heartbeat.data.collectedAt });
  }

  async lestaCircuit(): Promise<HealthIndicatorResult> {
    const indicator = this.indicators.check(HEALTH.key.lestaCircuit);
    const circuit = circuitSchema.safeParse(await this.state(COLLECTOR_STATE_KEY.circuitBreaker));

    if (!circuit.success) {
      return indicator.degraded({ state: 'unknown' });
    }

    return circuit.data.state === 'closed' ? indicator.up({ state: circuit.data.state }) : indicator.degraded({ state: circuit.data.state });
  }

  private async state(key: string): Promise<unknown> {
    const row = await this.prisma.collectorState.findUnique({ where: { key }, select: { value: true } }).catch(() => null);

    return row?.value;
  }
}
