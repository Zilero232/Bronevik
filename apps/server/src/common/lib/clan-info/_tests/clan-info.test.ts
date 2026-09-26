import { fromUnixTime } from 'date-fns';
import { describe, expect, it } from 'vitest';

import type { ClanInfo } from '../../../../lib/lesta';

import { clanInfoFields } from '../clan-info';

const info: ClanInfo = { clan_id: 1, name: 'Clan', tag: 'CLN', created_at: 1_600_000_000, members_count: 10 };

describe('clanInfoFields', () => {
  it('stores missing optional fields as null', () => {
    expect(clanInfoFields(info)).toMatchObject({ color: null, motto: null, description: null, leaderId: null });
  });

  it('converts the leader id and creation time', () => {
    expect(clanInfoFields({ ...info, leader_id: 42 })).toMatchObject({ leaderId: 42n, createdAt: fromUnixTime(info.created_at) });
  });

  it('treats a zero leader id as no leader', () => {
    expect(clanInfoFields({ ...info, leader_id: 0 }).leaderId).toBeNull();
  });
});
