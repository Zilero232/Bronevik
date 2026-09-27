import { describe, expect, it } from 'vitest';

import { platoonFormSchema, toCreatePlatoon } from '..';
import { zCreatePlatoon } from '../../../api';
import { PLATOON_FORM_DEFAULTS } from '../../../config';

describe('toCreatePlatoon', () => {
  it('produces a body the server schema accepts from the defaults', () => {
    const body = toCreatePlatoon(platoonFormSchema.parse(PLATOON_FORM_DEFAULTS));

    expect(zCreatePlatoon.safeParse(body).success).toBe(true);
  });

  it('omits empty optional fields instead of sending blanks', () => {
    const body = toCreatePlatoon(platoonFormSchema.parse(PLATOON_FORM_DEFAULTS));

    expect(body).not.toHaveProperty('message');
    expect(body).not.toHaveProperty('minWn8');
    expect(body).not.toHaveProperty('accountId');
    expect(body).not.toHaveProperty('availableFrom');
  });

  it('sends tiers as sorted numbers', () => {
    expect(toCreatePlatoon(platoonFormSchema.parse({ ...PLATOON_FORM_DEFAULTS, tiers: ['10', '8', '9'] })).tiers).toEqual([8, 9, 10]);
  });

  it('keeps a zero minimum wn8', () => {
    expect(toCreatePlatoon(platoonFormSchema.parse({ ...PLATOON_FORM_DEFAULTS, minWn8: '0' })).minWn8).toBe(0);
  });

  it('sends the chosen account and availability as server values', () => {
    const body = toCreatePlatoon(
      platoonFormSchema.parse({ ...PLATOON_FORM_DEFAULTS, accountId: '12345', availableFrom: '2026-09-26T19:00', availableUntil: '2026-09-26T22:00' })
    );

    expect(body.accountId).toBe(12345);
    expect(zCreatePlatoon.safeParse(body).success).toBe(true);
  });
});

describe('platoonFormSchema', () => {
  it('rejects a window that ends before it starts', () => {
    const result = platoonFormSchema.safeParse({ ...PLATOON_FORM_DEFAULTS, availableFrom: '2026-09-26T22:00', availableUntil: '2026-09-26T19:00' });

    expect(result.success).toBe(false);
  });

  it('rejects a fractional minimum wn8', () => {
    expect(platoonFormSchema.safeParse({ ...PLATOON_FORM_DEFAULTS, minWn8: '1500.5' }).success).toBe(false);
  });
});
