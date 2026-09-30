'use client';

import { MarkOfExcellenceIcon } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { MarkProgress } from '@/entities/player/marks';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { SkeletonStack } from '@/ui-kit';

import type { DashboardMarksProps } from './DashboardMarks.types';

import { HOME, HOME_ICON } from '../../../../../config';

import s from './DashboardMarks.module.scss';

export const DashboardMarks = ({ nickname, marks }: DashboardMarksProps) => {
  const t = useTranslations('home.dashboard.marks');

  return (
    <article className={s.root}>
      <header className={s.head}>
        <h3 className={s.title}>{t('title')}</h3>
        <Link className={s.more} href={{ pathname: ROUTES.players.profile(nickname), query: HOME.forYou.marksQuery }}>
          {t('all')}
        </Link>
      </header>
      {marks === undefined ? (
        <SkeletonStack heights={HOME.dashboard.skeleton.marks} />
      ) : (
        <>
          <dl className={s.counts}>
            {HOME.dashboard.markLevels.map(({ key, marks: level }) => (
              <div key={key} className={s.count}>
                <dt>
                  <MarkOfExcellenceIcon aria-label={t(`levels.${key}`)} marks={level} size={HOME_ICON.dashboard} />
                </dt>
                <dd>{marks.summary[key]}</dd>
              </div>
            ))}
          </dl>
          {marks.closest.length > 0 ? (
            <ul className={s.list}>
              {marks.closest.map(({ vehicle, percent, damageToNext }) => (
                <MarkProgress
                  key={vehicle.tankId}
                  as='li'
                  damageToNext={damageToNext}
                  percent={percent}
                  size={HOME.dashboard.markRing}
                  title={vehicle.shortName || vehicle.name}
                />
              ))}
            </ul>
          ) : (
            <p className={s.empty}>{t('empty')}</p>
          )}
        </>
      )}
    </article>
  );
};
