'use client';

import { DailyLayout } from '@/entities/play/daily-puzzle';

import { useGuessGame } from '../../../model/context';
import { ClueBoard } from '../ClueBoard';
import { GameResult } from '../GameResult';
import { GuessForm } from '../GuessForm';
import { GuessGrid } from '../GuessGrid';
import { GuessStatusBar } from '../GuessStatusBar';
import { MysteryTank } from '../MysteryTank';

export const GuessArena = () => {
  const { status } = useGuessGame();

  return (
    <DailyLayout
      side={
        <>
          <MysteryTank />
          <ClueBoard />
        </>
      }
    >
      <GuessStatusBar />
      {status === 'playing' ? <GuessForm /> : <GameResult />}
      <GuessGrid />
    </DailyLayout>
  );
};
