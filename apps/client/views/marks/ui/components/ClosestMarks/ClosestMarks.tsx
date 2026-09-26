'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader } from '@/ui-kit';

import { useClosestMarks } from '../../../model/hooks';
import { ClosestList, PlayerLookup } from './components';

import s from './ClosestMarks.module.scss';

export const ClosestMarks = () => {
  const t = useTranslations('marks.closest');
  const { player, onPick } = useClosestMarks();

  return (
    <Card aria-label={t('title')} className={s.root} id='closest' padding='none' role='region'>
      <CardHeader className={s.header} title={t('title')} />
      <div className={s.body}>
        <PlayerLookup player={player} onPick={onPick} />
        <ClosestList player={player} />
      </div>
    </Card>
  );
};
