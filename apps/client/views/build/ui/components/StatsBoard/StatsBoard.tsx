'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { FADE } from '@/shared/lib';
import { EmptyState, Skeleton } from '@/ui-kit';

import { useBuildStatGroups } from '../../../model/hooks';
import { StatCompareRow, StatRow } from './components';

import s from './StatsBoard.module.scss';

const SKELETON_ROWS = Array.from({ length: 10 }, (_, index) => index);

export const StatsBoard = () => {
  const t = useTranslations('builds.stats');
  const tTank = useTranslations('tank');
  const { groups, isPending, isFetching, isCompare } = useBuildStatGroups();

  return (
    <section aria-busy={isFetching} className={s.root} data-compare={isCompare}>
      <header className={s.head}>
        <div className={s.heading}>
          <span className={s.eyebrow}>{t('eyebrow')}</span>
          <h2 className={s.title}>{t('title')}</h2>
        </div>
        <AnimatePresence>
          {isFetching && (
            <motion.span key='updating' animate='visible' className={s.updating} exit='hidden' initial='hidden' variants={FADE}>
              {t('updating')}
            </motion.span>
          )}
        </AnimatePresence>
      </header>
      {match({ isPending, count: groups.length })
        .with({ isPending: true }, () => (
          <div className={s.skeleton}>
            {SKELETON_ROWS.map((row) => (
              <Skeleton key={row} height={28} />
            ))}
          </div>
        ))
        .with({ count: 0 }, () => <EmptyState code='ERR' title={t('error')} />)
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
                {rows.map((row) => (isCompare ? <StatCompareRow key={row.key} row={row} /> : <StatRow key={row.key} row={row} />))}
              </tbody>
            ))}
          </table>
        ))}
    </section>
  );
};
