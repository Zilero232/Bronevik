'use client';

import { useTranslations } from 'next-intl';

import type { QueueHeatmapProps } from './QueueHeatmap.types';

import { MAP_STATS } from '../../../config';
import { useWaitFormat } from '../../../model/hooks';
import { TierMark } from '../TierMark';

import s from './QueueHeatmap.module.scss';

export const QueueHeatmap = ({ heat, currentHour }: QueueHeatmapProps) => {
  const t = useTranslations('mapStats.queue');
  const tf = useTranslations('mapStats.filters');
  const seconds = useWaitFormat();

  return (
    <div className={s.root}>
      <div className={s.scroller}>
        <table className={s.grid}>
          <caption className={s.caption}>{t('caption')}</caption>
          <thead>
            <tr>
              <th scope='col'>
                <span className={s.caption}>{tf('tier')}</span>
              </th>
              {heat.rows[0]?.cells.map((cell) => (
                <th key={cell.hour} className={s.hour} data-current={cell.hour === currentHour || undefined} scope='col'>
                  {cell.hour % MAP_STATS.hourTickEvery === 0 ? cell.hour : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heat.rows.map((row) => (
              <tr key={row.tier}>
                <th className={s.tier} scope='row'>
                  <TierMark tier={row.tier} />
                </th>
                {row.cells.map(({ hour, cell, tone }) => (
                  <td
                    key={hour}
                    title={
                      cell
                        ? t('cell', {
                            tier: row.tier === MAP_STATS.allTiers ? tf('allShort') : row.tier,
                            hour,
                            median: seconds(cell.medianSec),
                            p90: seconds(cell.p90Sec),
                            samples: cell.samples
                          })
                        : t('noData', { hour })
                    }
                    className={s.cell}
                    data-current={hour === currentHour || undefined}
                    data-tone={tone ?? undefined}
                  >
                    <span className={s.caption}>{cell ? seconds(cell.medianSec) : '—'}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div aria-hidden className={s.legend}>
        <span>{t('legendFast', { wait: seconds(heat.fastestSec ?? 0) })}</span>
        <span className={s.scale}>
          {MAP_STATS.waitTones.map((tone) => (
            <span key={tone} className={s.swatch} data-tone={tone} />
          ))}
        </span>
        <span>{t('legendSlow', { wait: seconds(heat.slowestSec ?? 0) })}</span>
      </div>
    </div>
  );
};
