import type { GameEvent } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QUERY_KEYS } from '@/shared/constants';

import { useCurrentEvent } from '../use-current-event';

const NOW = new Date('2026-09-26T12:00:00Z');

const event = (slug: string, startsAt: string, endsAt: string | null): GameEvent => ({
  id: `00000000-0000-4000-8000-${slug.padStart(12, '0')}`,
  slug,
  kind: 'marathon',
  title: slug,
  description: null,
  url: null,
  image: null,
  startsAt,
  endsAt
});

const PAST = event('1', '2026-09-01T00:00:00Z', '2026-09-10T00:00:00Z');
const LONG = event('2', '2026-09-20T00:00:00Z', '2026-10-20T00:00:00Z');
const SHORT = event('3', '2026-09-25T00:00:00Z', '2026-09-28T00:00:00Z');
const OPEN_ENDED = event('4', '2026-09-01T00:00:00Z', null);
const UPCOMING = event('5', '2026-10-01T00:00:00Z', '2026-10-05T00:00:00Z');

const clientWith = (events: GameEvent[]) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  client.setQueryData(QUERY_KEYS.events.calendar, events);

  return client;
};

const renderWith = (events: GameEvent[]) => {
  const client = clientWith(events);
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

  return renderHook(() => useCurrentEvent(), { wrapper }).result.current;
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useCurrentEvent', () => {
  it('features the running event that ends soonest', () => {
    const { event: current, isPending } = renderWith([PAST, LONG, SHORT, OPEN_ENDED, UPCOMING]);

    expect(isPending).toBe(false);
    expect(current?.slug).toBe(SHORT.slug);
  });

  it('features an open-ended event when nothing else is running', () => {
    expect(renderWith([PAST, OPEN_ENDED, UPCOMING]).event?.slug).toBe(OPEN_ENDED.slug);
  });

  it('features nothing between events', () => {
    const { event: current, isPending } = renderWith([PAST, UPCOMING]);

    expect(current).toBeNull();
    expect(isPending).toBe(false);
  });

  it('stays pending with no event while rendering on the server', () => {
    const client = clientWith([SHORT]);
    const Probe = () => {
      const { event: current, isPending } = useCurrentEvent();

      return `${String(isPending)}:${current?.slug ?? 'none'}`;
    };

    expect(renderToString(createElement(QueryClientProvider, { client }, createElement(Probe)))).toBe('true:none');
  });
});
