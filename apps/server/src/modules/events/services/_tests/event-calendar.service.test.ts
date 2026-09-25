import { load } from 'cheerio';
import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { GameEvent } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { SOURCES } from '../../../../config';
import { crawlPages, parseTankiListing } from '../../../../lib/scrape';
import { EVENT_CALENDAR } from '../../config';
import { eventKind, eventSlug } from '../../lib/event-kind';
import { EventCalendarService } from '../event-calendar.service';

vi.mock('../../../../lib/scrape', async () => ({
  ...(await vi.importActual<typeof import('../../../../lib/scrape')>('../../../../lib/scrape')),
  crawlPages: vi.fn()
}));

const $ = load(readFileSync(new URL('../../../../lib/scrape/tanki-listing/_tests/fixtures/tanki-game-events.html', import.meta.url), 'utf8'));
const listing = parseTankiListing({ $, baseUrl: SOURCES.tankiSite });
const [knownItem] = listing;
const now = new Date('2026-09-25T12:00:00Z');

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.gameEvent.findMany.mockResolvedValue([mock<GameEvent>({ slug: eventSlug(knownItem?.url ?? SOURCES.tankiSite) })]);

  return { service: new EventCalendarService(prisma), prisma };
};

beforeEach(() => {
  vi.mocked(crawlPages).mockImplementation(async ({ urls }) => (urls.includes(SOURCES.tankiGameEvents) ? [{ url: SOURCES.tankiGameEvents, $ }] : []));
});

describe('EventCalendarService.run', () => {
  it('creates an event for every listed slug it has not stored yet', async () => {
    const { service, prisma } = createService();

    const created = await service.run(now);
    const slugs = prisma.gameEvent.upsert.mock.calls.map(([args]) => args.create.slug);

    expect(listing.length).toBeGreaterThan(1);
    expect(created).toBe(listing.length - 1);
    expect(slugs).toEqual(listing.slice(1).map((item) => eventSlug(item.url)));
    expect(slugs).not.toContain(eventSlug(knownItem?.url ?? SOURCES.tankiSite));
  });

  it('classifies each event by its title and leaves the end open without a detail page', async () => {
    const { service, prisma } = createService();

    await service.run(now);

    for (const [args] of prisma.gameEvent.upsert.mock.calls) {
      expect(args.create.kind).toBe(eventKind(args.create.title));
      expect(args.create.endsAt).toBeNull();
      expect(args.update).toEqual({});
    }

    expect(prisma.gameEvent.upsert.mock.calls.map(([args]) => args.create.kind)).toContain('onslaught');
  });

  it('stores nothing when every slug is already known', async () => {
    const { service, prisma } = createService();

    prisma.gameEvent.findMany.mockResolvedValue(listing.map((item) => mock<GameEvent>({ slug: eventSlug(item.url) })));

    expect(await service.run(now)).toBe(0);
    expect(prisma.gameEvent.upsert).not.toHaveBeenCalled();
  });

  it('visits at most the configured number of detail pages', async () => {
    const { service } = createService();

    await service.run(now);

    const detailUrls = vi.mocked(crawlPages).mock.calls.at(-1)?.[0].urls ?? [];

    expect(detailUrls.length).toBeLessThanOrEqual(EVENT_CALENDAR.maxDetailPages);
    expect(detailUrls).not.toContain(knownItem?.url);
  });
});
