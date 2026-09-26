'use client';

import { useIssueCode } from '../use-issue-code';
import { useLinkCelebration } from '../use-link-celebration';
import { useTelegramStatus } from '../use-telegram-status';

export const useTelegramLinkPage = () => {
  const issue = useIssueCode();
  const { data: status, isPending, isError, isFetching, refetch } = useTelegramStatus(Boolean(issue.data));

  useLinkCelebration({ isLinked: status?.isLinked, onLinked: issue.reset });

  return {
    status,
    botUsername: status?.botUsername ?? null,
    isPending,
    isFailed: isError && !status,
    isRetrying: isFetching,
    retry: () => void refetch(),
    code: issue.data,
    issuedAt: issue.submittedAt,
    isIssuing: issue.isPending,
    onIssue: () => issue.mutate()
  };
};
