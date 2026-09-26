'use client';

import { useTranslations } from 'next-intl';

import type { TacticBoardVisibility } from '@/entities/tactic/board';
import type { SelectItem } from '@/ui-kit';

import { TACTIC_VISIBILITIES, useTacticMaps } from '@/features/community/tactic-board-settings';

import type { UseUpdateBoardInput } from '../use-update-board';

import { useUpdateBoard } from '../use-update-board';

export const useBoardHeader = ({ board, token }: UseUpdateBoardInput) => {
  const t = useTranslations('tactics.visibility');
  const { mapOf, modeLabel, camouflageLabel } = useTacticMaps();
  const update = useUpdateBoard({ board, token });

  const map = mapOf(board.arenaId);
  const visibilityItems: SelectItem<TacticBoardVisibility>[] = TACTIC_VISIBILITIES.map((value) => ({ value, label: t(value) }));

  const onVisibilityChange = (visibility: TacticBoardVisibility) => {
    if (visibility !== board.visibility) {
      update.mutate({ visibility });
    }
  };

  return {
    isOwner: board.role === 'owner',
    mapName: map?.name ?? board.arenaId,
    camouflage: map?.camouflage ? camouflageLabel(map.camouflage) : null,
    modeName: board.mode ? modeLabel(board.mode) : null,
    visibilityItems,
    onVisibilityChange
  };
};
