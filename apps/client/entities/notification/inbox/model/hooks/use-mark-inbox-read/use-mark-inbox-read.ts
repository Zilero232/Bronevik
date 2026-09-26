'use client';

import type { InboxPage, MarkReadInput } from '@bronevik/schemas';
import type { InfiniteData } from '@tanstack/react-query';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { markInboxRead } from '@/shared/api/notifications';

import { INBOX_QUERY } from '../../../config';
import { readInboxPage } from '../../../lib/read-inbox-page';

export const useMarkInboxRead = () => {
  const t = useTranslations('inbox');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markInboxRead,
    onMutate: async ({ ids }: MarkReadInput) => {
      await queryClient.cancelQueries({ queryKey: INBOX_QUERY.all });

      const snapshot = queryClient.getQueriesData({ queryKey: INBOX_QUERY.all });
      const readAt = new Date().toISOString();

      queryClient.setQueriesData<InboxPage>({ queryKey: INBOX_QUERY.preview }, (page) => page && readInboxPage({ page, ids, readAt }));

      queryClient.setQueriesData<InfiniteData<InboxPage>>(
        { queryKey: INBOX_QUERY.feed },
        (data) => data && { ...data, pages: data.pages.map((page) => readInboxPage({ page, ids, readAt })) }
      );

      return { snapshot };
    },
    onError: (_error, _input, context) => {
      context?.snapshot.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
      toast.error(t('failed'));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: INBOX_QUERY.all })
  });
};
