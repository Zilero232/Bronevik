import type { CoachingOrder, CreateOrder } from '@/entities/coaching/coach';
import { coachingControllerOrder } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const requestCoaching = (body: CreateOrder): Promise<CoachingOrder> => fromSdk(() => coachingControllerOrder({ ...SESSION_REQUEST, body }));
