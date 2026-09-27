import { describe, expect, it } from 'vitest';

import { clanRoleToDb } from '../enums';

describe('clanRoleToDb', () => {
  it('maps Lesta snake_case roles onto the enum', () => {
    expect(clanRoleToDb('executive_officer')).toBe('executiveOfficer');
    expect(clanRoleToDb('private')).toBe('private');
  });

  it('returns null for an unknown role', () => {
    expect(clanRoleToDb('emperor')).toBeNull();
  });
});
