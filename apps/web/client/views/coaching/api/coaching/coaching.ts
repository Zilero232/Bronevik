import type { Coach, CoachingOrder, ReviewCoachingOrderInput, UpsertCoach } from '@/entities/coaching/coach';

import {
  coachingControllerAccept,
  coachingControllerCancel,
  coachingControllerComplete,
  coachingControllerReview,
  coachingControllerUpsertProfile
} from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const saveCoachProfile = (body: UpsertCoach): Promise<Coach> => fromSdk(() => coachingControllerUpsertProfile({ ...SESSION_REQUEST, body }));

export const acceptCoachingOrder = (id: string): Promise<CoachingOrder> =>
  fromSdk(() => coachingControllerAccept({ ...SESSION_REQUEST, path: { id } }));

export const completeCoachingOrder = (id: string): Promise<CoachingOrder> =>
  fromSdk(() => coachingControllerComplete({ ...SESSION_REQUEST, path: { id } }));

export const cancelCoachingOrder = (id: string): Promise<CoachingOrder> =>
  fromSdk(() => coachingControllerCancel({ ...SESSION_REQUEST, path: { id } }));

export const reviewCoachingOrder = ({ id, ...body }: ReviewCoachingOrderInput): Promise<CoachingOrder> =>
  fromSdk(() => coachingControllerReview({ ...SESSION_REQUEST, path: { id }, body }));
