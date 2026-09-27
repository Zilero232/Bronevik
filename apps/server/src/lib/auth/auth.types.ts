import type { LoggerService } from '@nestjs/common';

import type { PrismaClient } from '../../../generated';
import type { Env } from '../../config/env';
import type { LestaClient } from '../lesta';
import type { createAuth } from './auth';
import type { LestaAccountStore } from './lesta-id';
import type { TelegramAccountStore } from './telegram-login';

export type PlaceholderEmailInput = {
  provider: string;
  id: bigint | number | string;
};

export type AccountPurgeStore = {
  purgeAccount: (input: { userId: string }) => Promise<void>;
};

export type CreateAuthInput = {
  env: Env;
  prisma: PrismaClient;
  lesta: LestaClient;
  lestaStore: LestaAccountStore;
  telegramStore: TelegramAccountStore;
  accountPurge: AccountPurgeStore;
  logger: Pick<LoggerService, 'log'>;
};

export type OtmetkiAuth = ReturnType<typeof createAuth>;
