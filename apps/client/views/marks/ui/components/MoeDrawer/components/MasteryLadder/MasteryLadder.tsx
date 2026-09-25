'use client';

import { MasteryIcon } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { ProgressBar } from '@/ui-kit';

import type { MasteryLadderProps } from '../../MoeDrawer.types';

import { MASTERY_LEVELS } from '../../MoeDrawer.constants';

import s from './MasteryLadder.module.scss';

export const MasteryLadder = ({ mastery }: MasteryLadderProps) => {
  const t = useTranslations('marks.drawer');
  const format = useFormatter();

  if (!mastery) {
    return <p className={s.empty}>{t('noMastery')}</p>;
  }

  return (
    <ul className={s.root}>
      {MASTERY_LEVELS.map(({ level, key }) => (
        <li key={key} className={s.row}>
          <MasteryIcon aria-hidden tinted className={s.icon} level={level} size={28} />
          <ProgressBar
            label={t(`masteryLevels.${level}`)}
            max={mastery.master}
            size='sm'
            tone={level === 'master' ? 'accent' : 'steel'}
            value={mastery[key]}
            valueLabel={t('xp', { xp: format.number(mastery[key]) })}
          />
        </li>
      ))}
    </ul>
  );
};
