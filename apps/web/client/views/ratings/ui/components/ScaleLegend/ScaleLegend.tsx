'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useId } from 'react';

import type { ScaleLegendProps } from './ScaleLegend.types';

import { RATING_SCALE_COLUMNS } from '../../../config';

import s from './ScaleLegend.module.scss';

export const ScaleLegend = ({ rows }: ScaleLegendProps) => {
  const t = useTranslations('methodology.sections.scale');
  const tTiers = useTranslations('profile.header.tiers');
  const format = useFormatter();
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={s.root} id='scale'>
      <h2 className={s.title} id={titleId}>
        {t('title')}
      </h2>
      <p className={s.lead}>{t('lead')}</p>
      <div className={s.scroller}>
        <table className={s.table}>
          <caption className={s.caption}>{t('caption')}</caption>
          <thead>
            <tr>
              <th scope='col'>{t('columns.tier')}</th>
              {RATING_SCALE_COLUMNS.map((scale) => (
                <th key={scale} scope='col'>
                  {t(`columns.${scale}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ tier, tone, from }) => (
              <tr key={tier} className={s.row} data-tone={tone}>
                <th scope='row'>
                  <span aria-hidden className={s.swatch} />
                  {tTiers(tier)}
                </th>
                {RATING_SCALE_COLUMNS.map((scale) => (
                  <td key={scale} className={s.value}>
                    {t('from', { value: format.number(from[scale]) })}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={s.note}>{t('palette')}</p>
    </section>
  );
};
