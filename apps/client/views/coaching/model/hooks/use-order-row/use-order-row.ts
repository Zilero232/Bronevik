'use client';

import type { CoachingOrder } from '@/entities/coaching/coach';

import { useCommunityViewer } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';

import { acceptCoachingOrder, cancelCoachingOrder, completeCoachingOrder } from '../../../api';
import { orderActions } from '../../../lib/order-actions';
import { useOrderMutation } from '../use-order-mutation';

export const useOrderRow = (order: CoachingOrder) => {
  const { userId } = useCommunityViewer();
  const mutation = useOrderMutation();

  const actions = orderActions({ order, viewerId: userId });

  return {
    ...actions,
    coachHref: ROUTES.coaching.coach(order.coachUserId),
    isDecline: actions.role === 'coach' && order.status === 'requested',
    isBusy: mutation.isPending,
    onAccept: () => mutation.mutate(() => acceptCoachingOrder(order.id)),
    onComplete: () => mutation.mutate(() => completeCoachingOrder(order.id)),
    onCancel: () => mutation.mutate(() => cancelCoachingOrder(order.id))
  };
};
