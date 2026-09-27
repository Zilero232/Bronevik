'use client';

import { useIssueCode } from '../use-issue-code';
import { useLinkCelebration } from '../use-link-celebration';
import { useTelegramStatus } from '../use-telegram-status';

export const useTelegramLinkPage = () => {
  const issue = useIssueCode();
  const query = useTelegramStatus(Boolean(issue.data));
  const status = query.data;

  useLinkCelebration({ isLinked: status?.isLinked, onLinked: issue.reset });

  return {
    query,
    botUsername: status?.botUsername ?? null,
    code: issue.data,
    issuedAt: issue.submittedAt,
    isIssuing: issue.isPending,
    onIssue: () => issue.mutate()
  };
};
