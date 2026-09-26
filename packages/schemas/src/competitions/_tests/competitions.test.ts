import { describe, expect, it } from 'vitest';

import { COMPETITION } from '../competitions.constants';
import { createCompetitionSchema, joinCompetitionSchema } from '../competitions.schemas';

const START = '2026-10-01T10:00:00.000Z';
const DAY_MS = 86_400_000;

describe('createCompetitionSchema', () => {
  it('fills the default scoring and battle count', () => {
    const parsed = createCompetitionSchema.parse({ title: 'Взводный кубок', startsAt: START, endsAt: '2026-10-02T10:00:00.000Z' });

    expect(parsed.scoring).toEqual(COMPETITION.defaultScoring);
    expect(parsed.battlesPerPlayer).toBe(COMPETITION.battles.default);
  });

  it('refuses a competition that ends when it starts', () => {
    expect(createCompetitionSchema.safeParse({ title: 'Кубок', startsAt: START, endsAt: START }).success).toBe(false);
  });

  it('accepts the longest allowed competition and refuses a longer one', () => {
    const at = (days: number) => new Date(new Date(START).getTime() + days * DAY_MS).toISOString();

    expect(createCompetitionSchema.safeParse({ title: 'Кубок', startsAt: START, endsAt: at(COMPETITION.maxDurationDays) }).success).toBe(true);
    expect(createCompetitionSchema.safeParse({ title: 'Кубок', startsAt: START, endsAt: at(COMPETITION.maxDurationDays + 1) }).success).toBe(false);
  });
});

describe('joinCompetitionSchema', () => {
  it('needs exactly one of an existing team or a new team name', () => {
    expect(joinCompetitionSchema.safeParse({ accountId: 1 }).success).toBe(false);
    expect(joinCompetitionSchema.safeParse({ accountId: 1, teamName: 'Альфа', teamId: '00000000-0000-4000-8000-000000000000' }).success).toBe(false);
    expect(joinCompetitionSchema.safeParse({ accountId: 1, teamName: 'Альфа' }).success).toBe(true);
  });
});
