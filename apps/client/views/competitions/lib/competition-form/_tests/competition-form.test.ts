import { COMPETITION } from '@otmetki/schemas';
import { addDays, addHours, format } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { COMPETITION_FORM, COMPETITION_FORM_DEFAULTS } from '../../../config';
import { toCreateCompetitionInput } from '../competition-form';
import { competitionFormSchema } from '../competition-form.schemas';

const local = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm");

const start = addDays(new Date(), 1);

const values = {
  ...COMPETITION_FORM_DEFAULTS,
  title: '  Weekend brawl  ',
  startsAt: local(start),
  endsAt: local(addDays(start, 2))
};

describe('toCreateCompetitionInput', () => {
  it('trims the text, drops an empty description and an unset tier', () => {
    const input = toCreateCompetitionInput(values);

    expect(input.title).toBe(values.title.trim());
    expect(input).not.toHaveProperty('description');
    expect(input).not.toHaveProperty('minTier');
  });

  it('turns a chosen tier into a number and keeps the scoring weights', () => {
    const [tier] = COMPETITION_FORM.tiers;
    const input = toCreateCompetitionInput({ ...values, minTier: String(tier), description: ' about ' });

    expect(input.minTier).toBe(tier);
    expect(input.description).toBe('about');
    expect(input.scoring).toEqual(COMPETITION.defaultScoring);
  });
});

describe('competitionFormSchema', () => {
  it('accepts the defaults with a title and a schedule', () => {
    expect(competitionFormSchema.safeParse(values).success).toBe(true);
  });

  it('rejects an end before the start on the end field', () => {
    const result = competitionFormSchema.safeParse({ ...values, endsAt: local(addHours(start, -1)) });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some(({ path }) => path.includes('endsAt'))).toBe(true);
  });

  it('rejects a competition longer than the maximum duration', () => {
    const result = competitionFormSchema.safeParse({ ...values, endsAt: local(addDays(start, COMPETITION.maxDurationDays + 1)) });

    expect(result.success).toBe(false);
  });

  it('rejects an empty schedule', () => {
    expect(competitionFormSchema.safeParse({ ...values, startsAt: '' }).success).toBe(false);
  });
});
