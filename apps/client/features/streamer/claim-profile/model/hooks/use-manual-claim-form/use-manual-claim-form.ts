'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { startClaim } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

import type { ManualClaimValues } from '../../../lib/claim-form';

import { MANUAL_CLAIM_DEFAULT_VALUES } from '../../../config';
import { manualClaimSchema } from '../../../lib/claim-form';

export const useManualClaimForm = (slug: string) => {
  const t = useTranslations('streamersDirectory.claim');
  const queryClient = useQueryClient();
  const submit = useMutation({
    mutationFn: (evidence: string) => startClaim({ slug, method: 'manual', evidence }),
    onSuccess: (claim) => {
      queryClient.setQueryData(QUERY_KEYS.streamers.claim(slug), claim);
      toast.success(t('manual.sent'));
    },
    onError: () => void toast.error(t('failed'))
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ManualClaimValues>({ resolver: zodResolver(manualClaimSchema), defaultValues: MANUAL_CLAIM_DEFAULT_VALUES });

  return {
    register,
    errors,
    isSubmitting: submit.isPending,
    onSubmit: handleSubmit(({ evidence }) => submit.mutate(evidence))
  };
};
