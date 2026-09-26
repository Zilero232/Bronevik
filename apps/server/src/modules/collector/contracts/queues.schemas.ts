import { z } from 'zod';

import { LESTA_API } from '../../../lib/lesta';
import { CLAN_DISPATCH_SCOPES, ENROL_REASONS } from './queues.constants';

const accountId = z.number().int().positive();
const clanId = z.number().int().positive();

export const enrolPayloadSchema = z.object({
  accountId,
  reason: z.enum(ENROL_REASONS).default('search')
});

export const accountBatchPayloadSchema = z.object({
  accountIds: z.array(accountId).min(1).max(LESTA_API.batchSize)
});

export const clanDispatchPayloadSchema = z.object({
  scope: z.enum(CLAN_DISPATCH_SCOPES).default('tracked')
});

export const clanRefreshPayloadSchema = z.object({
  clanIds: z.array(clanId).min(1).max(LESTA_API.batchSize),
  snapshot: z.boolean().default(false)
});

export const encyclopediaPayloadSchema = z.object({
  force: z.boolean().default(false)
});

export const accountRatingsPayloadSchema = z.object({
  accountId
});

export const webhookDeliverPayloadSchema = z.object({
  deliveryId: z.uuid()
});

export const purgeAccountPayloadSchema = z.object({
  accountId,
  requestId: z.uuid().optional()
});
