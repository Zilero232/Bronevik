import plan from '@contract/install-plan.json';
import { describe, expect, it } from 'vitest';

import { installPlanSchema } from '@/entities/setup';

describe('installPlanSchema', () => {
  it('parses the install plan with the other mods to review', () => {
    const parsed = installPlanSchema.parse(plan);

    expect(parsed.otherMods.map((entry) => entry.location)).toEqual(['mods', 'res_mods']);
  });
});
