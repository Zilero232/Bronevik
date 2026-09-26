'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { usePlus, useStartTrial } from '@/entities/plus/subscription';

import { teaserAction } from '../../../lib/teaser-action';

export const usePlusTeaser = () => {
  const t = useTranslations('plus.teaser');
  const plus = usePlus();
  const trial = useStartTrial();

  const action = teaserAction(plus);

  const onStartTrial = () =>
    trial.mutate(undefined, {
      onSuccess: () => toast.success(t('trialStarted', { days: plus.trialDays })),
      onError: () => toast.error(t('trialFailed'))
    });

  return { action, trialDays: plus.trialDays, isPending: plus.isPending, isStarting: trial.isPending, onStartTrial };
};
