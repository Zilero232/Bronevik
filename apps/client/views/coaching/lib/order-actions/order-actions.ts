import type { OrderActions, OrderActionsInput } from './order-actions.types';

export const orderActions = ({ order, viewerId }: OrderActionsInput): OrderActions => {
  const role = order.coachUserId === viewerId ? 'coach' : 'student';
  const isOpen = order.status === 'requested' || order.status === 'accepted';

  return {
    role,
    canAccept: role === 'coach' && order.status === 'requested',
    canComplete: role === 'coach' && order.status === 'accepted',
    canCancel: isOpen,
    canReview: role === 'student' && order.status === 'completed' && order.score === null
  };
};
