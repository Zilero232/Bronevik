'use client';

import type { BonusCode } from '@otmetki/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAuthSession } from '@/entities/auth/session';
import { shopControllerListBonusCodesQueryKey } from '@/shared/api/query-options';
import { reportBonusCode } from '@/shared/api/shop';

import type { CodeReportVerdict, UseCodeReportInput } from './use-code-report.types';

export const useCodeReport = ({ code }: UseCodeReportInput) => {
  const t = useTranslations('codes.report');
  const queryClient = useQueryClient();
  const { data: session } = useAuthSession();

  const mutation = useMutation({
    mutationFn: (verdict: CodeReportVerdict) => reportBonusCode({ code, verdict }),
    onSuccess: (updated) => {
      queryClient.setQueryData(shopControllerListBonusCodesQueryKey(), (codes: BonusCode[] | undefined) =>
        codes?.map((item) => (item.code === updated.code ? updated : item))
      );

      toast.success(t('thanks'));
    },
    onError: () => toast.error(t('failed'))
  });

  return {
    isSignedIn: Boolean(session),
    isReporting: mutation.isPending,
    report: (verdict: CodeReportVerdict) => mutation.mutate(verdict)
  };
};
