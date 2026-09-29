'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { SectionHeader } from '@/ui-kit';

import { useClosestMarks } from '../../../model/hooks';
import { ClosestList, PlayerLookup } from './components';

import s from './ClosestMarks.module.scss';

export const ClosestMarks = () => {
  const t = useTranslations('marks.closest');
  const titleId = useId();
  const { player, onPick } = useClosestMarks();

  return (
    <section aria-labelledby={titleId} className={s.root} id='closest'>
      <SectionHeader
        action={
          <div className={s.lookup}>
            <PlayerLookup player={player} onPick={onPick} />
          </div>
        }
        id={titleId}
        title={t('title')}
        variant='display'
      />
      <ClosestList player={player} />
    </section>
  );
};
