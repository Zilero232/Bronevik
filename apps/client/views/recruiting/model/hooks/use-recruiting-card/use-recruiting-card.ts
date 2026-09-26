'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import type { RecruitingPost } from '../../../api';

import { communityErrorKind } from '@/features/community/api-error';
import { useCommunityViewer } from '@/features/community/viewer';
import { closeRecruiting } from '../../../api';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';

import { useViewerClans } from '../use-viewer-clans';

export const useRecruitingCard = (post: RecruitingPost) => {
  const t = useTranslations('recruiting');
  const queryClient = useQueryClient();
  const { ownsAccount } = useCommunityViewer();
  const { isOfficerOf } = useViewerClans();
  const close = useMutation({
    mutationFn: () => closeRecruiting(post.id),
    onSuccess: async () => {
      toast.success(t('toast.closed'));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recruiting.all });
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });

  const isClan = post.kind === 'clan_seeks_player';

  return {
    isClan,
    clanHref: post.clanTag ? ROUTES.clans.detail(post.clanTag) : null,
    profileHref: post.accountId === null ? null : ROUTES.players.profile(post.nickname ?? String(post.accountId)),
    canClose: isClan ? isOfficerOf(post.clanId) : ownsAccount(post.accountId),
    isClosing: close.isPending,
    onClose: () => close.mutate()
  };
};
