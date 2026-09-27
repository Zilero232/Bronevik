import { describe, expect, it } from 'vitest';

import { orderActions } from '../order-actions';

const COACH = 'coach-id';
const STUDENT = 'student-id';

describe('orderActions', () => {
  it('lets the coach accept or decline a new request', () => {
    expect(orderActions({ order: { coachUserId: COACH, status: 'requested', score: null }, viewerId: COACH })).toMatchObject({
      role: 'coach',
      canAccept: true,
      canComplete: false,
      canCancel: true
    });
  });

  it('lets the coach complete an accepted session', () => {
    expect(orderActions({ order: { coachUserId: COACH, status: 'accepted', score: null }, viewerId: COACH }).canComplete).toBe(true);
  });

  it('never lets the student accept or complete', () => {
    const actions = orderActions({ order: { coachUserId: COACH, status: 'requested', score: null }, viewerId: STUDENT });

    expect(actions).toMatchObject({ role: 'student', canAccept: false, canComplete: false, canCancel: true });
  });

  it('offers a review only for a completed, unreviewed session of the student', () => {
    expect(orderActions({ order: { coachUserId: COACH, status: 'completed', score: null }, viewerId: STUDENT }).canReview).toBe(true);
    expect(orderActions({ order: { coachUserId: COACH, status: 'completed', score: 4 }, viewerId: STUDENT }).canReview).toBe(false);
    expect(orderActions({ order: { coachUserId: COACH, status: 'completed', score: null }, viewerId: COACH }).canReview).toBe(false);
  });

  it('allows nothing on a cancelled request', () => {
    expect(orderActions({ order: { coachUserId: COACH, status: 'cancelled', score: null }, viewerId: COACH })).toMatchObject({
      canAccept: false,
      canComplete: false,
      canCancel: false,
      canReview: false
    });
  });
});
