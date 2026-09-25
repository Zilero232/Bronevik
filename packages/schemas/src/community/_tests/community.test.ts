import { describe, expect, it } from 'vitest';

import { LOADOUT } from '../community.constants';
import { createBuildSchema, loadoutSchema } from '../community.schemas';

const BASE_LOADOUT = { equipment: [1, null, 3], consumables: [], crewSkills: {} };

describe('community schemas', () => {
  it('fills the optional loadout parts with empty defaults', () => {
    expect(loadoutSchema.parse(BASE_LOADOUT)).toMatchObject({ directives: [], ammo: [], fieldModifications: [] });
  });

  it('caps every slot group at its configured size', () => {
    const tooMany = Array.from({ length: LOADOUT.equipmentSlots + 1 }, (_, index) => index + 1);

    expect(loadoutSchema.safeParse({ ...BASE_LOADOUT, equipment: tooMany }).success).toBe(false);
  });

  it('defaults a new build to public and trims the title', () => {
    const build = createBuildSchema.parse({ tankId: '1', title: '  Build  ', loadout: BASE_LOADOUT });

    expect(build).toMatchObject({ tankId: 1, title: 'Build', visibility: 'public' });
    expect(createBuildSchema.safeParse({ tankId: 1, title: 'ab', loadout: BASE_LOADOUT }).success).toBe(false);
  });
});
