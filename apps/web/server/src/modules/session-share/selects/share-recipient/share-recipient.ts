import type { Prisma } from '../../../../../generated';

import { AUTH_PROVIDER } from '../../../../lib/auth';

export const SHARE_RECIPIENT_SELECT = {
  locale: true,
  telegramAccount: { select: { telegramId: true } },
  accounts: { where: { providerId: AUTH_PROVIDER.discord }, select: { accountId: true }, take: 1 }
} as const satisfies Prisma.UserSelect;
