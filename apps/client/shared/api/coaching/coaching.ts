import type {
  Coach,
  CoachingOrder,
  CoachingOrderList,
  CoachPage,
  CreateOrder,
  GetCoachInput,
  ListCoachesInput,
  ReviewCoachingOrderInput,
  UpsertCoach
} from './coaching.types';

import {
  coachingControllerAccept,
  coachingControllerCancel,
  coachingControllerCoach,
  coachingControllerComplete,
  coachingControllerList,
  coachingControllerOrder,
  coachingControllerOrders,
  coachingControllerReview,
  coachingControllerUpsertProfile
} from '../generated';
import { SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

export const listCoaches = ({ signal, ...query }: ListCoachesInput): Promise<CoachPage> =>
  fromSdk(() => coachingControllerList({ ...SESSION_REQUEST, query, signal }));

export const getCoach = ({ userId, signal }: GetCoachInput): Promise<Coach> =>
  fromSdk(() => coachingControllerCoach({ ...SESSION_REQUEST, path: { id: userId }, signal }));

export const saveCoachProfile = (body: UpsertCoach): Promise<Coach> => fromSdk(() => coachingControllerUpsertProfile({ ...SESSION_REQUEST, body }));

export const getCoachingOrders = (): Promise<CoachingOrderList> => fromSdk(() => coachingControllerOrders(SESSION_REQUEST));

export const requestCoaching = (body: CreateOrder): Promise<CoachingOrder> => fromSdk(() => coachingControllerOrder({ ...SESSION_REQUEST, body }));

export const acceptCoachingOrder = (id: string): Promise<CoachingOrder> =>
  fromSdk(() => coachingControllerAccept({ ...SESSION_REQUEST, path: { id } }));

export const completeCoachingOrder = (id: string): Promise<CoachingOrder> =>
  fromSdk(() => coachingControllerComplete({ ...SESSION_REQUEST, path: { id } }));

export const cancelCoachingOrder = (id: string): Promise<CoachingOrder> =>
  fromSdk(() => coachingControllerCancel({ ...SESSION_REQUEST, path: { id } }));

export const reviewCoachingOrder = ({ id, ...body }: ReviewCoachingOrderInput): Promise<CoachingOrder> =>
  fromSdk(() => coachingControllerReview({ ...SESSION_REQUEST, path: { id }, body }));
