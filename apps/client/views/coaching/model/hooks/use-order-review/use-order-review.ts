'use client';

import { useState } from 'react';

import type { CoachingOrder } from '@/shared/api/coaching';

import { reviewCoachingOrder } from '@/shared/api/coaching';

import { COACHING_ORDERS } from '../../../config';
import { useOrderMutation } from '../use-order-mutation';

export const useOrderReview = (order: CoachingOrder) => {
  const [score, setScore] = useState<string>(COACHING_ORDERS.defaultScore);
  const [review, setReview] = useState('');
  const mutation = useOrderMutation();

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
