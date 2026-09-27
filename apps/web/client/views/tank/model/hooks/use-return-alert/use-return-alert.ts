'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { isIncludedIn } from 'remeda';
import { toast } from 'sonner';

import { usePlus } from '@/features/plus/plus-gate';
import { isPlusRequiredError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { addFollow, getFollows, removeFollow } from '../../../api';
import { RETURN_ALERT } from '../../../config';
import { useTank } from '../../context';

export const useReturnAlert = () => {
  const t = useTranslations('tank.obtain.returnAlert');
  const queryClient = useQueryClient();
  const { detail, tankId } = useTank();
  const { isSignedIn, isPlus, isPending: isPlusPending } = usePlus();
  const { data: follows, isPending: isFollowsPending } = useQuery({
    queryKey: QUERY_KEYS.social.follows,
    queryFn: getFollows,
    enabled: isPlus
  });

  const follow = follows?.find((item) => item.kind === RETURN_ALERT.followKind && item.targetId === tankId);

  const toggle = useMutation({
    mutationFn: async (next: boolean) => {
      if (!next && follow) {
        await removeFollow(follow.id);

        return;
      }

      if (next && !follow) {
        await addFollow({ kind: RETURN_ALERT.followKind, targetId: tankId });
      }
    },
    onSuccess: (_result, next) => {
      toast.success(next ? t('enabled') : t('disabled'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.social.follows });
    },
    onError: (error) => toast.error(isPlusRequiredError(error) ? t('limit') : t('failed'))
  });

  const onToggle = (next: boolean) => toggle.mutate(next);

  return {
    isVisible: isIncludedIn(detail.obtain.status, RETURN_ALERT.statuses),
    isSignedIn,
    isPlus,
    isOn: Boolean(follow),
    isPending: isPlusPending || (isPlus && isFollowsPending),
    onToggle
  };
};
