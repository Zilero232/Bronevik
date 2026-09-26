import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ClassIcon, NationLabel, TierNumeral } from '@/ui-kit';

import type { BreakdownKeyCellProps } from './BreakdownKeyCell.types';

import { vehicleClassOf } from '../../../../../lib/breakdown-key';

import s from './BreakdownKeyCell.module.scss';

export const BreakdownKeyCell = ({ dimension, value }: BreakdownKeyCellProps) => {
  const t = useTranslations('game.classes');
  const vehicleClass = vehicleClassOf(value);

  return (
    <span className={s.root}>
      {match(dimension)
        .with('byTier', () => <TierNumeral tier={Number(value)} />)
        .with('byNation', () => <NationLabel nation={value} />)
        .with('byClass', () =>
          vehicleClass ? (
            <>
              <ClassIcon size={16} tankClass={vehicleClass} />
              {t(vehicleClass)}
            </>
          ) : (
            value
          )
        )
        .exhaustive()}
    </span>
  );
};
