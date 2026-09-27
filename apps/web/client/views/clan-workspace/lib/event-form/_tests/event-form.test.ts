import { describe, expect, it } from 'vitest';

import type { WorkspaceEvent } from '../../../api';

import { eventFormSchema, toEventFormValues, toNewWorkspaceEvent } from '..';
import { EVENT_FORM_DEFAULTS, REMIND_OPTIONS } from '../../../config';

const VALUES = {
  title: '  Clan wars: Prokhorovka  ',
  kind: 'clan_wars' as const,
  startsAt: '2026-10-01T20:00',
  endsAt: '',
  remind: '60' as const
};

describe('toNewWorkspaceEvent', () => {
  it('converts the Moscow time and trims the title', () => {
    expect(toNewWorkspaceEvent(VALUES)).toEqual({
      kind: 'clan_wars',
      title: 'Clan wars: Prokhorovka',
      startsAt: '2026-10-01T17:00:00.000Z',
      remindMinutesBefore: 60
    });
  });

  it('keeps the end time when it is set', () => {
    expect(toNewWorkspaceEvent({ ...VALUES, endsAt: '2026-10-01T22:00' }).endsAt).toBe('2026-10-01T19:00:00.000Z');
  });
});

describe('eventFormSchema', () => {
  it('accepts a complete event', () => {
    expect(eventFormSchema.safeParse(VALUES).success).toBe(true);
  });

  it('rejects a missing start and a short title', () => {
    expect(eventFormSchema.safeParse({ ...VALUES, startsAt: '' }).success).toBe(false);
    expect(eventFormSchema.safeParse({ ...VALUES, title: 'x' }).success).toBe(false);
  });

  it('rejects an end before the start', () => {
    const result = eventFormSchema.safeParse({ ...VALUES, endsAt: '2026-10-01T19:00' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['endsAt']);
  });
});

describe('toEventFormValues', () => {
  const event: WorkspaceEvent = {
    id: 'e1',
    kind: 'stronghold',
    title: 'Stronghold',
    startsAt: '2026-10-01T17:00:00.000Z',
    endsAt: '2026-10-01T19:00:00.000Z',
    remindAt: '2026-10-01T16:00:00.000Z',
    remindMinutesBefore: 60,
    remindedAt: null,
    attendance: []
  };

  it('round-trips an event through the form unchanged', () => {
    expect(eventFormSchema.parse(toEventFormValues(event))).toEqual({
      kind: event.kind,
      title: event.title,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      remindMinutesBefore: event.remindMinutesBefore
    });
  });

  it('falls back to the default reminder for a lead the form does not offer', () => {
    const odd = Number(REMIND_OPTIONS.at(-1)) + 1;

    expect(toEventFormValues({ ...event, remindMinutesBefore: odd }).remind).toBe(EVENT_FORM_DEFAULTS.remind);
    expect(toEventFormValues({ ...event, remindMinutesBefore: null }).remind).toBe(EVENT_FORM_DEFAULTS.remind);
  });

  it('leaves the end empty for an event without one', () => {
    expect(toEventFormValues({ ...event, endsAt: null }).endsAt).toBe('');
  });
});
