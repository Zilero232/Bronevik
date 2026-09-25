'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export const useShareLink = () => {
  const t = useTranslations('builds.share');

  return async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t('done'), { description: t('doneBody') });
    } catch {
      toast.error(t('failed'));
    }
  };
};
