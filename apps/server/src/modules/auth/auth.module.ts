import { Logger, Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import type { LestaClient } from '../../lib/lesta';

import { validateEnv } from '../../config';
import { LESTA_CLIENT, PrismaService } from '../../core';
import { createAuth } from '../../lib/auth';
import { AuthStoresModule } from './auth-stores.module';
import { AUTH_MODULE } from './config';
import { AccountPurgeService, LestaAccountsService, TelegramAccountsService } from './services';

@Module({
  imports: [
    AuthStoresModule,
    BetterAuthModule.forRootAsync({
      isGlobal: true,
      imports: [AuthStoresModule],
      inject: [PrismaService, LESTA_CLIENT, LestaAccountsService, TelegramAccountsService, AccountPurgeService],
      useFactory: (
        prisma: PrismaService,
        lesta: LestaClient,
        lestaStore: LestaAccountsService,
        telegramStore: TelegramAccountsService,
        accountPurge: AccountPurgeService
      ) => ({
        auth: createAuth({
          env: validateEnv(process.env),
          prisma,
          lesta,
          lestaStore,
          telegramStore,
          accountPurge,
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
