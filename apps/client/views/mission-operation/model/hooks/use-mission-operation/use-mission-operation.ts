'use client';

import type { MissionProgress, UpdateMissionProgressInput } from '@otmetki/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuthSession } from '@/entities/auth/session';
import { getMissionOperation, getMissionProgress } from '@/entities/mission/mission';
import { QUERY_KEYS } from '@/shared/constants';

import type { OperationColumn } from './use-mission-operation.types';

import { updateMissionProgress } from '../../../api';
import { doneCount, missionNodes } from '../../../lib/mission-nodes';
import { useBranchLabel } from '../use-branch-label';

export const useMissionOperation = () => {
  const params = useParams<{ campaign: string; operation: string }>();
  const t = useTranslations('missions.operation');
  const queryClient = useQueryClient();
  const { data: session } = useAuthSession();
  const branchLabel = useBranchLabel();
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
  const isTracked = isSignedIn && progress.isSuccess;

  const columns = (detail.data?.branches ?? []).map((branch): OperationColumn => {
    const nodes = missionNodes({ missions: branch.missions, progress: items, isTracked });

    return { branch, label: branchLabel(branch.key), nodes, done: doneCount(nodes) };
  });

  const allNodes = columns.flatMap((column) => column.nodes);
  const selected =
    allNodes.find((node) => node.mission.questId === questId) ?? allNodes.find((node) => node.state === 'current') ?? allNodes[0] ?? null;

  const totals = {
    done: allNodes.filter((node) => node.state === 'done' || node.state === 'honors').length,
    honors: allNodes.filter((node) => node.state === 'honors').length
  };

  return {
    detail,
    columns,
    mission: selected?.mission ?? null,
    totals,
    isSignedIn,
    isTracked,
    isSaving: save.isPending,
    progressOf: (id: number) => items.get(id) ?? null,
    selectMission: setQuestId,
    setProgress: (input: UpdateMissionProgressInput) => save.mutate(input)
  };
};
