'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import type { UpdateTacticBoard } from '@/entities/tactic/board';

import { updateTacticBoard } from '../../../api';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseUpdateBoardInput } from './use-update-board.types';

export const useUpdateBoard = ({ board, token }: UseUpdateBoardInput) => {
  const t = useTranslations('tactics.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: UpdateTacticBoard) => updateTacticBoard({ id: board.id, token, patch }),
    onSuccess: (next) => {
      queryClient.setQueryData(QUERY_KEYS.tactics.board({ id: board.id, token }), next);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tactics.mine });
      toast.success(t('saved'));
    },
    onError: () => toast.error(t('failed'))
  });
};
