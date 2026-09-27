'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { issueTelegramCode } from '../../../api';

export const useIssueCode = () => {
  const t = useTranslations('telegram.toast');

  return useMutation({ mutationFn: issueTelegramCode, onError: () => toast.error(t('codeFailed')) });
};
