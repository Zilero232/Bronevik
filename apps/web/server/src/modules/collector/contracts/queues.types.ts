import type { z } from 'zod';

import type { ENROL_PRIORITY, QUEUE } from './queues.constants';
import type {
  accountBatchPayloadSchema,
  accountRatingsPayloadSchema,
  clanDispatchPayloadSchema,
  clanRefreshPayloadSchema,
  encyclopediaPayloadSchema,
  enrolPayloadSchema,
  purgeAccountPayloadSchema
} from './queues.schemas';

export type QueueName = (typeof QUEUE)[keyof typeof QUEUE];

export type EnrolPriority = keyof typeof ENROL_PRIORITY;

export type EnrolPayload = z.input<typeof enrolPayloadSchema>;
export type AccountBatchPayload = z.infer<typeof accountBatchPayloadSchema>;
export type ClanDispatchPayload = z.infer<typeof clanDispatchPayloadSchema>;
export type ClanRefreshPayload = z.infer<typeof clanRefreshPayloadSchema>;
export type EncyclopediaPayload = z.infer<typeof encyclopediaPayloadSchema>;
export type AccountRatingsPayload = z.infer<typeof accountRatingsPayloadSchema>;
export type PurgeAccountPayload = z.infer<typeof purgeAccountPayloadSchema>;
