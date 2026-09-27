import type { ClanMemberEvent } from '@otmetki/schemas';

import type { ToClanEventInput } from './clan-event.types';

import { CLAN_ROLE_FROM_DB, toNumber } from '../../../../common/lib';

export const toClanEvent = ({ row, nickname }: ToClanEventInput): ClanMemberEvent => ({
  accountId: toNumber(row.accountId),
  nickname,
  type: row.type === 'roleChanged' ? 'role_changed' : row.type,
  oldRole: row.oldRole ? CLAN_ROLE_FROM_DB[row.oldRole] : null,
  newRole: row.newRole ? CLAN_ROLE_FROM_DB[row.newRole] : null,
  occurredAt: row.occurredAt.toISOString()
});
