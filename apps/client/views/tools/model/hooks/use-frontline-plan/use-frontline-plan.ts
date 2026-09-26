'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { sortBy } from 'remeda';

import type { FrontlineResultItem, FrontlineValues } from './use-frontline-plan.types';

import { FRONTLINE_GAME, FRONTLINE_RESERVES } from '../../../config';
import { frontlinePlan } from '../../../lib/frontline';

export const useFrontlinePlan = (values: FrontlineValues) => {
  const t = useTranslations('tools.frontline');
  const format = useFormatter();

  const targetPrestige = values.targetPrestige ?? 0;
  const plan = frontlinePlan({
    level: values.level ?? 1,
    levelXp: values.levelXp ?? 0,
    battleXp: values.battleXp ?? 0,
    prestige: values.prestige ?? 0,
    targetPrestige,
    battlesPerDay: values.battlesPerDay
  });

  const battles = (count: number | null) => (count === null ? '—' : t('battlesValue', { count }));

  const items: FrontlineResultItem[] = [
    { key: 'next', label: t('toNext'), value: plan.isMaxLevel ? t('maxReached') : battles(plan.battlesToNext) },
    { key: 'xpToMax', label: t('xpToMax'), value: format.number(plan.xpToMax) },
    { key: 'target', label: t('toTarget', { prestige: targetPrestige }), value: battles(plan.battlesToTarget) },
    { key: 'days', label: t('daysToTarget'), value: plan.daysToTarget === null ? '—' : t('daysValue', { count: plan.daysToTarget }) },
    {
      key: 'reserve',
      label: t('nextReserve'),
      value: plan.nextReserve
        ? t('nextReserveValue', { reserve: t(`reserves.${plan.nextReserve.reserve}`), level: plan.nextReserve.level })
        : t('allReserves'),
      tone: plan.nextReserve ? 'neutral' : 'good'
    }
  ];

  const reserves = sortBy([...FRONTLINE_RESERVES], (reserve) => FRONTLINE_GAME.reserveUnlockLevel[reserve]).map((reserve) => ({
    reserve,
    level: FRONTLINE_GAME.reserveUnlockLevel[reserve],
    isUnlocked: plan.unlocked.includes(reserve)
  }));

  return {
    plan,
    items,
    reserves,
    progress: (plan.level - 1) / (FRONTLINE_GAME.maxLevel - 1),
    maxLevel: FRONTLINE_GAME.maxLevel
  };
};
