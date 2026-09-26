import type { GameEvent as GameEventView } from '@otmetki/schemas';

import type { GameEvent, GameEventKind } from '../../../../../generated';

import { toIso } from '../../../../common/lib';
import { httpUrl } from '../../../../lib/scrape';
import { EVENT_CALENDAR, EVENT_KIND_RULES } from '../../config';
import { EVENT_KIND_FROM_DB } from './event-kind.constants';

export const eventKind = (title: string): GameEventKind =>
  EVENT_KIND_RULES.find((rule) => rule.pattern.test(title))?.kind ?? EVENT_CALENDAR.defaultKind;

export const eventSlug = (url: string): string =>
  new URL(url).pathname
    .split('/')
    .filter(Boolean)
    .at(-1)
    ?.toLowerCase()
    .replaceAll(/[^a-z0-9-]+/g, '-')
    .replaceAll(/^-+|-+$/g, '') ?? '';

export const toEventView = (event: GameEvent): GameEventView => ({
  id: event.id,
  slug: event.slug,
  kind: EVENT_KIND_FROM_DB[event.kind],
  title: event.title,
  description: event.description,
  url: httpUrl(event.url),
  image: httpUrl(event.image),
  startsAt: event.startsAt.toISOString(),
  endsAt: toIso(event.endsAt)
});
