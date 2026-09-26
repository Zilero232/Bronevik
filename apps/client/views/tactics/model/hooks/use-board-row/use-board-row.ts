'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import type { TacticBoard } from '@/shared/api/tactics';

import { useTacticMaps } from '@/features/community/tactic-board-settings';
import { removeTacticBoard } from '@/shared/api/tactics';
import { QUERY_KEYS } from '@/shared/constants';

import { boardSummary } from '../../../lib/board-summary';

export const useBoardRow = (board: TacticBoard) => {
  const t = useTranslations('tactics.toast');
  const queryClient = useQueryClient();
  const { mapOf, modeLabel } = useTacticMaps();
  const [isConfirming, setIsConfirming] = useState(false);
  const remove = useMutation({
    mutationFn: removeTacticBoard,
    onSuccess: () => {
      toast.success(t('deleted'));
      setIsConfirming(false);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tactics.mine });
    },
    onError: () => toast.error(t('failed'))
  });

  const onDelete = () => remove.mutate(board.id);

  return {
    mapName: mapOf(board.arenaId)?.name ?? board.arenaId,
    modeName: board.mode ? modeLabel(board.mode) : null,
    summary: boardSummary(board.data),
    isConfirming,
    isDeleting: remove.isPending,
    onConfirmChange: setIsConfirming,
    onDelete
  };
};
