'use client';

import { useQuery } from '@tanstack/react-query';

import { listClanEvents } from '@/shared/api/clans';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseClanMovesInput } from './use-clan-moves.types';

import { CLAN_EVENTS } from '../../../config';
import { weeklyMoves } from '../../../lib/event-groups';

export const useClanMoves = ({ clanId, now }: UseClanMovesInput) => {
  const { data: sample, isPending } = useQuery({
    queryKey: QUERY_KEYS.clans.events({ clanId, limit: CLAN_EVENTS.chartSample, offset: 0 }),
    queryFn: ({ signal }) => listClanEvents({ clanId, limit: CLAN_EVENTS.chartSample, offset: 0, signal })
  });

  return {
    moves: sample ? weeklyMoves({ events: sample.items, now, weeks: CLAN_EVENTS.chartWeeks }) : [],
    isPending
  };
};
