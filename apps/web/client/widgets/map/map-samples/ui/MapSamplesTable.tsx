'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import type { MapSamplesTableProps } from './MapSamplesTable.types';

import { useMapSamplesTable } from '../model/hooks';

import s from './MapSamplesTable.module.scss';

export const MapSamplesTable = ({ rows, nameLabel, windowDays, minBattles }: MapSamplesTableProps) => {
  const t = useTranslations('maps.samples');
  const { lines } = useMapSamplesTable(rows);

  return (
    <div className={s.root}>
      <p className={s.meta}>{t('window', { days: windowDays, min: minBattles })}</p>
      <div className={s.scroll}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope='col'>{nameLabel}</th>
              <th scope='col'>{t('battles')}</th>
              <th scope='col'>{t('winRate')}</th>
              <th scope='col'>{t('avgDamage')}</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id} data-enough={line.isEnough}>
                <th scope='row'>
                  <Link className={s.link} href={line.href}>
                    {line.name}
                  </Link>
                </th>
                <td>{line.battles}</td>
                {line.isEnough ? (
                  <>
                    <td>{line.winRate}</td>
                    <td>{line.avgDamage}</td>
                  </>
                ) : (
                  <td className={s.few} colSpan={2}>
                    {t('fewBattles', { min: minBattles })}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
