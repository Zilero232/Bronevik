import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type { InboxFeedQueryInput, InboxPreviewQueryInput } from './inbox-queries.types';

import { INBOX_QUERY } from '../../config';
import { getInbox } from '../notifications';

export const inboxQueries = {
  preview: ({ limit }: InboxPreviewQueryInput) =>
    queryOptions({
      queryKey: INBOX_QUERY.preview,
      queryFn: ({ signal }) => getInbox({ limit, signal })
    }),
  feed: ({ pageSize }: InboxFeedQueryInput) =>
    infiniteQueryOptions({
      queryKey: INBOX_QUERY.feed,
      queryFn: ({ pageParam, signal }) => getInbox({ limit: pageSize, before: pageParam || undefined, signal }),
      initialPageParam: '',
      getNextPageParam: ({ items }) => (items.length < pageSize ? undefined : items.at(-1)?.createdAt)
    })
};
