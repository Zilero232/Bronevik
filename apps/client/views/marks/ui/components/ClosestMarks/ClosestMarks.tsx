'use client';

import { useTranslations } from 'next-intl';

import { useClosestMarks } from '../../../model/hooks';
import { ClosestList, PlayerLookup } from './components';

import s from './ClosestMarks.module.scss';

export const ClosestMarks = () => {
  const t = useTranslations('marks.closest');
  const { player, onPick } = useClosestMarks();

  return (
    <section aria-labelledby='closest-title' className={s.root} id='closest'>
      <div className={s.head}>
        <h2 className={s.title} id='closest-title'>
          {t('title')}
        </h2>
        <div className={s.lookup}>
          <PlayerLookup player={player} onPick={onPick} />
        </div>
      </div>
      <ClosestList player={player} />
    </section>
  );
};
