'use client';

import { useQuery } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/api/source';

import { streamerQueries } from '../../../api';
import { STREAMER_PAGE } from '../../../config';

export const useStreamerPage = (slug: string) =>
  useQuery({
    ...streamerQueries.profile(slug),
    retry: (failures, error) => !isNotFoundError(error) && failures < STREAMER_PAGE.retries
  });
