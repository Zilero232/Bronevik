import { coachingControllerCoach, coachingControllerList, coachingControllerOrders } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { Coach, CoachingOrderList, CoachPage, GetCoachInput, ListCoachesInput } from './coaching.types';

export const listCoaches = ({ signal, ...query }: ListCoachesInput): Promise<CoachPage> =>
  fromSdk(() => coachingControllerList({ ...SESSION_REQUEST, query, signal }));

export const getCoach = ({ userId, signal }: GetCoachInput): Promise<Coach> =>
  fromSdk(() => coachingControllerCoach({ ...SESSION_REQUEST, path: { id: userId }, signal }));

export const getCoachingOrders = (): Promise<CoachingOrderList> => fromSdk(() => coachingControllerOrders(SESSION_REQUEST));
