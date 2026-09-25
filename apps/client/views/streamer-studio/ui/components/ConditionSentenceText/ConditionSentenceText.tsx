'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { useVehicleCatalog } from '@/features/tank/pick-tank';

import type { SentencePart } from '../../../lib/condition-sentence';
import type { ConditionSentenceTextProps } from './ConditionSentenceText.types';

import { buildConditionSentence } from '../../../lib/condition-sentence';

import s from './ConditionSentenceText.module.scss';

export const ConditionSentenceText = ({ condition, className }: ConditionSentenceTextProps) => {
  const t = useTranslations('streamer.challenges.sentence');
  const { data: vehicles } = useVehicleCatalog();

  const tankName = vehicles?.find(({ tankId }) => tankId === condition.tankId)?.name ?? null;
  const { lead, goal, filters } = buildConditionSentence({ condition, tankName });
  const say = ({ key, values }: SentencePart) => t(key, values);

  return (
    <p className={clsx(s.root, className)}>
      <span className={s.lead}>{say(lead)}</span> <span className={s.goal}>{goal.map(say).join(' ')}</span>
      {filters.length > 0 && ` ${filters.map(say).join(', ')}`}
    </p>
  );
};
