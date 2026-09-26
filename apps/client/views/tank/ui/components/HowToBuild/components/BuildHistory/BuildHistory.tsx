'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { GameIcon, gameLabel } from '@/entities/tank/build';
import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { BuildHistoryProps } from './BuildHistory.types';

import { HOW_TO_BUILD } from '../../../../../config';
import { useBuildHistory } from '../../../../../model/hooks';

import s from './BuildHistory.module.scss';

export const BuildHistory = ({ mode, cohort }: BuildHistoryProps) => {
  const t = useTranslations('tank.builds.history');
  const format = useFormatter();
  const { entries, isPending, isError, isFetching, onRetry } = useBuildHistory({ mode, cohort });

  return (
    <section className={s.root}>
      <h3 className={s.title}>{t('title')}</h3>
      {match({ entries, isPending, isError })
        .with({ isPending: true }, () => <Skeleton height={HOW_TO_BUILD.historySkeletonHeight} shape='block' width='100%' />)
        .with({ isError: true }, () => <ErrorState isCompact isRetrying={isFetching} title={t('errorTitle')} onRetry={onRetry} />)
        .with({ entries: [] }, () => <EmptyState isCompact title={t('emptyTitle')} />)
        .otherwise(() => (
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
                    <span className={s.icons}>
                      {equipment.map(({ option }) => (
                        <span key={option.id} title={gameLabel(option.name)}>
                          <GameIcon size={HOW_TO_BUILD.iconSize} src={option.image} />
                        </span>
                      ))}
                    </span>
                  </td>
                  <td>
                    <span className={s.icons}>
                      {consumables.map(({ option }) => (
                        <span key={option.id} title={gameLabel(option.name)}>
                          <GameIcon size={HOW_TO_BUILD.iconSize} src={option.image} />
                        </span>
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
    </section>
  );
};
