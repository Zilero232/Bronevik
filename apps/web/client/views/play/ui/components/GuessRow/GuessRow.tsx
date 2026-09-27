'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { ClassIcon, NationLabel } from '@/ui-kit';

import type { GuessRowProps } from './GuessRow.types';

import { GUESS_CELLS } from '../../../config';
import { useGuessRow } from '../../../model/hooks';
import { GuessCell } from '../GuessCell';

import s from './GuessRow.module.scss';

export const GuessRow = ({ entry }: GuessRowProps) => {
  const t = useTranslations('play.grid');
  const { vehicle, text, short } = useGuessRow(entry);

  return (
    <li className={s.root} data-correct={entry.feedback.isCorrect}>
      <TankIdentity className={s.name} image='small' tank={vehicleIdentity(vehicle)} />
      {GUESS_CELLS.map((key) => (
        <GuessCell key={key} hint={entry.feedback.cells[key]} label={t(`columns.${key}`)} text={text[key]}>
          {match(key)
            .with('type', () => <ClassIcon size={18} tankClass={vehicle.type} />)
            .with('nation', () => <NationLabel nation={vehicle.nation} size={20} withName={false} />)
            .with('tier', 'premium', 'damage', 'winRate', (cell) => short[cell])
            .exhaustive()}
        </GuessCell>
      ))}
    </li>
  );
};
