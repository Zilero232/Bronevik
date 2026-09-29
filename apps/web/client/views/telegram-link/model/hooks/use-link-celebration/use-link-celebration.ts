'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent, useState } from 'react';
import { toast } from 'sonner';

import type { UseLinkCelebrationInput } from './use-link-celebration.types';

export const useLinkCelebration = ({ isLinked, onLinked }: UseLinkCelebrationInput) => {
  const t = useTranslations('telegram.toast');
  const [previous, setPrevious] = useState(isLinked);
  const [bursts, setBursts] = useState(0);

  const celebrate = useEffectEvent(() => {
    toast.success(t('linked'));
    onLinked();
  });

  if (previous !== isLinked) {
    setPrevious(isLinked);

    if (previous === false && isLinked === true) {
      setBursts((count) => count + 1);
    }
  }

  useEffect(() => {
    if (bursts > 0) {
      celebrate();
    }
  }, [bursts]);

  return bursts;
};
