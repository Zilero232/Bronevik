import type { Prisma } from '../../../../../generated';
import type { SHARE_RECIPIENT_SELECT } from './share-recipient';

export type ShareRecipientRow = Prisma.UserGetPayload<{ select: typeof SHARE_RECIPIENT_SELECT }>;
