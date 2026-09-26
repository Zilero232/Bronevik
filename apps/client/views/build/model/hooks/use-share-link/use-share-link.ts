'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export const useShareLink = () => {
  const t = useTranslations('builds.share');
  const { copy } = useCopy();

  return async () => {
    try {
      await copy(window.location.href);
      toast.success(t('done'), { description: t('doneBody') });
    } catch {
      toast.error(t('failed'));
    }
  };
};
