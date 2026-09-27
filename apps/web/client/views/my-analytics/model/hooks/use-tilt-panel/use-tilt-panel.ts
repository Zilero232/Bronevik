'use client';

import type { Tilt } from '@otmetki/schemas';

import { useFormatter } from 'next-intl';

import { percentText } from '@/shared/lib';

export const useTiltPanel = (tilt: Tilt) => {
  const format = useFormatter();

  const stopStep = tilt.stopAfter === null ? undefined : tilt.steps.find((step) => step.afterLosses === tilt.stopAfter);
  const lastStep = tilt.steps.at(-1)?.afterLosses;

  return {
    steps: tilt.steps.map((step) => ({
      ...step,
      isOpenEnded: step.afterLosses === lastStep && step.afterLosses > 0,
      winRateText: percentText({ format, value: step.winRate, digits: 1 })
    })),
    advice:
      tilt.stopAfter !== null && stopStep ? { losses: tilt.stopAfter, winRate: percentText({ format, value: stopStep.winRate, digits: 1 }) } : null
  };
};
