'use client';

import type { PlayerSearchResult } from '@otmetki/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { communityErrorKind } from '@/features/community/api-error';
import { QUERY_KEYS } from '@/shared/constants';

import type { WorkspaceScope } from '../../../api';

import { addCandidate } from '../../../api';

export const useAddCandidate = ({ clanId }: WorkspaceScope) => {
  const t = useTranslations('clanWorkspace');
  const queryClient = useQueryClient();
  const add = useMutation({
    mutationFn: ({ accountId }: PlayerSearchResult) => addCandidate({ clanId, candidate: { accountId } }),
    onSuccess: async (_, { nickname }) => {
      toast.success(t('recruits.added', { nickname }));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clanWorkspace.all(clanId) });
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });

  return {
    isAdding: add.isPending,
    onPick: (player: PlayerSearchResult) => add.mutate(player)
  };
};
