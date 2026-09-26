'use client';

import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';

import { getTacticBoard } from '@/entities/tactic/board';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { BOARD_PAGE } from '../../../config';

export const useTacticBoardPage = (id: string) => {
  const [token] = useQueryState(BOARD_PAGE.tokenParam, parseAsString);
  const { data, error, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.tactics.board({ id, token }),
    queryFn: ({ signal }) => getTacticBoard({ id, token, signal }),
    retry: (count, failure) => !isNotFoundError(failure) && count < BOARD_PAGE.retries
  });

  const onRetry = () => void refetch();

  return { board: data ?? null, token, isPending, isNotFound: isNotFoundError(error), isError, isFetching, onRetry };
};
