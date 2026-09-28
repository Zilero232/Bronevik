'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import type { CoachingOrder } from '@/entities/coaching/coach';

import { communityErrorKey } from '@/features/community/api-error';
import { QUERY_KEYS } from '@/shared/constants';

import { reviewCoachingOrder } from '../../../api';
import { COACHING_ORDERS } from '../../../config';

export const useOrderReview = (order: CoachingOrder) => {
  const [score, setScore] = useState<string>(COACHING_ORDERS.defaultScore);
  const [review, setReview] = useState('');
  const mutation = useMutation({
    mutationFn: (action: () => Promise<CoachingOrder>) => action(),
    meta: { successKey: 'coaching.orders.toast.updated', errorKey: communityErrorKey('coaching'), invalidates: [QUERY_KEYS.coaching.all] }
  });

  const text = review.trim();

  return {
    score,
    review,
    isBusy: mutation.isPending,
    onScoreChange: setScore,
    onReviewChange: setReview,
    onReview: () => mutation.mutate(() => reviewCoachingOrder({ id: order.id, score: Number(score), ...(text === '' ? {} : { review: text }) }))
  };
};
