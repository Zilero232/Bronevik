'use client';

import { match, P } from 'ts-pattern';

import { usePlayerProfile } from '@/entities/player/profile';
import { isNotFoundError } from '@/shared/api/source';

import type { SessionPageStatus } from './use-session-page.types';

export const useSessionPage = (nickname: string) => {
  const { data: profile, error, isRefetching, refetch } = usePlayerProfile(nickname);

  const status = match({ profile, error })
    .returnType<SessionPageStatus>()
    .with({ profile: P.nonNullable }, () => 'ready')
    .with({ error: P.when(isNotFoundError) }, () => 'missing')
    .with({ error: P.nonNullable }, () => 'error')
    .otherwise(() => 'loading');

  return {
    summary: profile?.summary,
    status,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
