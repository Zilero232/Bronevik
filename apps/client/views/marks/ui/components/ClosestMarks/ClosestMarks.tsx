'use client';

import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import { Card, SectionHeader } from '@/ui-kit';

import { PLAYER_URL_PARSER } from '../../../config';
import { ClosestList, PlayerLookup } from './components';

import s from './ClosestMarks.module.scss';

export const ClosestMarks = () => {
  const t = useTranslations('marks.closest');
  const [player, setPlayer] = useQueryState('player', PLAYER_URL_PARSER.withOptions({ history: 'replace' }));

  return (
    <section className={s.root} id='closest'>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// 02' title={t('title')} />
      <div className={s.layout}>
        <Card className={s.lookup} padding='lg'>
          <PlayerLookup player={player} onPick={(value) => setPlayer(value || null)} />
        </Card>
        <ClosestList player={player} />
      </div>
    </section>
  );
};
