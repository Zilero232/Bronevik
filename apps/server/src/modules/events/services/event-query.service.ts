import type { GameEventsQuery, GameEvent as GameEventView } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';
import { addDays, subDays } from 'date-fns';

import { PrismaService } from '../../../core';
import { EVENT_CALENDAR } from '../config';
import { EVENT_KIND_TO_DB, toEventView } from '../lib/event-kind';

@Injectable()
export class EventQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async calendar({ kind, from, to }: GameEventsQuery): Promise<GameEventView[]> {
    const now = new Date();
    const start = from ? new Date(from) : subDays(now, EVENT_CALENDAR.defaultWindowDays);
    const end = to ? new Date(to) : addDays(now, EVENT_CALENDAR.defaultWindowDays);
    const events = await this.prisma.gameEvent.findMany({
      where: {
        ...(kind ? { kind: EVENT_KIND_TO_DB[kind] } : {}),
        startsAt: { lte: end },
        OR: [{ endsAt: null, startsAt: { gte: start } }, { endsAt: { gte: start } }]
      },
      orderBy: { startsAt: 'asc' }
    });

    return events.map(toEventView);
  }

  async activeDrops(): Promise<GameEventView[]> {
    const now = new Date();
    const since = subDays(now, EVENT_CALENDAR.newsLookbackDays);
    const events = await this.prisma.gameEvent.findMany({
      where: { kind: 'drops', OR: [{ endsAt: { gte: now } }, { endsAt: null, startsAt: { gte: since } }] },
      orderBy: { startsAt: 'desc' }
    });

    return events.map(toEventView);
  }
}
