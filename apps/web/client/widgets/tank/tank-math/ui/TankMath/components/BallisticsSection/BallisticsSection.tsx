'use client';

import { useTranslations } from 'next-intl';

import { AreaChart, Badge, DeltaValue, LineChart } from '@/ui-kit';

import type { BallisticsSectionProps } from './BallisticsSection.types';

import { TANK_MATH } from '../../../../config';
import { useBallisticsSection } from '../../../../model/hooks';

import s from './BallisticsSection.module.scss';

export const BallisticsSection = ({ config }: BallisticsSectionProps) => {
  const t = useTranslations('tankMath.ballistics');
  const { labels, penetration, flightTime, rows, distances, flightDistance, formatMillimeters, formatSeconds } = useBallisticsSection({ config });

  return (
    <section className={s.root}>
      <header className={s.head}>
        <h3 className={s.title}>{t('title')}</h3>
        <p className={s.description}>{t('description')}</p>
      </header>
      <div className={s.charts}>
        <figure className={s.figure}>
          <figcaption className={s.caption}>{t('penetrationChart')}</figcaption>
          <LineChart
            ariaLabel={t('penetrationChart')}
            formatValue={formatMillimeters}
            height={TANK_MATH.chartHeight}
            labels={labels}
            series={penetration}
          />
        </figure>
        <figure className={s.figure}>
          <figcaption className={s.caption}>{t('flightChart')}</figcaption>
          <AreaChart ariaLabel={t('flightChart')} formatValue={formatSeconds} height={TANK_MATH.chartHeight} labels={labels} series={flightTime} />
        </figure>
      </div>
      <div className={s.scroll}>
        <table className={s.table}>
          <caption className={s.tableCaption}>{t('tableCaption')}</caption>
          <thead>
            <tr>
              <th scope='col'>{t('shell')}</th>
              <th scope='col'>{t('damage')}</th>
              {distances.map((distance) => (
                <th key={distance} scope='col'>
                  {t('penetrationAt', { distance })}
                </th>
              ))}
              <th scope='col'>{t('flightAt', { distance: flightDistance })}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.shell}>
                <th scope='row'>
                  <span className={s.shell}>
                    {row.label}
                    {row.isPremium && <Badge tone='premium'>{t('premium')}</Badge>}
                  </span>
                </th>
                <td>{row.damage}</td>
                {row.penetration.map((value, index) => (
                  <td key={distances[index]}>
                    {formatMillimeters(value)}
                    {row.penetrationDelta && <DeltaValue className={s.delta} value={row.penetrationDelta[index] ?? 0} />}
                  </td>
                ))}
                <td>
                  {row.flightTime === null ? t('outOfRange') : formatSeconds(row.flightTime)}
                  {row.flightTimeDelta !== null && <DeltaValue isLowerBetter className={s.delta} value={row.flightTimeDelta} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
