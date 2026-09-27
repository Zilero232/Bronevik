import { Logger, Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import type { LestaClient } from '../../lib/lesta';

import { validateEnv } from '../../config';
import { LESTA_CLIENT, PrismaService } from '../../core';
import { createAuth } from '../../lib/auth';
import { CommunityContentService, CommunityCoreModule } from '../community-core';
import { AuthStoresModule } from './auth-stores.module';
import { AUTH_MODULE } from './config';
import { LestaAccountsService, TelegramAccountsService } from './services';

@Module({
  imports: [
    AuthStoresModule,
    BetterAuthModule.forRootAsync({
      isGlobal: true,
      imports: [AuthStoresModule, CommunityCoreModule],
      inject: [PrismaService, LESTA_CLIENT, LestaAccountsService, TelegramAccountsService, CommunityContentService],
      useFactory: (
        prisma: PrismaService,
        lesta: LestaClient,
        lestaStore: LestaAccountsService,
        telegramStore: TelegramAccountsService,
        userContent: CommunityContentService
      ) => ({
        auth: createAuth({
          env: validateEnv(process.env),
          prisma,
          lesta,
          lestaStore,
          telegramStore,
          userContent,
          logger: new Logger(AUTH_MODULE.logContext)
        }),
        disableTrustedOriginsCors: true,
        bodyParser: { rawBody: true, json: { limit: AUTH_MODULE.jsonLimit } }
      })
    })
  ],
  exports: [AuthStoresModule]
})
export class AuthModule {}
