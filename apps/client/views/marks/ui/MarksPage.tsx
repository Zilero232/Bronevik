'use client';

import type { MoeRow } from '@bronevik/schemas';

import { useBoolean } from '@siberiacancode/reactuse';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { REVEAL_VIEWPORT, SLIDE_UP } from '@/shared/lib';
import { Button, EmptyState, SectionHeader } from '@/ui-kit';

import { useMoeRows } from '../model/hooks';
import { ClosestMarks, MarksHero, MarksTable, MarksToolbar, MoeDrawer, MoeProjection } from './components';

import s from './MarksPage.module.scss';

export const MarksPage = () => {
  const t = useTranslations('marks.table');
  const { rows, total, updatedAt, isPending, isError, isStale, refetch } = useMoeRows();
  const [selected, setSelected] = useState<MoeRow | null>(null);
  const [isDrawerOpen, toggleDrawer] = useBoolean(false);

  const onSelect = (row: MoeRow) => {
    setSelected(row);
    toggleDrawer(true);
  };

  return (
    <div className={s.root}>
      <MarksHero isLoading={isPending} total={total} updatedAt={updatedAt} />
      <div className={s.sections}>
        <motion.section className={s.section} initial='hidden' variants={SLIDE_UP} viewport={REVEAL_VIEWPORT} whileInView='visible'>
          <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// 01' title={t('title')} />
          <MarksToolbar />
          {isError ? (
            <EmptyState
              action={
                <Button variant='secondary' onClick={() => refetch()}>
                  {t('retry')}
                </Button>
              }
              description={t('errorHint')}
              title={t('error')}
            />
          ) : (
            <MarksTable isLoading={isPending} isStale={isStale} rows={rows} onSelect={onSelect} />
          )}
        </motion.section>
        <ClosestMarks />
        <MoeProjection />
      </div>
      <MoeDrawer isOpen={isDrawerOpen} row={selected} onOpenChange={toggleDrawer} />
    </div>
  );
};
