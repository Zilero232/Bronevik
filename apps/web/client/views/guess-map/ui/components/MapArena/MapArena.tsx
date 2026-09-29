'use client';

import { DailyLayout } from '@/entities/play/daily-puzzle';

import { useGuessMap } from '../../../model/context';
import { MapChoices } from '../MapChoices';
import { MapFragment } from '../MapFragment';
import { MapGuessList } from '../MapGuessList';
import { MapResult } from '../MapResult';
import { MapStatusBar } from '../MapStatusBar';

export const MapArena = () => {
  const { status } = useGuessMap();

  return (
    <DailyLayout isWide side={<MapFragment />}>
      <MapStatusBar />
      {status === 'playing' ? <MapChoices /> : <MapResult />}
      <MapGuessList />
    </DailyLayout>
  );
};
