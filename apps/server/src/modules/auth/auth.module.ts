import { Logger, Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import type { LestaClient } from '../../lib/lesta';

import { validateEnv } from '../../config';
import { LESTA_CLIENT, PrismaService } from '../../core';
import { createAuth } from '../../lib/auth';
import { AuthStoresModule } from './auth-stores.module';
import { AUTH_BODY_PARSER, AUTH_LOG_CONTEXT } from './config';
import { LestaAccountsService, TelegramAccountsService } from './services';

@Module({
  imports: [
    AuthStoresModule,
    BetterAuthModule.forRootAsync({
      isGlobal: true,
      imports: [AuthStoresModule],
      inject: [PrismaService, LESTA_CLIENT, LestaAccountsService, TelegramAccountsService],
      useFactory: (prisma: PrismaService, lesta: LestaClient, lestaStore: LestaAccountsService, telegramStore: TelegramAccountsService) => ({
        auth: createAuth({
          env: validateEnv(process.env),
          prisma,
          lesta,
          lestaStore,
          telegramStore,
          logger: new Logger(AUTH_LOG_CONTEXT)
        }),
        disableTrustedOriginsCors: true,
        bodyParser: { rawBody: true, json: { limit: AUTH_BODY_PARSER.jsonLimit } }
      })
    })
  ],
  exports: [AuthStoresModule]
})
export class AuthModule {}
