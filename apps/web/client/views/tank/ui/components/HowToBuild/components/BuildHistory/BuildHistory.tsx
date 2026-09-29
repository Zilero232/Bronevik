'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import type { BuildHistoryProps } from './BuildHistory.types';

import { HOW_TO_BUILD } from '../../../../../config';
import { useBuildHistory } from '../../../../../model/hooks';
import { PickIcons } from './components';

import s from './BuildHistory.module.scss';

export const BuildHistory = ({ mode, cohort }: BuildHistoryProps) => {
  const t = useTranslations('tank.builds.history');
  const format = useFormatter();
  const query = useBuildHistory({ mode, cohort });

  return (
    <section className={s.root}>
      <h3 className={s.title}>{t('title')}</h3>
      <QueryState
        isCompact
        empty={<EmptyState isCompact title={t('emptyTitle')} />}
        errorTitle={t('errorTitle')}
        query={query}
        skeleton={<Skeleton height={HOW_TO_BUILD.historySkeletonHeight} shape='block' width='100%' />}
      >
        {(entries) => (
          <table className={s.table}>
            <thead>
              <tr>
                <th scope='col'>{t('version')}</th>
                <th className={s.numeric} scope='col'>
                  {t('battles')}
                </th>
                <th scope='col'>{t('equipment')}</th>
                <th scope='col'>{t('consumables')}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(({ gameVersion, battles, equipment, consumables }) => (
                <tr key={gameVersion}>
                  <td className={s.version}>{gameVersion}</td>
                  <td className={s.numeric}>{format.number(battles)}</td>
                  <td>
                    <PickIcons picks={equipment} />
                  </td>
                  <td>
                    <PickIcons picks={consumables} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </QueryState>
    </section>
  );
};
