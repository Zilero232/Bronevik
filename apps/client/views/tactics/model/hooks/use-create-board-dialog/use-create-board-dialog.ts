'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import type { BoardSettingsPayload } from '@/features/community/tactic-board-settings';

import { toBoardSettingsValues } from '@/features/community/tactic-board-settings';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { createTacticBoard } from '../../../api';

export const useCreateBoardDialog = () => {
  const t = useTranslations('tactics.toast');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const create = useMutation({
    mutationFn: createTacticBoard,
    onSuccess: (board) => {
      toast.success(t('created'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tactics.mine });
      setIsOpen(false);
      router.push(ROUTES.tactics.board(board.id));
    }
  });

  const onSubmit = (payload: BoardSettingsPayload) => create.mutateAsync(payload);

  return { isOpen, onOpenChange: setIsOpen, defaultValues: toBoardSettingsValues(null), onSubmit };
};
