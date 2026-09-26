import { describe, expect, it } from 'vitest';

import { recruitingFormSchema, toCreateRecruiting } from '..';
import { zCreateRecruiting } from '../../../api';
import { RECRUITING_FORM_DEFAULTS } from '../../../config';

const FILLED = recruitingFormSchema.parse({
  ...RECRUITING_FORM_DEFAULTS,
  accountId: '777',
  title: 'Набор в клан',
  body: 'Ищем активных игроков на укрепрайон',
  requirements: { minBattles: '5000', minWn8: '', maxWn8: '', minWinRate: '52' }
});

describe('toCreateRecruiting', () => {
  it('sends the clan and requirements for a clan post', () => {
    const body = toCreateRecruiting({ values: FILLED, kind: 'clan_seeks_player', clanId: 42 });

    expect(body.clanId).toBe(42);
    expect(body.accountId).toBe(777);
    expect(body.requirements?.minBattles).toBe(5000);
    expect(body.requirements?.minWinRate).toBeCloseTo(0.52);
    expect(zCreateRecruiting.safeParse(body).success).toBe(true);
  });

  it('never sends a clan or requirements for a player post', () => {
    const body = toCreateRecruiting({ values: FILLED, kind: 'player_seeks_clan', clanId: 42 });

    expect(body).not.toHaveProperty('clanId');
    expect(body.requirements).toEqual({});
    expect(zCreateRecruiting.safeParse(body).success).toBe(true);
  });

  it('lets the server pick the primary account', () => {
    const values = recruitingFormSchema.parse({ ...RECRUITING_FORM_DEFAULTS, title: 'Ищу клан', body: 'Играю на средних танках по вечерам' });

    expect(toCreateRecruiting({ values, kind: 'player_seeks_clan', clanId: null })).not.toHaveProperty('accountId');
  });
});

describe('recruitingFormSchema', () => {
  it('rejects a title shorter than the server allows', () => {
    expect(recruitingFormSchema.safeParse({ ...RECRUITING_FORM_DEFAULTS, title: 'abc', body: 'достаточно длинный текст' }).success).toBe(false);
  });
});
