import type { NotificationEvent } from '@otmetki/schemas';

import { notificationEventSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { groupValue, mergeGroup, toggleEvent } from '../event-selection';

const event: NotificationEvent = 'bonus_code';
const others = notificationEventSchema.options.filter((item) => item !== event).slice(0, 2);

describe('toggleEvent', () => {
  it('adds the event once and keeps the others', () => {
    const next = toggleEvent({ events: [...others, event], event, isOn: true });

    expect(next.filter((item) => item === event)).toHaveLength(1);
    expect(next).toEqual(expect.arrayContaining(others));
  });

  it('adds a missing event', () => {
    expect(toggleEvent({ events: others, event, isOn: true })).toContain(event);
  });

  it('removes the event and keeps the others', () => {
    expect(toggleEvent({ events: [...others, event], event, isOn: false })).toEqual(others);
  });
});

describe('event groups', () => {
  const group: NotificationEvent[] = ['moe_gained', 'mastery_gained'];
  const events: NotificationEvent[] = ['moe_gained', 'bonus_code'];

  it('picks the selected events of a group', () => {
    expect(groupValue({ events, group })).toEqual(['moe_gained']);
  });

  it('replaces the group selection and keeps events of other groups', () => {
    expect(mergeGroup({ events, group, next: ['mastery_gained'] })).toEqual(['bonus_code', 'mastery_gained']);
  });
});
