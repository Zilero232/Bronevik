'use client';

import { useQuery } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/api/source';

import { playerQueries } from '../../../api';

const RETRY_LIMIT = 1;

export const usePlayerProfile = (idOrNick: string) =>
  useQuery({
    ...playerQueries.profile(idOrNick),
    retry: (failures, error) => !isNotFoundError(error) && failures < RETRY_LIMIT
  });
