'use client';

import { useState } from 'react';

import { useStartTrial } from '@/entities/plus/subscription';

import type { UseStatusCardInput } from './use-status-card.types';

import { plusNotice } from '../../../lib/plus-notice';
import { autoRenewState, periodEndKind, planCta } from '../../../lib/renewal';

export const useStatusCard = ({ status }: UseStatusCardInput) => {
  const trial = useStartTrial();
  const [now] = useState(() => new Date());

  const onStartTrial = () => trial.mutate();

  return {
    endKind: periodEndKind(status),
    renewal: autoRenewState(status),
    cta: planCta(status),
    notice: plusNotice({ plus: status.plus, now }),
    isStartingTrial: trial.isPending,
    onStartTrial
  };
};
