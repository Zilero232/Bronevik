'use client';

import { useMutation } from '@tanstack/react-query';

import type { CoachingOrder } from '@/entities/coaching/coach';

import { useCommunityViewer } from '@/entities/auth/session';
import { communityErrorKey } from '@/features/community/api-error';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';

import { acceptCoachingOrder, cancelCoachingOrder, completeCoachingOrder } from '../../../api';
import { orderActions } from '../../../lib/order-actions';

export const useOrderRow = (order: CoachingOrder) => {
  const { userId } = useCommunityViewer();
  const mutation = useMutation({
    mutationFn: (action: () => Promise<CoachingOrder>) => action(),
    meta: { successKey: 'coaching.orders.toast.updated', errorKey: communityErrorKey('coaching'), invalidates: [QUERY_KEYS.coaching.all] }
  });

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
