'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import type { UseLinkCelebrationInput } from './use-link-celebration.types';

export const useLinkCelebration = ({ isLinked, onLinked }: UseLinkCelebrationInput) => {
  const t = useTranslations('telegram.toast');
  const [previous, setPrevious] = useState(isLinked);
  const [bursts, setBursts] = useState(0);
  const onLinkedRef = useRef(onLinked);

  onLinkedRef.current = onLinked;

  if (previous !== isLinked) {
    setPrevious(isLinked);

    if (previous === false && isLinked === true) {
      setBursts((count) => count + 1);
    }
  }

  useEffect(() => {
    if (bursts === 0) {
      return;
    }

    toast.success(t('linked'));
    onLinkedRef.current();
    // eslint-disable-next-line react/exhaustive-deps -- celebrate once per new link; the translator is stable
  }, [bursts]);

  return bursts;
};
