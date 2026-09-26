'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import type { CoachingOrder } from '@/shared/api/coaching';

import { communityErrorKind } from '@/features/community/api-error';
import { useCommunityViewer } from '@/features/community/viewer';
import { acceptCoachingOrder, cancelCoachingOrder, completeCoachingOrder, reviewCoachingOrder } from '@/shared/api/coaching';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';

import type { OrderMutation } from './use-order-row.types';

import { COACHING_ORDERS } from '../../../config';
import { orderActions } from '../../../lib/order-actions';

export const useOrderRow = (order: CoachingOrder) => {
  const t = useTranslations('coaching');
  const queryClient = useQueryClient();
  const { userId } = useCommunityViewer();
  const [score, setScore] = useState<string>(COACHING_ORDERS.defaultScore);
  const [review, setReview] = useState('');
  const mutation = useMutation({
    mutationFn: (action: OrderMutation) => action(),
    onSuccess: async () => {
      toast.success(t('orders.toast.updated'));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.coaching.all });
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });

  const actions = orderActions({ order, viewerId: userId });
  const text = review.trim();

  return {
    ...actions,
    score,
    review,
    coachHref: ROUTES.coach(order.coachUserId),
    isBusy: mutation.isPending,
    onScoreChange: setScore,
    onReviewChange: setReview,
    onAccept: () => mutation.mutate(() => acceptCoachingOrder(order.id)),
    onComplete: () => mutation.mutate(() => completeCoachingOrder(order.id)),
    onCancel: () => mutation.mutate(() => cancelCoachingOrder(order.id)),
    onReview: () => mutation.mutate(() => reviewCoachingOrder({ id: order.id, score: Number(score), ...(text === '' ? {} : { review: text }) }))
  };
};
