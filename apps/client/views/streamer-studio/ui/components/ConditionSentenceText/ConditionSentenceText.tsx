'use client';

import { clsx } from 'clsx';

import type { ConditionSentenceTextProps } from './ConditionSentenceText.types';

import { useConditionSentence } from '../../../model/hooks';

import s from './ConditionSentenceText.module.scss';

export const ConditionSentenceText = ({ condition, className }: ConditionSentenceTextProps) => {
  const { lead, goal, filters } = useConditionSentence(condition);

  return (
    <p className={clsx(s.root, className)}>
      <span className={s.lead}>{lead}</span> <span className={s.goal}>{goal}</span>
      {filters && ` ${filters}`}
    </p>
  );
};
