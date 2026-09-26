import type { TelegramLinkCode, TelegramStatus } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { addMinutes } from 'date-fns';
import { randomBytes } from 'node:crypto';

import type { ConsumeLinkCodeInput, TxUserInput } from '../telegram.types';

import { AppBadRequestException, AppConflictException } from '../../../common/exceptions';
import { randomCode } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { AUTH_PROVIDER, isPlaceholderEmail } from '../../../lib/auth';
import { LINK_CODE, SETTINGS_MENU, WEB_LOGIN } from '../config';
import { normaliseLinkCode, siteUrl } from '../lib';
import { TelegramIdentityService } from './telegram-identity.service';

@Injectable()
export class TelegramLinkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly identity: TelegramIdentityService
  ) {}

  async issueCode(userId: string): Promise<TelegramLinkCode> {
    const code = randomCode(LINK_CODE);
    const expiresAt = addMinutes(new Date(), LINK_CODE.ttlMinutes);
    const botUsername = this.config.get('TELEGRAM_BOT_USERNAME');

    await this.prisma.$transaction([
      this.prisma.telegramLinkCode.deleteMany({ where: { userId } }),
      this.prisma.telegramLinkCode.create({ data: { code, userId, expiresAt } })
    ]);

    return { code, expiresAt: expiresAt.toISOString(), deepLink: botUsername ? `https://t.me/${botUsername}?start=${code}` : null };
  }

  async consumeCode({ code, identity }: ConsumeLinkCodeInput): Promise<string> {
    const normalised = normaliseLinkCode(code);
    const { telegramId, username, languageCode } = identity;

    return this.prisma.$transaction(async (tx) => {
      const claimed = await tx.telegramLinkCode.updateMany({
        where: { code: normalised, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() }
      });

      if (claimed.count === 0) {
        throw new AppBadRequestException('VALIDATION_FAILED', 'The link code is unknown, already used or expired');
      }

      const { userId } = await tx.telegramLinkCode.findUniqueOrThrow({ where: { code: normalised }, select: { userId: true } });
      const taken = await tx.telegramAccount.findUnique({ where: { telegramId }, select: { userId: true } });

      if (taken && taken.userId !== userId) {
        if (!(await this.isDisposable({ tx, userId: taken.userId }))) {
          throw new AppConflictException('CONFLICT', 'This Telegram account is linked to another user');
        }

        await tx.user.delete({ where: { id: taken.userId } });
      }

      await tx.telegramAccount.deleteMany({ where: { userId, NOT: { telegramId } } });

      await tx.telegramAccount.upsert({
        where: { telegramId },
        create: { userId, telegramId, username, languageCode, chatId: telegramId, lastSeenAt: new Date() },
        update: { userId, username, languageCode, chatId: telegramId, lastSeenAt: new Date() }
      });

      await tx.account.deleteMany({ where: { userId, providerId: AUTH_PROVIDER.telegram, NOT: { accountId: String(telegramId) } } });

      await tx.account.upsert({
        where: { providerId_accountId: { providerId: AUTH_PROVIDER.telegram, accountId: String(telegramId) } },
        create: { userId, providerId: AUTH_PROVIDER.telegram, accountId: String(telegramId) },
        update: { userId }
      });

      await this.enableTelegramChannel({ tx, userId });

      return userId;
    });
  }

  async status(userId: string): Promise<TelegramStatus> {
    const account = await this.prisma.telegramAccount.findUnique({ where: { userId }, select: { username: true } });

    return {
      isLinked: account !== null,
      username: account?.username ?? null,
      botUsername: this.config.get('TELEGRAM_BOT_USERNAME') || null
    };
  }

  async unlink(userId: string): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { email: true, accounts: { where: { NOT: { providerId: AUTH_PROVIDER.telegram } }, select: { id: true } } }
    });

    if (user.accounts.length === 0 && isPlaceholderEmail(user.email)) {
      throw new AppConflictException('CONFLICT', 'Telegram is the only way into this account');
    }

    await this.prisma.$transaction([
      this.prisma.telegramAccount.deleteMany({ where: { userId } }),
      this.prisma.account.deleteMany({ where: { userId, providerId: AUTH_PROVIDER.telegram } })
    ]);
  }

  async issueWebLogin(userId: string): Promise<string> {
    const code = randomBytes(WEB_LOGIN.bytes).toString('base64url');
    const expiresAt = addMinutes(new Date(), WEB_LOGIN.ttlMinutes);

    await this.prisma.$transaction([
      this.prisma.telegramWebLogin.deleteMany({ where: { userId } }),
      this.prisma.telegramWebLogin.create({ data: { code, userId, expiresAt } })
    ]);

    const url = new URL(siteUrl({ webUrl: this.config.get('WEB_URL'), path: WEB_LOGIN.path }));

    url.searchParams.set('code', code);

    return url.href;
  }

  async redeemWebLogin(code: string): Promise<string> {
    const claimed = await this.prisma.telegramWebLogin.updateMany({
      where: { code, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() }
    });

    if (claimed.count === 0) {
      throw new AppBadRequestException('UNAUTHORIZED', 'The sign-in link is unknown, already used or expired');
    }

    const { userId } = await this.prisma.telegramWebLogin.findUniqueOrThrow({ where: { code }, select: { userId: true } });

    return this.identity.issueSessionToken(userId);
  }

  private async isDisposable({ tx, userId }: TxUserInput): Promise<boolean> {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { email: true, _count: { select: { lestaAccounts: true, subscriptions: true, payments: true } } }
    });

    if (!user || !isPlaceholderEmail(user.email)) {
      return false;
    }

    const { lestaAccounts, subscriptions, payments } = user._count;

    return lestaAccounts + subscriptions + payments === 0;
  }

  private async enableTelegramChannel({ tx, userId }: TxUserInput): Promise<void> {
    const settings = await tx.notificationSettings.findUnique({ where: { userId }, select: { channels: true } });

    if (settings?.channels.includes('telegram')) {
      return;
    }

    await tx.notificationSettings.upsert({
      where: { userId },
      create: { userId, channels: [...SETTINGS_MENU.defaultChannels, 'telegram'], events: [...SETTINGS_MENU.defaultEvents] },
      update: { channels: { push: 'telegram' } }
    });
  }
}
