import { describe, expect, it } from 'vitest';

import { desiredRoles, readTierRoles, roleChanges } from '../member-roles';

const BINDING = { clanId: 7n, memberRoleId: '100', tierRoles: { good: '201', unicum: '202' } };

describe('member roles', () => {
  it('grants the clan role to members and the tier role by WN8', () => {
    expect(desiredRoles({ binding: BINDING, member: { clanId: 7n, wn8: 2600 } })).toEqual(['100', '202']);
    expect(desiredRoles({ binding: BINDING, member: { clanId: 8n, wn8: 1300 } })).toEqual(['201']);
    expect(desiredRoles({ binding: BINDING, member: { clanId: null, wn8: null } })).toEqual([]);
  });

  it('only removes roles the bot manages', () => {
    expect(roleChanges({ binding: BINDING, granted: ['100', '999', '201'], desired: ['202'] })).toEqual({ add: ['202'], remove: ['100', '201'] });
  });

  it('reads stored tier roles defensively', () => {
    expect(readTierRoles({ good: '1', nope: '2' })).toEqual({});
    expect(readTierRoles({ good: '1' })).toEqual({ good: '1' });
    expect(readTierRoles(null)).toEqual({});
  });
});
