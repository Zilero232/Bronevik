'use client';

import type { BonusCode } from '@otmetki/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAuthSession } from '@/entities/auth/session';
import { shopControllerListBonusCodesQueryKey } from '@/shared/api/query-options';
import { reportBonusCode } from '../../../api';
import { safeWebHref, useClientNow, useCopyFeedback } from '@/shared/lib';

import type { CodeReportVerdict, UseCodeCardInput } from './use-code-card.types';

import { CODES } from '../../../config';
import { codeRibbon } from '../../../lib/code-ribbon';

export const useCodeCard = ({ code }: UseCodeCardInput) => {
  const t = useTranslations('codes.report');
  const queryClient = useQueryClient();
  const { data: session } = useAuthSession();
  const now = useClientNow({ updateInterval: CODES.clockMs });
  const { copied, onCopyClick } = useCopyFeedback({ value: code.code });

  const mutation = useMutation({
    mutationFn: (verdict: CodeReportVerdict) => reportBonusCode({ code: code.code, verdict }),
    onSuccess: (updated) => {
      queryClient.setQueryData(shopControllerListBonusCodesQueryKey(), (codes: BonusCode[] | undefined) =>
        codes?.map((item) => (item.code === updated.code ? updated : item))
      );

      toast.success(t('thanks'));
    },
    onError: () => toast.error(t('failed'))
  });

  return {
    sourceHref: safeWebHref(code.sourceUrl),
    ribbon: codeRibbon({ code, now, expiringDays: CODES.expiringDays, freshDays: CODES.freshDays }),
    copied,
    onCopy: () => void onCopyClick(),
    isSignedIn: Boolean(session),
    isReporting: mutation.isPending,
    report: (verdict: CodeReportVerdict) => mutation.mutate(verdict)
  };
};
