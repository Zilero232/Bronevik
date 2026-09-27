import { MarkOfExcellenceIcon } from '@otmetki/icons';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { MarksRing } from '@/ui-kit';

import type { MarkProgressProps } from './MarkProgress.types';

import { useMarkProgress } from '../../model/hooks';

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
  const { target, percentText, hint } = useMarkProgress({ percent, damageToNext });

  return (
    <Tag className={clsx(s.root, s[variant], className)} data-marks={target}>
      <MarksRing className={s.ring} label={t('label')} percent={percent} size={size} thickness={6}>
        <MarkOfExcellenceIcon aria-hidden className={s.glyph} marks={target} size={Math.round(size * 0.4)} />
      </MarksRing>
      <div className={s.text}>
        {title && <span className={s.title}>{title}</span>}
        <span className={s.value}>{percentText}</span>
        <span className={s.hint}>{hint}</span>
      </div>
    </Tag>
  );
};
