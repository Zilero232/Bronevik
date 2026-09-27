'use client';

import type { Competition } from '@otmetki/schemas';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useCompetitionsCache } from '@/entities/competition/competition';
import { communityErrorKind } from '@/features/community/api-error';
import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { deleteCompetition } from '../../../api';
import { inviteLink } from '../../../lib/competition-view';

export const useOwnerActions = (competition: Competition) => {
  const t = useTranslations('competitions');
  const router = useRouter();
  const { forgetDetail, invalidateLists } = useCompetitionsCache();
  const remove = useMutation({
    mutationFn: () => deleteCompetition(competition.id),
    onSuccess: async () => {
      toast.success(t('toast.deleted'));
      router.push(ROUTES.tournaments.points);
      forgetDetail(competition.slug);
      await invalidateLists();
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });

  return {
    isOwner: competition.isOwner,
    inviteLink: inviteLink({ slug: competition.slug, inviteCode: competition.inviteCode }),
    isDeleting: remove.isPending,
    onDelete: () => remove.mutate()
  };
};
