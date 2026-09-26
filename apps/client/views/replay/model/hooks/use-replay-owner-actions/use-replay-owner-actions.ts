'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import type { Replay, ReplayVisibility } from '@/entities/replay/replay';

import { communityErrorKind } from '@/features/community/api-error';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { deleteReplay, updateReplay } from '../../../api';

export const useReplayOwnerActions = (replay: Replay) => {
  const t = useTranslations('replays.owner');
  const queryClient = useQueryClient();
  const router = useRouter();

  const onError = (error: unknown) => {
    toast.error(t(`errors.${communityErrorKind(error)}`));
  };

  const visibility = useMutation({
    mutationFn: (next: ReplayVisibility) => updateReplay({ id: replay.id, visibility: next }),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.replays.detail(replay.id), updated);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.replays.all });
      toast.success(t('visibilitySaved'));
    },
    onError
  });

  const removal = useMutation({
    mutationFn: () => deleteReplay(replay.id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.replays.detail(replay.id) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.replays.all });
      toast.success(t('deleted'));
      router.replace(ROUTES.replays.list);
    },
    onError
  });

  return {
    canManage: replay.isOwner,
    visibility: visibility.isPending && visibility.variables ? visibility.variables : replay.visibility,
    isSaving: visibility.isPending,
    isDeleting: removal.isPending,
    onVisibilityChange: (next: ReplayVisibility) => {
      if (!visibility.isPending && next !== replay.visibility) {
        visibility.mutate(next);
      }
    },
    onDelete: () => removal.mutate()
  };
};
