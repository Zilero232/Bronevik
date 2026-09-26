import { toRoman } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';

import type { PathStepsProps } from './PathSteps.types';

import s from './PathSteps.module.scss';

export const PathSteps = ({ steps }: PathStepsProps) => {
  const t = useTranslations('tree.path');
  const format = useFormatter();

  return (
    <ol aria-label={t('route')} className={s.root}>
      {steps.map(({ vehicle, xp }, index) => (
        <li key={vehicle.tankId} className={s.step} data-premium={vehicle.isPremium}>
          <span className={s.tier}>{toRoman(vehicle.tier)}</span>
          <span className={s.name}>{vehicle.shortName || vehicle.name}</span>
          <span className={s.xp}>{index === 0 || xp === null ? t('start') : format.number(xp)}</span>
        </li>
      ))}
    </ol>
  );
};
