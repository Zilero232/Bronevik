'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { differenceInMinutes } from 'date-fns';

import { ROUTES } from '@/shared/constants';

import type { UseSessionHeaderInput } from './use-session-header.types';

export const useSessionHeader = ({ session, nickname }: UseSessionHeaderInput) => {
  const { copied, copy } = useCopy();

  const { id, startedAt, endedAt } = session;

  return {
    isCopied: copied,
    minutes: endedAt ? differenceInMinutes(new Date(endedAt), new Date(startedAt)) : null,
    onShare: () => copy(new URL(ROUTES.playerSession({ nickname, sessionId: id }), window.location.origin).toString())
  };
};
