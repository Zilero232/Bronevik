'use client';

import { COMPARE } from '@bronevik/schemas';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Button, EmptyState } from '@/ui-kit';

import { useCompareBoard, useCompareIds } from '../../../model/hooks';
import { BoardSkeleton } from '../BoardSkeleton';
import { LabelColumn } from '../LabelColumn';
import { TankColumn } from '../TankColumn';
import { COLUMN, COLUMN_LAYOUT } from './CompareBoard.motion';

import s from './CompareBoard.module.scss';

export const CompareBoard = () => {
  const t = useTranslations('tanks.compare.board');
  const { ids, vehicles, sections, isLoading, isError, refetch } = useCompareBoard();
  const { clear } = useCompareIds();

  return match({ isLoading, isError, isEmpty: vehicles.length === 0 })
    .with({ isError: true }, () => (
      <EmptyState
        action={
          <Button size='sm' variant='secondary' onClick={() => void refetch()}>
            {t('retry')}
          </Button>
        }
        description={t('errorDescription')}
        title={t('errorTitle')}
      />
    ))
    .with({ isLoading: true }, () => <BoardSkeleton count={ids.length} />)
    .with({ isEmpty: true }, () => (
      <EmptyState
        action={
          <Button size='sm' variant='secondary' onClick={clear}>
            {t('clear')}
          </Button>
        }
        description={t('notFoundDescription')}
        title={t('notFoundTitle')}
      />
    ))
    .otherwise(() => (
      <section className={s.root}>
        {vehicles.length < COMPARE.minItems && <p className={s.hint}>{t('addMore')}</p>}
        {/* eslint-disable-next-line siberiacancode-jsx-a11y/no-noninteractive-tabindex -- a scrollable region must take focus so keyboard users can scroll it */}
        <div aria-label={t('label')} className={s.scroller} role='region' tabIndex={0}>
          <div className={s.grid}>
            <LabelColumn count={vehicles.length} sections={sections} />
            <AnimatePresence mode='popLayout'>
              {vehicles.map(({ vehicle }, index) => (
                <motion.div
                  layout
                  key={vehicle.tankId}
                  animate='visible'
                  className={s.column}
                  custom={index}
                  exit='exit'
                  initial='hidden'
                  transition={COLUMN_LAYOUT}
                  variants={COLUMN}
                >
                  <TankColumn index={index} sections={sections} vehicle={vehicle} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    ));
};
