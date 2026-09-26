import type { CoachingOffer, CoachingOrder } from '../../../../../generated';
import type { CoachingOrderView, CoachOfferView, CoachView } from '../../coaching.types';
import type { CoachViewInput } from './coaching-views.types';

import { toIso } from '../../../../common/lib';
import { toAuthorView } from '../../../community-core';

export const toOfferView = (offer: CoachingOffer): CoachOfferView => ({
  id: offer.id,
  title: offer.title,
  description: offer.description,
  priceRub: Number(offer.priceRub),
  durationMinutes: offer.durationMinutes,
  withReplay: offer.withReplay,
  isActive: offer.isActive
});

export const toCoachView = ({ coach, stats }: CoachViewInput): CoachView => ({
  userId: coach.userId,
  name: coach.user.name,
  image: toAuthorView(coach.user).image,
  accountId: Number(coach.accountId),
  headline: coach.headline,
  bio: coach.bio,
  priceRub: Number(coach.priceRub),
  tankIds: coach.tankIds,
  isActive: coach.isActive,
  rating: coach.rating,
  ordersDone: coach.ordersDone,
  stats: stats.get(coach.accountId) ?? null,
  offers: coach.offers.map(toOfferView)
});

export const toOrderView = (order: CoachingOrder): CoachingOrderView => ({
  id: order.id,
  coachUserId: order.coachUserId,
  studentUserId: order.studentUserId,
  offerId: order.offerId,
  replayId: order.replayId,
  status: order.status,
  priceRub: Number(order.priceRub),
  notes: order.notes,
  review: order.review,
  score: order.score,
  createdAt: order.createdAt.toISOString(),
  completedAt: toIso(order.completedAt)
});
