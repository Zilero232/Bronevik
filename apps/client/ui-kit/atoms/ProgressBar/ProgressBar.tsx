'use client';

import { Progress } from '@base-ui/react/progress';
import { clsx } from 'clsx';
import { useLocale } from 'next-intl';
import { clamp } from 'remeda';

import type { ProgressBarProps } from './ProgressBar.types';

import s from './ProgressBar.module.scss';

export const ProgressBar = ({ value, max = 100, label, valueLabel, tone = 'accent', size = 'md', className }: ProgressBarProps) => {
  const locale = useLocale();
  const ratio = clamp(value / max, { min: 0, max: 1 });

  return (
    <Progress.Root className={clsx(s.root, s[size], className)} data-tone={tone} locale={locale} max={max} value={value}>
      {(label || valueLabel) && (
        <div className={s.head}>
          {label && <Progress.Label className={s.label}>{label}</Progress.Label>}
          {valueLabel && <span className={s.value}>{valueLabel}</span>}
        </div>
      )}
      <Progress.Track className={s.track}>
        <span className={s.fill} style={{ '--ratio': ratio }} />
      </Progress.Track>
    </Progress.Root>
  );
};
