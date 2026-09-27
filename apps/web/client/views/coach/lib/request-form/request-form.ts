import type { CreateOrder } from '@/entities/coaching/coach';

import type { ToCreateOrderInput } from './request-form.types';

import { COACH_REQUEST } from '../../config';

export const toCreateOrder = ({ values, coachUserId }: ToCreateOrderInput): CreateOrder => {
  const notes = values.notes.trim();
  const replayId = values.replayId.trim();

  return {
    coachUserId,
    studentContact: values.studentContact.trim(),
    ...(values.offerId === COACH_REQUEST.noOffer ? {} : { offerId: values.offerId }),
    ...(replayId === '' ? {} : { replayId }),
    ...(notes === '' ? {} : { notes })
  };
};
