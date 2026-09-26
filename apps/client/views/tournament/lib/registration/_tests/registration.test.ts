import { describe, expect, it } from 'vitest';

import type { RegistrationInput } from '../registration.types';

import { registrationState } from '../registration';

const NOW = new Date('2026-10-01T12:00:00Z');

const PARTICIPANT = { accountId: 1, nickname: 'a', teamName: null, seed: null, verified: true };

const OPEN: RegistrationInput['tournament'] = { status: 'registration', registrationEndsAt: null, participants: [], maxParticipants: 2 };

describe('registrationState', () => {
  it('is open during registration with free places', () => {
    expect(registrationState({ tournament: OPEN, now: NOW, isRegistered: false })).toBe('open');
  });

  it('reports the viewer as registered before anything else', () => {
    expect(registrationState({ tournament: { ...OPEN, status: 'running' }, now: NOW, isRegistered: true })).toBe('registered');
  });

  it('is full when the cap is reached', () => {
    expect(
      registrationState({ tournament: { ...OPEN, participants: [PARTICIPANT, { ...PARTICIPANT, accountId: 2 }] }, now: NOW, isRegistered: false })
    ).toBe('full');
  });

  it('leaves the deadline to the server status until the clock is known', () => {
    expect(registrationState({ tournament: { ...OPEN, registrationEndsAt: NOW.toISOString() }, now: null, isRegistered: false })).toBe('open');
  });

  it('closes at the registration deadline itself', () => {
    expect(registrationState({ tournament: { ...OPEN, registrationEndsAt: NOW.toISOString() }, now: NOW, isRegistered: false })).toBe('closed');
  });

  it('is closed once the tournament runs', () => {
    expect(registrationState({ tournament: { ...OPEN, status: 'running' }, now: NOW, isRegistered: false })).toBe('closed');
  });

  it('is not open for a draft', () => {
    expect(registrationState({ tournament: { ...OPEN, status: 'draft' }, now: NOW, isRegistered: false })).toBe('notOpen');
  });
});
