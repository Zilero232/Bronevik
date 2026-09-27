import type { DemoteIdleSqlInput, PromotePinnedSqlInput } from './pinned-tiers.types';

import { Prisma } from '../../../../../../generated';

const pinnedAccounts = Prisma.sql`
  SELECT target_id FROM follow WHERE kind = 'player'::target_kind
  UNION SELECT account_id FROM user_lesta_account
  UNION SELECT account_id FROM mod_device WHERE revoked_at IS NULL AND account_id IS NOT NULL
`;

export const promotePinnedSql = ({ now }: PromotePinnedSqlInput): Prisma.Sql => Prisma.sql`
  UPDATE player
  SET tracking_tier = 'active'::tracking_tier, next_poll_at = ${now}, updated_at = now()
  WHERE tracking_tier <> 'active'::tracking_tier AND account_id IN (${pinnedAccounts})
`;

export const demoteIdleSql = ({ idleSince }: DemoteIdleSqlInput): Prisma.Sql => Prisma.sql`
  UPDATE player p
  SET tracking_tier = 'population'::tracking_tier, updated_at = now()
  WHERE p.tracking_tier = 'active'::tracking_tier
    AND (p.last_viewed_at IS NULL OR p.last_viewed_at < ${idleSince})
    AND NOT EXISTS (SELECT 1 FROM (${pinnedAccounts}) pinned(account_id) WHERE pinned.account_id = p.account_id)
`;
