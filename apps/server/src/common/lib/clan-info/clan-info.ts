import { fromUnixTime } from 'date-fns';

import type { ClanInfo } from '../../../lib/lesta';

import { toJsonValue } from '../json';

export const clanInfoFields = (info: ClanInfo) => ({
  tag: info.tag,
  name: info.name,
  color: info.color ?? null,
  motto: info.motto ?? null,
  description: info.description ?? null,
  emblems: toJsonValue(info.emblems),
  leaderId: info.leader_id ? BigInt(info.leader_id) : null,
  createdAt: fromUnixTime(info.created_at)
});
