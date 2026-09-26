'use client';

import type { MissionProgress, UpdateMissionProgressInput } from '@otmetki/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuthSession } from '@/entities/auth/session';
import { getMissionOperation, getMissionProgress } from '@/entities/mission/mission';
import { updateMissionProgress } from '../../../api';
import { QUERY_KEYS } from '@/shared/constants';

import { useBranchLabel } from '../use-branch-label';

export const useMissionOperation = () => {
  const params = useParams<{ campaign: string; operation: string }>();
  const t = useTranslations('missions.operation');
  const queryClient = useQueryClient();
  const { data: session } = useAuthSession();
  const branchLabel = useBranchLabel();
  const [chainId, setChainId] = useState<number | null>(null);
  const [questId, setQuestId] = useState<number | null>(null);

  const campaign = Number(params.campaign);
  const operation = Number(params.operation);
  const isSignedIn = Boolean(session);

  const detail = useQuery({
    queryKey: QUERY_KEYS.missions.operation({ campaign, operation }),
    queryFn: ({ signal }) => getMissionOperation({ campaign, operation, signal }),
    retry: false
  });

  const progress = useQuery({
    queryKey: QUERY_KEYS.missions.progress,
    queryFn: ({ signal }) => getMissionProgress({ signal }),
    enabled: isSignedIn,
    retry: false
  });

  const save = useMutation({
    mutationFn: (input: UpdateMissionProgressInput) => updateMissionProgress(input),
    onSuccess: (item) => {
      queryClient.setQueryData<MissionProgress>(QUERY_KEYS.missions.progress, (current) => ({
        items: [...(current?.items ?? []).filter((entry) => entry.questId !== item.questId), item]
      }));

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.missions.plans });
    },
    onError: () => toast.error(t('saveFailed'))
  });

  const items = new Map((progress.data?.items ?? []).map((item) => [item.questId, item]));
  const branches = detail.data?.branches ?? [];
  const branch = branches.find((entry) => entry.chainId === chainId) ?? branches[0] ?? null;
  const missions = branch?.missions ?? [];
  const mission =
    missions.find((entry) => entry.questId === questId) ?? missions.find((entry) => !items.get(entry.questId)?.done) ?? missions[0] ?? null;

  const questIds = branches.flatMap((entry) => entry.missions.map((item) => item.questId));
  const totals = {
    done: questIds.filter((id) => items.get(id)?.done).length,
    honors: questIds.filter((id) => items.get(id)?.honors).length
  };

  return {
    detail,
    branch,
    branchLabel,
    mission,
    totals,
    isSignedIn,
    isSaving: save.isPending,
    progressOf: (id: number) => items.get(id) ?? null,
    selectBranch: (value: string) => {
      setChainId(Number(value));
      setQuestId(null);
    },
    selectMission: setQuestId,
    setProgress: (input: UpdateMissionProgressInput) => save.mutate(input)
  };
};
