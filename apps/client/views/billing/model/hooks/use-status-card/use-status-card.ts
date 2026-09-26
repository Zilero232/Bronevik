'use client';

import { useBoolean } from '@siberiacancode/reactuse';

import { useStartTrial } from '@/entities/plus/subscription';
import { useClientNow } from '@/shared/lib';

import type { AutoRenewMode, UseStatusCardInput } from './use-status-card.types';

import { plusNotice } from '../../../lib/plus-notice';
import { autoRenewState, periodEndKind, planCta } from '../../../lib/renewal';
import { useAutoRenew } from '../use-auto-renew';

export const useStatusCard = ({ status }: UseStatusCardInput) => {
  const trial = useStartTrial();
  const autoRenew = useAutoRenew();
  const now = useClientNow();
  const [isAutoRenewOpen, toggleAutoRenewOpen] = useBoolean(false);

  const renewal = autoRenewState(status);
  const isAutoRenewEnabled = renewal === 'on';
  const autoRenewMode: AutoRenewMode = isAutoRenewEnabled ? 'cancel' : 'resume';

  const onStartTrial = () => trial.mutate();
  const onAutoRenewConfirm = () => autoRenew.mutate(!isAutoRenewEnabled, { onSuccess: () => toggleAutoRenewOpen(false) });

  return {
    endKind: periodEndKind(status),
    renewal,
    cta: planCta(status),
    notice: now ? plusNotice({ plus: status.plus, now }) : null,
    isStartingTrial: trial.isPending,
    onStartTrial,
    autoRenewMode,
    isAutoRenewEnabled,
    isAutoRenewOpen,
    isAutoRenewPending: autoRenew.isPending,
    onAutoRenewOpenChange: toggleAutoRenewOpen,
    onAutoRenewConfirm
  };
};
