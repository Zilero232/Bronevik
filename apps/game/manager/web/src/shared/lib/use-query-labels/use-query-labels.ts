import { useTranslations } from 'use-intl';

export const useQueryLabels = () => {
  const t = useTranslations('common');

  return { errorTitle: t('loadFailed'), loadingLabel: t('loading'), retryLabel: t('retry') };
};
