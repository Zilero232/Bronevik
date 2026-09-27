'use client';

import { useCopy, useShare } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import type { UsePlayerWrappedInput } from '../use-player-wrapped';

export const useWrappedShare = ({ nickname, year }: UsePlayerWrappedInput) => {
  const t = useTranslations('wrapped.share');
  const { copied, copy } = useCopy();
  const { supported, trigger } = useShare();

  const share = async () => {
    const url = window.location.href;

    if (supported) {
      await trigger({ title: t('title', { nickname, year }), text: t('text', { nickname, year }), url }).catch(() => undefined);

      return;
    }

    await copy(url);
    toast.success(t('copied'));
  };

  const copyLink = async () => {
    await copy(window.location.href);
    toast.success(t('copied'));
  };

  return {
    copied,
    onShare: () => void share(),
    onCopy: () => void copyLink()
  };
};
