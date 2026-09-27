import type { Competition } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { COMPETITION } from '@otmetki/schemas';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { QUERY_KEYS } from '@/shared/constants';

import { useCompetitionsCache } from '../use-competitions-cache';

const COMPETITION_ITEM: Competition = {
  id: '00000000-0000-4000-8000-000000000001',
  slug: 'weekend-brawl',
  title: 'Weekend brawl',
  description: null,
  visibility: 'public',
  mode: 'random',
  battlesPerPlayer: 20,
  minTier: null,
  status: 'upcoming',
  startsAt: '2026-10-01T10:00:00.000Z',
  endsAt: '2026-10-03T10:00:00.000Z',
  teams: 0,
  participants: 0,
  organizer: 'Grom',
  leader: null,
  scoring: COMPETITION.defaultScoring,
  maxTeamSize: 5,
  isOwner: true,
  myTeamId: null,
  inviteCode: null,
  scoredAt: null,
  standings: []
};

const UPDATED: Competition = { ...COMPETITION_ITEM, title: 'Weekend brawl, extended' };

const DETAIL = QUERY_KEYS.competitions.detail({ slug: COMPETITION_ITEM.slug });
const DETAIL_WITH_CODE = QUERY_KEYS.competitions.detail({ slug: COMPETITION_ITEM.slug, code: 'SECRET' });
const OTHER_DETAIL = QUERY_KEYS.competitions.detail({ slug: 'other' });
const LIST = QUERY_KEYS.competitions.list({ status: 'running' });
const MINE = QUERY_KEYS.competitions.list({ mine: true });

const setup = () => {
  const client = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

  return { client, cache: renderHook(() => useCompetitionsCache(), { wrapper }).result.current };
};

describe('useCompetitionsCache', () => {
  it('refreshes every cached view of the saved competition and nothing else', () => {
    const { client, cache } = setup();
    const other = { ...COMPETITION_ITEM, slug: 'other' };

    client.setQueryData(DETAIL, COMPETITION_ITEM);
    client.setQueryData(DETAIL_WITH_CODE, COMPETITION_ITEM);
    client.setQueryData(OTHER_DETAIL, other);

    act(() => {
      cache.storeDetail(UPDATED);
    });

    expect(client.getQueryData(DETAIL)).toEqual(UPDATED);
    expect(client.getQueryData(DETAIL_WITH_CODE)).toEqual(UPDATED);
    expect(client.getQueryData(OTHER_DETAIL)).toEqual(other);
  });

  it('marks every competition list stale', async () => {
    const { client, cache } = setup();

    client.setQueryData(LIST, []);
    client.setQueryData(MINE, []);
    client.setQueryData(DETAIL, COMPETITION_ITEM);

    await act(() => cache.invalidateLists());

    expect(client.getQueryState(LIST)?.isInvalidated).toBe(true);
    expect(client.getQueryState(MINE)?.isInvalidated).toBe(true);
    expect(client.getQueryState(DETAIL)?.isInvalidated).toBe(false);
  });

  it('forgets every cached view of a deleted competition', () => {
    const { client, cache } = setup();

    client.setQueryData(DETAIL, COMPETITION_ITEM);
    client.setQueryData(DETAIL_WITH_CODE, COMPETITION_ITEM);
    client.setQueryData(OTHER_DETAIL, COMPETITION_ITEM);

    act(() => cache.forgetDetail(COMPETITION_ITEM.slug));

    expect(client.getQueryData(DETAIL)).toBeUndefined();
    expect(client.getQueryData(DETAIL_WITH_CODE)).toBeUndefined();
    expect(client.getQueryData(OTHER_DETAIL)).toEqual(COMPETITION_ITEM);
  });
});
