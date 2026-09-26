'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useStartTrial } from '@/entities/plus/subscription';

import type { UseStatusCardInput } from './use-status-card.types';

import { plusNotice } from '../../../lib/plus-notice';
import { autoRenewState, periodEndKind, planCta } from '../../../lib/renewal';

export const useStatusCard = ({ status }: UseStatusCardInput) => {
  const t = useTranslations('plus.teaser');
  const trial = useStartTrial();
  const [now] = useState(() => new Date());

  const onStartTrial = () =>
    trial.mutate(undefined, {
      onSuccess: () => toast.success(t('trialStarted', { days: status.plus.trialDays })),
      onError: () => toast.error(t('trialFailed'))
    });

  return {
    endKind: periodEndKind(status),
    renewal: autoRenewState(status),
    cta: planCta(status),
    notice: plusNotice({ plus: status.plus, now }),
    isStartingTrial: trial.isPending,
    onStartTrial
  };
};
