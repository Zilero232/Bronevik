import { describe, expect, it } from 'vitest';

import { zCreateOrder } from '@/shared/api/coaching';

import { requestFormSchema, toCreateOrder } from '..';
import { REQUEST_FORM_DEFAULTS } from '../../../config';

const COACH = '11111111-1111-4111-8111-111111111111';
const OFFER = '22222222-2222-4222-8222-222222222222';
const REPLAY = '33333333-3333-4333-8333-333333333333';

describe('toCreateOrder', () => {
  it('builds a minimal request the server accepts', () => {
    const body = toCreateOrder({ values: requestFormSchema.parse({ ...REQUEST_FORM_DEFAULTS, studentContact: ' @tanker ' }), coachUserId: COACH });

    expect(body).toEqual({ coachUserId: COACH, studentContact: '@tanker' });
    expect(zCreateOrder.safeParse(body).success).toBe(true);
  });

  it('sends the chosen offer, replay and notes', () => {
    const values = requestFormSchema.parse({ offerId: OFFER, replayId: REPLAY, notes: 'Разбор боя на ЛТ', studentContact: '@tanker' });

    expect(toCreateOrder({ values, coachUserId: COACH })).toMatchObject({ offerId: OFFER, replayId: REPLAY, notes: 'Разбор боя на ЛТ' });
  });
});

describe('requestFormSchema', () => {
  it('requires a contact', () => {
    expect(requestFormSchema.safeParse(REQUEST_FORM_DEFAULTS).success).toBe(false);
  });

  it('rejects a replay id that is not a uuid', () => {
    expect(requestFormSchema.safeParse({ ...REQUEST_FORM_DEFAULTS, studentContact: '@tanker', replayId: 'replay-1' }).success).toBe(false);
  });
});
