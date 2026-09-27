'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { BUILD_SKELETON } from '../../../config';
import { useBuildStatGroups } from '../../../model/hooks';
import { StatRow } from './components';

import s from './StatsBoard.module.scss';

export const StatsBoard = () => {
  const t = useTranslations('builds.stats');
  const tTank = useTranslations('tank');
  const { groups, isPending, isError, isFetching, isCompare, refetch } = useBuildStatGroups();

  return (
    <section aria-busy={isFetching} aria-label={t('title')} className={s.root}>
      <header className={s.head}>
        <h2 className={s.title}>{t('title')}</h2>
        {isFetching && <span className={s.updating}>{t('updating')}</span>}
      </header>
      <div className={s.body}>
        {match({ isPending, isError, count: groups.length })
          .with({ isPending: true }, () => (
            <div className={s.skeleton}>
              <Skeleton count={BUILD_SKELETON.statRows} height={28} />
            </div>
          ))
          .with({ isError: true }, () => <ErrorState isRetrying={isFetching} title={t('error')} onRetry={refetch} />)
          .with({ count: 0 }, () => <EmptyState title={t('empty')} />)
          .otherwise(() => (
            <table className={s.table}>
              <caption className={s.caption}>{isCompare ? t('captionCompare') : t('caption')}</caption>
              <thead className={s.thead}>
                <tr>
                  <th scope='col'>{t('stat')}</th>
                  <th scope='col'>{isCompare ? t('colA') : t('value')}</th>
                  {isCompare && <th scope='col'>{t('colB')}</th>}
                  <th scope='col'>{isCompare ? t('diff') : t('delta')}</th>
                </tr>
              </thead>
              {groups.map(({ group, rows }) => (
                <tbody key={group}>
                  <tr className={s.group}>
                    <th colSpan={isCompare ? 4 : 3} scope='colgroup'>
                      {tTank(`specGroups.${group}`)}
                    </th>
                  </tr>
                  {rows.map((row) => (
                    <StatRow key={row.key} isCompare={isCompare} row={row} />
                  ))}
                </tbody>
              ))}
            </table>
          ))}
      </div>
    </section>
  );
};
