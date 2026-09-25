'use client';

import { useTranslations } from 'next-intl';

import { Skeleton, Sparkline } from '@/ui-kit';

import type { ThresholdSparkProps } from './ThresholdSpark.types';

import { MOE_LIST } from '../../../../../config';
import { sparkDirection } from '../../../../../lib/moe-history';

import s from './ThresholdSpark.module.scss';

export const ThresholdSpark = ({ points }: ThresholdSparkProps) => {
  const t = useTranslations('marks.table');

  if (!points) {
    return (
      <div className={s.root}>
        <Skeleton height={MOE_LIST.sparkHeight} width={MOE_LIST.sparkWidth} />
      </div>
    );
  }

  return (
    <div className={s.root}>
      {points.length > 1 ? (
        <Sparkline
          data={[...points]}
          height={MOE_LIST.sparkHeight}
          label={t('sparkLabel')}
          tone={MOE_LIST.sparkTone[sparkDirection([...points])]}
          width={MOE_LIST.sparkWidth}
          withArea={false}
        />
      ) : (
        <span className={s.none}>—</span>
      )}
    </div>
  );
};
