'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export const useProfileShare = () => {
  const t = useTranslations('profile.actions');
  const { copied, copy } = useCopy();

  const share = async () => {
    await copy(window.location.href);
    toast.success(t('copied'));
  };

  return { copied, share: () => void share() };
};
