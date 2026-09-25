'use client';

import { motion } from 'motion/react';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';

import { useGuessGame } from '../../../model/context';
import { ClueBoard } from '../ClueBoard';
import { GameResult } from '../GameResult';
import { GuessForm } from '../GuessForm';
import { GuessGrid } from '../GuessGrid';
import { GuessStatusBar } from '../GuessStatusBar';
import { MysteryTank } from '../MysteryTank';

import s from './GuessArena.module.scss';

export const GuessArena = () => {
  const { status } = useGuessGame();

  return (
    <motion.div animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <motion.aside className={s.side} variants={STAGGER_ITEM}>
        <MysteryTank />
        <ClueBoard />
      </motion.aside>
      <motion.div className={s.main} variants={STAGGER_ITEM}>
        <GuessStatusBar />
        {status === 'playing' ? <GuessForm /> : <GameResult />}
        <GuessGrid />
      </motion.div>
    </motion.div>
  );
};
