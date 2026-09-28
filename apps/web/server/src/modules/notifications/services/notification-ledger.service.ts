import { Injectable, Logger } from '@nestjs/common';

import type { SendOnceInput } from '../notifications.types';

import { errorMessage } from '../../../common/lib';
import { isUniqueViolation, PrismaService } from '../../../core';

@Injectable()
export class NotificationLedgerService {
  private readonly logger = new Logger(NotificationLedgerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async sendOnce({ userId, channel, dedupeKey, notification, rendered, send }: SendOnceInput): Promise<boolean> {
    const where = { userId_channel_dedupeKey: { userId, channel, dedupeKey } };
    const existing = await this.prisma.notification.findUnique({ where, select: { id: true, sentAt: true } });

    if (existing?.sentAt) {
      return false;
    }

    let id = existing?.id;

    if (!id) {
      try {
        const created = await this.prisma.notification.create({
          data: { userId, channel, dedupeKey, event: notification.event, payload: { ...notification, ...rendered } },
          select: { id: true }
        });

        id = created.id;
      } catch (error) {
        if (isUniqueViolation(error)) {
          return false;
        }

        throw error;
      }
    }

    try {
      await send();
      await this.prisma.notification.update({ where: { id }, data: { sentAt: new Date(), failedAt: null } });
    } catch (error) {
      await this.prisma.notification.update({ where: { id }, data: { failedAt: new Date() } });
      this.logger.warn(`${channel} delivery of ${dedupeKey} to ${userId} failed: ${errorMessage(error)}`);

      throw error;
    }

    return true;
  }
}
