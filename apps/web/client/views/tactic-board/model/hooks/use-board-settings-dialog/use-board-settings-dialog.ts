'use client';

import { useBoolean } from '@siberiacancode/reactuse';

import type { BoardSettingsPayload } from '@/features/community/tactic-board-settings';

import { toBoardSettingsValues } from '@/features/community/tactic-board-settings';

import type { UseUpdateBoardInput } from '../use-update-board';

import { useUpdateBoard } from '../use-update-board';

export const useBoardSettingsDialog = ({ board, token }: UseUpdateBoardInput) => {
  const [isOpen, setOpen] = useBoolean(false);
  const update = useUpdateBoard({ board, token });

  const onSubmit = async (payload: BoardSettingsPayload) => {
    await update.mutateAsync({ ...payload, arenaId: payload.arenaId ?? null, mode: payload.mode ?? null });
    setOpen(false);
  };

  return { isOpen, onOpenChange: setOpen, defaultValues: toBoardSettingsValues(board), onSubmit };
};
