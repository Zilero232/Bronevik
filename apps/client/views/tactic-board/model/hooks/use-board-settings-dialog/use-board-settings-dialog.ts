'use client';

import { useState } from 'react';

import type { BoardSettingsPayload } from '@/features/community/tactic-board-settings';

import { toBoardSettingsValues } from '@/features/community/tactic-board-settings';

import type { UseUpdateBoardInput } from '../use-update-board';

import { useUpdateBoard } from '../use-update-board';

export const useBoardSettingsDialog = ({ board, token }: UseUpdateBoardInput) => {
  const [isOpen, setIsOpen] = useState(false);
  const update = useUpdateBoard({ board, token });

  const onSubmit = async (payload: BoardSettingsPayload) => {
    await update.mutateAsync({ ...payload, arenaId: payload.arenaId ?? null, mode: payload.mode ?? null });
    setIsOpen(false);
  };

  return { isOpen, onOpenChange: setIsOpen, defaultValues: toBoardSettingsValues(board), onSubmit };
};
