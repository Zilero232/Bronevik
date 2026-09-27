import type { WebhookFilter } from '@otmetki/schemas';

import type { MatchesSubjectInput } from './webhook-match.types';

import { storedFilterSchema } from './webhook-match.schemas';

export const readWebhookFilter = (value: unknown): Required<WebhookFilter> => storedFilterSchema.parse(value ?? {});

export const matchesSubject = ({ filter, subject }: MatchesSubjectInput): boolean => {
  const { accountIds, clanIds } = readWebhookFilter(filter);

  if (subject.accountIds.some((accountId) => accountIds.includes(accountId))) {
    return true;
  }

  return subject.clanIds.some((clanId) => clanIds.includes(clanId));
};
