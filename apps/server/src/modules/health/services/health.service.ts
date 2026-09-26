import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';

import type { Health } from '../health.types';

import { PrismaService } from '../../../core';
import { HEALTH } from '../config';
import { healthSchema } from '../dto';
import { CollectorStateIndicator, RedisIndicator } from '../indicators';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly redis: RedisIndicator,
    private readonly collector: CollectorStateIndicator
  ) {}

  async check(): Promise<Health> {
    return this.health
      .check([
        () => this.prismaIndicator.pingCheck(HEALTH.key.database, this.prisma),
        () => this.redis.ping(),
        () => this.collector.worker(),
        () => this.collector.lestaCircuit()
      ])
      .then(
        (result) => healthSchema.parse(result),
        (error: unknown) => {
          if (error instanceof ServiceUnavailableException) {
            return healthSchema.parse(error.getResponse());
          }

          throw error;
        }
      );
  }
}
