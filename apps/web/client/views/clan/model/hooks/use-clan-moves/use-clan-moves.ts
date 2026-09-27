'use client';

import { useQuery } from '@tanstack/react-query';
import { sumBy } from 'remeda';

import { listClanEvents } from '@/entities/clan/clan';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseClanMovesInput } from './use-clan-moves.types';

import { CLAN_EVENTS } from '../../../config';
import { weeklyMoves } from '../../../lib/event-groups';

export const useClanMoves = ({ clanId, now }: UseClanMovesInput) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.clans.events({ clanId, limit: CLAN_EVENTS.chartSample, offset: 0 }),
    queryFn: ({ signal }) => listClanEvents({ clanId, limit: CLAN_EVENTS.chartSample, offset: 0, signal })
  });

  const { data: events } = query;
  const moves = events ? weeklyMoves({ events: events.items, now, weeks: CLAN_EVENTS.chartWeeks }) : [];
  const joined = sumBy(moves, (week) => week.joined);
  const left = sumBy(moves, (week) => week.left);

  return {
    moves,
    totals: { joined, left, net: joined - left },
    query
  };
};
