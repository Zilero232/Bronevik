'use client';

import type { CoachingOrder } from '@/shared/api/coaching';

import { useCommunityViewer } from '@/features/community/viewer';
import { acceptCoachingOrder, cancelCoachingOrder, completeCoachingOrder } from '@/shared/api/coaching';
import { ROUTES } from '@/shared/constants';

import { orderActions } from '../../../lib/order-actions';
import { useOrderMutation } from '../use-order-mutation';

export const useOrderRow = (order: CoachingOrder) => {
  const { userId } = useCommunityViewer();
  const mutation = useOrderMutation();

  const actions = orderActions({ order, viewerId: userId });

  return {
    ...actions,
    coachHref: ROUTES.coach(order.coachUserId),
    isDecline: actions.role === 'coach' && order.status === 'requested',
    isBusy: mutation.isPending,
    onAccept: () => mutation.mutate(() => acceptCoachingOrder(order.id)),
    onComplete: () => mutation.mutate(() => completeCoachingOrder(order.id)),
    onCancel: () => mutation.mutate(() => cancelCoachingOrder(order.id))
  };
};
