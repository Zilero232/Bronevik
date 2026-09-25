'use client';

import { useInterval } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

import { seededRandom } from '@/shared/lib';
import { MOCK_SERVER } from '@/shared/mocks';

const LIVE_COUNTERS = {
  tickMs: 2600,
  seed: 42
} as const;

const INITIAL: Record<'battlesTracked' | 'marksTracked' | 'playersToday' | 'playersTracked', number> = {
  battlesTracked: MOCK_SERVER.battlesTracked,
  playersTracked: MOCK_SERVER.playersTracked,
  playersToday: MOCK_SERVER.playersToday,
  marksTracked: MOCK_SERVER.marksTracked
};

export const useLiveCounters = () => {
  const [counters, setCounters] = useState(INITIAL);

  const randomRef = useRef(seededRandom(LIVE_COUNTERS.seed));

  useInterval(() => {
    const random = randomRef.current;

    setCounters((current) => ({
      battlesTracked: current.battlesTracked + Math.round(900 + random() * 1600),
      playersTracked: current.playersTracked + Math.round(random() * 4),
      playersToday: current.playersToday + Math.round(random() * 40),
      marksTracked: current.marksTracked + Math.round(random() * 6)
    }));
  }, LIVE_COUNTERS.tickMs);

  return counters;
};
