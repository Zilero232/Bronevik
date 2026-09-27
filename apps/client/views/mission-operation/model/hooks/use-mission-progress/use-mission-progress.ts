'use client';

import type { MissionProgress } from '@otmetki/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAuthSession } from '@/entities/auth/session';
import { missionQueries } from '@/entities/mission/mission';
import { QUERY_KEYS } from '@/shared/constants';

import { updateMissionProgress } from '../../../api';

export const useMissionProgress = () => {
  const t = useTranslations('missions.operation');
  const queryClient = useQueryClient();
  const { data: session } = useAuthSession();
  const isSignedIn = Boolean(session);
  const progress = useQuery(missionQueries.progress(isSignedIn));

  const save = useMutation({
    mutationFn: updateMissionProgress,
    onSuccess: (item) => {
      queryClient.setQueryData<MissionProgress>(QUERY_KEYS.missions.progress, (current) => ({
        items: [...(current?.items ?? []).filter((entry) => entry.questId !== item.questId), item]
      }));

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.missions.plans });
    },
    onError: () => toast.error(t('saveFailed'))
  });

  const items = new Map((progress.data?.items ?? []).map((item) => [item.questId, item]));

  return {
    items,
    isSignedIn,
    isTracked: isSignedIn && progress.isSuccess,
    isSaving: save.isPending,
    progressOf: (questId: number) => items.get(questId) ?? null,
    setProgress: save.mutate
  };
};
