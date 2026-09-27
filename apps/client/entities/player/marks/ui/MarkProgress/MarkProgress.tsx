import { MarkOfExcellenceIcon } from '@otmetki/icons';
import { clsx } from 'clsx';
import { useFormatter, useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { MarksRing } from '@/ui-kit';

import type { MarkProgressProps } from './MarkProgress.types';

import { markRing, markTarget } from '../../lib/mark-progress';

import s from './MarkProgress.module.scss';

export const MarkProgress = ({
  percent,
  title,
  damageToNext = null,
  size = 64,
  variant = 'inline',
  as: Tag = 'div',
  className
}: MarkProgressProps) => {
  const t = useTranslations('marks.progress');
  const format = useFormatter();

  const { marks, nextMark } = markRing(percent);
  const target = markTarget(marks);
  const percentText = format.number(percent / 100, { style: 'percent', maximumFractionDigits: 2 });

  return (
    <Tag className={clsx(s.root, s[variant], className)} data-marks={target}>
      <MarksRing className={s.ring} label={t('label')} percent={percent} size={size} thickness={6}>
        <MarkOfExcellenceIcon aria-hidden className={s.glyph} marks={target} size={Math.round(size * 0.4)} />
      </MarksRing>
      <div className={s.text}>
        {title && <span className={s.title}>{title}</span>}
        <span className={s.value}>{percentText}</span>
        <span className={s.hint}>
          {match({ nextMark, damageToNext })
            .with({ nextMark: null }, () => t('done'))
            .with({ damageToNext: P.number }, ({ damageToNext: damage }) => t('toNext', { mark: marks + 1, damage: `+${format.number(damage)}` }))
            .otherwise(() => t('next', { mark: marks + 1 }))}
        </span>
      </div>
    </Tag>
  );
};
