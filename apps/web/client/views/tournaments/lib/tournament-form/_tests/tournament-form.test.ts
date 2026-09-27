import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { zCreateTournament } from '@/entities/tournament/tournament';

import { toCreateTournament, tournamentFormSchema } from '..';
import { TOURNAMENT_FORM_DEFAULTS } from '../../../config';

const VALID = { ...TOURNAMENT_FORM_DEFAULTS, title: 'Кубок взводов', startsAt: '2026-10-10T18:00' };

beforeEach(() => {
  vi.useFakeTimers({ now: new Date('2026-10-01T12:00') });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('toCreateTournament', () => {
  it('builds a body the server schema accepts', () => {
    expect(zCreateTournament.safeParse(toCreateTournament(tournamentFormSchema.parse(VALID))).success).toBe(true);
  });

  it('sends the start as an ISO instant of the Moscow wall time', () => {
    expect(toCreateTournament(tournamentFormSchema.parse(VALID)).startsAt).toBe('2026-10-10T15:00:00.000Z');
  });

  it('omits the empty description and registration deadline', () => {
    const body = toCreateTournament(tournamentFormSchema.parse(VALID));

    expect(body).not.toHaveProperty('description');
    expect(body).not.toHaveProperty('registrationEndsAt');
  });

  it('sends the participant cap as a number', () => {
    expect(toCreateTournament(tournamentFormSchema.parse({ ...VALID, maxParticipants: '32' })).maxParticipants).toBe(32);
  });
});

describe('tournamentFormSchema', () => {
  it('requires a start time', () => {
    expect(tournamentFormSchema.safeParse({ ...VALID, startsAt: '' }).success).toBe(false);
  });

  it('rejects a start in the past', () => {
    expect(tournamentFormSchema.safeParse({ ...VALID, startsAt: '2026-09-30T18:00' }).success).toBe(false);
  });

  it('rejects a registration deadline after the start', () => {
    expect(tournamentFormSchema.safeParse({ ...VALID, registrationEndsAt: '2026-10-11T18:00' }).success).toBe(false);
  });

  it('rejects a participant cap outside the server range', () => {
    expect(tournamentFormSchema.safeParse({ ...VALID, maxParticipants: '1' }).success).toBe(false);
    expect(tournamentFormSchema.safeParse({ ...VALID, maxParticipants: '257' }).success).toBe(false);
  });
});
