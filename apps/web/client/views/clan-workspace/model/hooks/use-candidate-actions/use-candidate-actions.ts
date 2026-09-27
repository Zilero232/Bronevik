'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { communityErrorKind } from '@/features/community/api-error';
import { QUERY_KEYS } from '@/shared/constants';

import type { CandidateStatus, UpdateCandidateInput } from '../../../api';
import type { UseCandidateActionsInput } from './use-candidate-actions.types';

import { removeCandidate, updateCandidate } from '../../../api';
import { CANDIDATE_STATUSES } from '../../../config';
import { candidateNickname } from '../../../lib/candidate-notes';

export const useCandidateActions = ({ clanId, candidate }: UseCandidateActionsInput) => {
  const t = useTranslations('clanWorkspace');
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clanWorkspace.all(clanId) });
  const onError = (error: Error) => toast.error(t(`errors.${communityErrorKind(error)}`));
  const update = useMutation({
    mutationFn: (patch: UpdateCandidateInput['patch']) => updateCandidate({ clanId, id: candidate.id, patch }),
    onSuccess: async (_, patch) => {
      toast.success(patch.refreshStats ? t('recruits.refreshed') : t('recruits.saved'));
      await refresh();
    },
    onError
  });

  const remove = useMutation({
    mutationFn: () => removeCandidate({ clanId, id: candidate.id }),
    onSuccess: async () => {
      toast.success(t('recruits.removed'));
      await refresh();
    },
    onError
  });

  const name = candidateNickname(candidate) ?? t('recruits.unknown', { id: candidate.accountId });

  return {
    name,
    statuses: CANDIDATE_STATUSES.map((status) => ({ value: status, label: t(`candidates.${status}`) })),
    isUpdating: update.isPending,
    isRemoving: remove.isPending,
    onStatusChange: (status: CandidateStatus) => {
      if (status !== candidate.status) {
        update.mutate({ status });
      }
    },
    onRefresh: () => update.mutate({ refreshStats: true }),
    onRemove: () => remove.mutate()
  };
};
