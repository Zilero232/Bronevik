import { describe, expect, it } from 'vitest';

import { candidateNickname, candidateNotesSchema, toCandidateNotesValues } from '..';
import { CANDIDATE_NOTES } from '../../../config';

describe('candidateNotesSchema', () => {
  it('trims the notes and clears them when nothing is left', () => {
    expect(candidateNotesSchema.parse({ notes: '  plays on weekends  ' })).toEqual({ notes: 'plays on weekends' });
    expect(candidateNotesSchema.parse({ notes: '   ' })).toEqual({ notes: null });
  });

  it('refuses notes past the server limit', () => {
    expect(candidateNotesSchema.safeParse({ notes: 'x'.repeat(CANDIDATE_NOTES.maxLength + 1) }).success).toBe(false);
  });
});

describe('toCandidateNotesValues', () => {
  it('starts an empty field for a candidate without notes', () => {
    expect(toCandidateNotesValues({ notes: null })).toEqual({ notes: '' });
  });
});

describe('candidateNickname', () => {
  it('reads the nickname from the stats snapshot and nothing without one', () => {
    expect(candidateNickname({ stats: null })).toBeNull();

    expect(
      candidateNickname({
        stats: { nickname: 'Recruit', battles: null, wn8: null, winRate: null, avgDamage: null, capturedAt: '2026-09-20T00:00:00Z' }
      })
    ).toBe('Recruit');
  });
});
