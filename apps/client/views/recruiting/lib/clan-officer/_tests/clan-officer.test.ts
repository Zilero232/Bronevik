import { describe, expect, it } from 'vitest';

import { isRecruitingOfficer, officerMemberships } from '../clan-officer';

describe('isRecruitingOfficer', () => {
  it('accepts the roles the server lets recruit', () => {
    expect(isRecruitingOfficer('commander')).toBe(true);
    expect(isRecruitingOfficer('recruitment_officer')).toBe(true);
  });

  it('rejects ranks that cannot recruit', () => {
    expect(isRecruitingOfficer('private')).toBe(false);
    expect(isRecruitingOfficer('junior_officer')).toBe(false);
    expect(isRecruitingOfficer('intelligence_officer')).toBe(false);
  });

  it('rejects a missing role', () => {
    expect(isRecruitingOfficer(null)).toBe(false);
    expect(isRecruitingOfficer(undefined)).toBe(false);
  });
});

describe('officerMemberships', () => {
  it('keeps only the accounts that hold an officer role', () => {
    const memberships = [
      { accountId: 1, nickname: 'a', clanId: 10, clanTag: 'AAA', role: 'private' },
      { accountId: 2, nickname: 'b', clanId: 20, clanTag: 'BBB', role: 'executive_officer' }
    ];

    expect(officerMemberships(memberships).map(({ accountId }) => accountId)).toEqual([2]);
  });
});
