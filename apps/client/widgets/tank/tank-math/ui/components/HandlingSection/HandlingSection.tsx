'use client';

import { useTranslations } from 'next-intl';

import { KeyFigure, LineChart, StatList } from '@/ui-kit';

import type { HandlingSectionProps } from './HandlingSection.types';

import { TANK_MATH } from '../../../config';
import { useHandlingSection } from '../../../model/hooks';

import s from './HandlingSection.module.scss';

export const HandlingSection = ({ config, other, otherLabel }: HandlingSectionProps) => {
  const t = useTranslations('tankMath.handling');
  const { labels, series, items, score, formatDispersion } = useHandlingSection({ config, other });

  return (
    <section className={s.root}>
      <header className={s.head}>
        <h3 className={s.title}>{t('title')}</h3>
        <p className={s.description}>{t('description')}</p>
      </header>
      <div className={s.grid}>
        <div className={s.side}>
          {score && (
            <KeyFigure
              isDeltaLowerBetter
              isFramed
              delta={score.delta}
              deltaLabel={score.delta === undefined ? undefined : otherLabel}
              hint={t('scoreHint')}
              label={t('score')}
              value={score.value}
            />
          )}
          <StatList columns={1} items={items} title={t('aimTitle')} />
        </div>
        <figure className={s.figure}>
          <figcaption className={s.caption}>{t('chart')}</figcaption>
          <LineChart ariaLabel={t('chart')} formatValue={formatDispersion} height={TANK_MATH.chartHeight} labels={labels} series={series} />
        </figure>
      </div>
    </section>
  );
};
