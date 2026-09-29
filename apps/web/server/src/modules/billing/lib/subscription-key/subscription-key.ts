import type { Prisma } from '../../../../../generated';

import { PLUS_SUBSCRIPTION } from '../../config';

export const plusSubscriptionKey = (userId: string): Prisma.SubscriptionWhereUniqueInput => ({
  userId_product: { userId, product: PLUS_SUBSCRIPTION.product }
});
