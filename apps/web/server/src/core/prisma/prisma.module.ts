import type { DynamicModule, OnApplicationShutdown } from '@nestjs/common';

import { Global, Module } from '@nestjs/common';

import type { PrismaModuleOptions } from './prisma.types';

import { AppConfigService } from '../../config';
import { PRISMA_POOL } from './prisma.constants';
import { createPrismaClient } from './prisma.factory';
import { PrismaService } from './prisma.service';

@Global()
@Module({})
export class PrismaModule implements OnApplicationShutdown {
  constructor(private readonly prisma: PrismaService) {}

  static forRoot({ poolMax = PRISMA_POOL.max, statementTimeoutMs }: PrismaModuleOptions = {}): DynamicModule {
    return {
      module: PrismaModule,
      providers: [
        {
          provide: PrismaService,
          inject: [AppConfigService],
          useFactory: (config: AppConfigService) =>
            createPrismaClient({
              url: config.get('DATABASE_URL'),
              pool: { max: config.get('DATABASE_POOL_MAX') ?? poolMax, statement_timeout: statementTimeoutMs },
              log: config.get('NODE_ENV') === 'development' ? ['error', 'warn'] : ['error']
            })
        }
      ],
      exports: [PrismaService]
    };
  }

  async onApplicationShutdown() {
    await this.prisma.$disconnect();
  }
}
