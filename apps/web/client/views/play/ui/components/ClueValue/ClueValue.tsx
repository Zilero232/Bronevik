'use client';

import { toRoman } from '@otmetki/icons';
import { match } from 'ts-pattern';

import { NationLabel } from '@/ui-kit';

import type { ClueValueProps } from './ClueValue.types';

import { useClueValues } from '../../../model/hooks';

import s from './ClueValue.module.scss';

export const ClueValue = ({ clue }: ClueValueProps) => {
  const { target, shell, health, letter } = useClueValues();

  return match(clue)
    .with('tier', () => <span className={s.strong}>{toRoman(target.tier)}</span>)
    .with('nation', () => <NationLabel nation={target.nation} />)
    .with('shell', () => <span>{shell}</span>)
    .with('health', () => <span>{health}</span>)
    .with('letter', () => <span className={s.strong}>{letter}</span>)
    .exhaustive();
};
