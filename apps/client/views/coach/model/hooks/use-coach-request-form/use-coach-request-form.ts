'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { Coach, CreateOrder } from '@/shared/api/coaching';

import { communityErrorKind } from '@/features/community/api-error';
import { useCommunityViewer } from '@/features/community/viewer';
import { requestCoaching } from '@/shared/api/coaching';
import { QUERY_KEYS } from '@/shared/constants';

import type { RequestFormOutput, RequestFormValues } from '../../../lib/request-form';

import { COACH_REQUEST, REQUEST_FORM_DEFAULTS } from '../../../config';
import { requestFormSchema, toCreateOrder } from '../../../lib/request-form';

export const useCoachRequestForm = (coach: Coach) => {
  const t = useTranslations('coaching');
  const queryClient = useQueryClient();
  const { userId } = useCommunityViewer();
  const form = useForm<RequestFormValues, unknown, RequestFormOutput>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: REQUEST_FORM_DEFAULTS,
    mode: 'onTouched'
  });

  const request = useMutation({
    mutationFn: (body: CreateOrder) => requestCoaching(body),
    onSuccess: async () => {
      toast.success(t('request.sent'));
      form.reset(REQUEST_FORM_DEFAULTS);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.coaching.orders });
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });

  const offerItems = [
    { value: COACH_REQUEST.noOffer, label: t('request.noOffer') },
    ...coach.offers.filter(({ isActive }) => isActive).map(({ id, title }) => ({ value: id, label: title }))
  ];

  return {
    form,
    offerItems,
    isOwn: userId === coach.userId,
    isAvailable: coach.isActive,
    isPending: request.isPending,
    onSubmit: form.handleSubmit((values) => request.mutate(toCreateOrder({ values, coachUserId: coach.userId })))
  };
};
