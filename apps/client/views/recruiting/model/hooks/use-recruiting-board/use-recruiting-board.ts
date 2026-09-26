'use client';

import type { RecruitingKind } from '../../../api';

import { listRecruiting } from '../../../api';
import { QUERY_KEYS } from '@/shared/constants';
import { useOffsetInfiniteList } from '@/shared/lib';

import { RECRUITING_BOARD } from '../../../config';

export const useRecruitingBoard = (kind: RecruitingKind) =>
  useOffsetInfiniteList({
    queryKey: QUERY_KEYS.recruiting.list({ kind, limit: RECRUITING_BOARD.pageSize }),
    queryFn: ({ offset, signal }) => listRecruiting({ kind, limit: RECRUITING_BOARD.pageSize, offset, signal })
  });
