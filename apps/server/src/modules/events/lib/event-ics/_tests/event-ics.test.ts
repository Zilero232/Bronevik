import type { GameEvent } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { eventsIcs } from '../event-ics';

const EVENT: GameEvent = {
  id: '00000000-0000-4000-8000-000000000001',
  slug: 'front-line-2026',
  kind: 'front_line',
  title: 'Линия фронта',
  description: 'Этап 1',
  url: 'https://tanki.su/ru/news/front-line-2026/',
  image: null,
  startsAt: '2026-10-01T09:00:00.000Z',
  endsAt: '2026-10-08T06:00:00.000Z'
};

const unfold = (ics: string) => ics.replaceAll(/\r\n[ \t]/g, '');

describe('eventsIcs', () => {
  it('writes one VEVENT per event with a stable uid and utc bounds', () => {
    const ics = unfold(eventsIcs({ events: [EVENT], calName: 'Events' }));

    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(ics).toContain('UID:front-line-2026@otmetki');
    expect(ics).toContain('DTSTART:20261001T090000Z');
    expect(ics).toContain('DTEND:20261008T060000Z');
    expect(ics).toContain('X-WR-CALNAME:Events');
  });

  it('gives an open-ended event a one-day duration instead of an end', () => {
    const ics = unfold(eventsIcs({ events: [{ ...EVENT, endsAt: null }], calName: 'Events' }));

    expect(ics).not.toContain('DTEND');
    expect(ics).toContain('DURATION:P1D');
  });

  it('falls back to a duration when the end is not after the start', () => {
    const ics = unfold(eventsIcs({ events: [{ ...EVENT, endsAt: EVENT.startsAt }], calName: 'Events' }));

    expect(ics).toContain('DURATION:P1D');
  });

  it('builds an empty calendar when there are no events', () => {
    const ics = eventsIcs({ events: [], calName: 'Events' });

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).not.toContain('BEGIN:VEVENT');
  });
});
