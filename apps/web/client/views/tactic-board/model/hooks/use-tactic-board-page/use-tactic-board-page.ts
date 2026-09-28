'use client';

import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';

import { getTacticBoard } from '@/entities/tactic/board';
import { QUERY_KEYS } from '@/shared/constants';

import { BOARD_PAGE } from '../../../config';

export const useTacticBoardPage = (id: string) => {
  const [token] = useQueryState(BOARD_PAGE.tokenParam, parseAsString);
  const query = useQuery({
    queryKey: QUERY_KEYS.tactics.board({ id, token }),
    queryFn: ({ signal }) => getTacticBoard({ id, token, signal })
  });

  return { query, token };
};
