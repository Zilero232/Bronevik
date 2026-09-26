'use client';

import type { ChallengeCondition } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import { useVehicleCatalog } from '@/features/tank/pick-tank';

import { buildConditionSentence, renderConditionSentence } from '../../../lib/condition-sentence';

export const useConditionSentence = (condition: ChallengeCondition) => {
  const t = useTranslations('streamer.challenges.sentence');
  const { data: vehicles } = useVehicleCatalog();

  const tankName = vehicles?.find(({ tankId }) => tankId === condition.tankId)?.name ?? null;

  return renderConditionSentence({ sentence: buildConditionSentence({ condition, tankName }), translate: (key, values) => t(key, values) });
};
