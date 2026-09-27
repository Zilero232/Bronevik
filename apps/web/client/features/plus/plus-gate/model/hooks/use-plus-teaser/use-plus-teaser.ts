'use client';

import { useStartTrial } from '@/entities/plus/subscription';

import { teaserAction } from '../../../lib/teaser-action';
import { usePlus } from '../use-plus';

export const usePlusTeaser = () => {
  const plus = usePlus();
  const trial = useStartTrial();

  const action = teaserAction(plus);

  const onStartTrial = () => trial.mutate();

  return { action, trialDays: plus.trialDays, isPending: plus.isPending, isStarting: trial.isPending, onStartTrial };
};
