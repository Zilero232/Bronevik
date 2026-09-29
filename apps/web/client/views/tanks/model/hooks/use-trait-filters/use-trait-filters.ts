'use client';

import type { LearningDifficulty, TankStatus } from '@otmetki/schemas';

import { LEARNING_DIFFICULTIES, TANK_STATUSES } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { useTanksState } from '../use-tanks-state';

export const useTraitFilters = () => {
  const t = useTranslations('tankTraits');
  const [{ statuses, difficulties }, setState] = useTanksState();

  const statusOptions = TANK_STATUSES.map((value) => ({ value, label: t(`status.${value}`) }));
  const difficultyOptions = LEARNING_DIFFICULTIES.map((value) => ({ value, label: t(`difficulty.${value}`) }));

  const onStatusesChange = (next: TankStatus[]) => {
    void setState({ statuses: next.length > 0 ? next : null });
  };

  const onDifficultiesChange = (next: LearningDifficulty[]) => {
    void setState({ difficulties: next.length > 0 ? next : null });
  };

  return { statuses, statusOptions, difficulties, difficultyOptions, onStatusesChange, onDifficultiesChange };
};
