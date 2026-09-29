import { TANK_ROLES } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { rolesForTypes, rolesWithinTypes } from '../vehicle-traits';

describe('rolesForTypes', () => {
  it('offers every role when no class is chosen', () => {
    expect(rolesForTypes([])).toEqual([...TANK_ROLES]);
  });

  it('keeps self-propelled guns apart from tank destroyers', () => {
    const roles = rolesForTypes(['SPG']);

    expect(roles.length).toBeGreaterThan(0);
    expect(roles.every((role) => role.startsWith('SPG'))).toBe(true);
    expect(rolesForTypes(['AT-SPG']).some((role) => roles.includes(role))).toBe(false);
  });
});

describe('rolesWithinTypes', () => {
  it('drops a chosen role that the new classes no longer offer', () => {
    expect(rolesWithinTypes({ roles: ['HT_break', 'MT_sniper'], types: ['mediumTank'] })).toEqual(['MT_sniper']);
  });

  it('keeps every chosen role when no class is chosen', () => {
    expect(rolesWithinTypes({ roles: ['HT_break'], types: [] })).toEqual(['HT_break']);
  });
});
