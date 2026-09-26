import { MarkOfExcellenceIcon } from '@otmetki/icons';
import { clsx } from 'clsx';
import { useFormatter, useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { ProgressRing } from '@/ui-kit';

import type { MarkProgressProps } from './MarkProgress.types';

import { markRing } from '../../lib/mark-progress';

import s from './MarkProgress.module.scss';

export const MarkProgress = ({ percent, title, damageToNext = null, size = 64, className }: MarkProgressProps) => {
  const t = useTranslations('marks.progress');
  const format = useFormatter();

  const { marks, nextMark, ratio } = markRing(percent);
  const percentText = format.number(percent / 100, 'percent');

  return (
    <div className={clsx(s.root, className)}>
      <ProgressRing label={t('label')} marks={marks} max={1} size={size} thickness={6} value={ratio}>
        {marks === 0 ? <span className={s.percent}>{percentText}</span> : <MarkOfExcellenceIcon marks={marks} size={Math.round(size * 0.45)} />}
      </ProgressRing>
      <div className={s.text}>
        {title && <span className={s.title}>{title}</span>}
        <span className={s.value}>{percentText}</span>
        <span className={s.hint}>
          {match({ nextMark, damageToNext })
            .with({ nextMark: null }, () => t('done'))
            .with({ damageToNext: P.number }, ({ damageToNext: damage }) => t('toNext', { mark: marks + 1, damage: format.number(damage) }))
            .otherwise(() => t('next', { mark: marks + 1 }))}
        </span>
      </div>
    </div>
  );
};
