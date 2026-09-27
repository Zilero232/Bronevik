'use client';

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
    <div className={s.root}>
      <aside className={s.side}>
        <MysteryTank />
        <ClueBoard />
      </aside>
      <div className={s.main}>
        <GuessStatusBar />
        {status === 'playing' ? <GuessForm /> : <GameResult />}
        <GuessGrid />
      </div>
    </div>
  );
};
