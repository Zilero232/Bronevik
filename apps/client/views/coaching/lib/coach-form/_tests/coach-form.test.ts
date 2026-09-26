import { describe, expect, it } from 'vitest';

import { zUpsertCoach } from '@/shared/api/coaching';

import type { CoachProfileFields } from '..';

import { coachFormSchema, toCoachFormValues, toUpsertCoach } from '..';

const COACH: CoachProfileFields = {
  accountId: 555,
  headline: 'Разбираю реплеи СТ',
  bio: null,
  contacts: { telegram: 'https://t.me/mentor' },
  tankIds: [1, 2],
  isActive: true
};

describe('toCoachFormValues', () => {
  it('starts a new profile on the fallback account', () => {
    expect(toCoachFormValues({ coach: null, fallbackAccountId: 42 }).accountId).toBe('42');
  });

  it('fills the form from an existing profile', () => {
    const values = toCoachFormValues({ coach: COACH, fallbackAccountId: 42 });

    expect(values.accountId).toBe('555');
    expect(values.contacts.telegram).toBe('https://t.me/mentor');
    expect(values.contacts.discord).toBe('');
  });
});

describe('toUpsertCoach', () => {
  it('round-trips a profile into a body the server accepts', () => {
    const body = toUpsertCoach(coachFormSchema.parse(toCoachFormValues({ coach: COACH, fallbackAccountId: null })));

    expect(zUpsertCoach.safeParse(body).success).toBe(true);
    expect(body.contacts).toEqual({ telegram: 'https://t.me/mentor' });
  });

  it('drops an empty bio', () => {
    expect(toUpsertCoach(coachFormSchema.parse(toCoachFormValues({ coach: COACH, fallbackAccountId: null })))).not.toHaveProperty('bio');
  });
});

describe('coachFormSchema', () => {
  it('rejects a plain http contact link', () => {
    const values = toCoachFormValues({ coach: { ...COACH, contacts: { vk: 'http://vk.com/mentor' } }, fallbackAccountId: null });

    expect(coachFormSchema.safeParse(values).success).toBe(false);
  });

  it('requires an account', () => {
    expect(coachFormSchema.safeParse(toCoachFormValues({ coach: null, fallbackAccountId: null })).success).toBe(false);
  });
});
