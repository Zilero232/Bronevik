import type { OnApplicationShutdown } from '@nestjs/common';

import { Global, Module } from '@nestjs/common';

import { AppConfigService } from '../../config';
import { createPrismaClient } from './prisma.factory';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) =>
        createPrismaClient({
          url: config.get('DATABASE_URL'),
          log: config.get('NODE_ENV') === 'development' ? ['error', 'warn'] : ['error']
        })
    }
  ],
  exports: [PrismaService]
})
export class PrismaModule implements OnApplicationShutdown {
  constructor(private readonly prisma: PrismaService) {}

  async onApplicationShutdown() {
    await this.prisma.$disconnect();
  }
}
