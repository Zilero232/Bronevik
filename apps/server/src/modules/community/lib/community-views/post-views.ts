import type { CoachingOffer, CoachingOrder, ContentReport } from '../../../../../generated';
import type { CoachingOrderView, ContentReportView } from '../../community.types';
import type { CoachViewInput, PlatoonViewInput, RecruitingViewInput, TournamentViewInput } from './community-views.types';

import { toIso } from '../../../../common/lib';
import { readRequirements } from '../requirements';
import { toAuthorView } from './community-views';
import { RECRUITING_KIND_FROM_DB } from './community-views.constants';

export const toPlatoonView = ({ post, stats, nicknames }: PlatoonViewInput) => ({
  id: post.id,
  accountId: Number(post.accountId),
  nickname: nicknames.get(post.accountId) ?? null,
  tiers: post.tiers,
  modes: post.modes,
  tankIds: post.tankIds,
  hasVoice: post.hasVoice,
  minWn8: post.minWn8,
  message: post.message,
  status: post.status,
  stats: stats.get(post.accountId) ?? null,
  availableFrom: toIso(post.availableFrom),
  availableUntil: toIso(post.availableUntil),
  expiresAt: post.expiresAt.toISOString(),
  createdAt: post.createdAt.toISOString()
});

export const toRecruitingView = ({ post, stats, nicknames, clanTags }: RecruitingViewInput) => ({
  id: post.id,
  kind: RECRUITING_KIND_FROM_DB[post.kind],
  clanId: post.clanId === null ? null : Number(post.clanId),
  clanTag: post.clanId === null ? null : (clanTags.get(post.clanId) ?? null),
  accountId: post.accountId === null ? null : Number(post.accountId),
  nickname: post.accountId === null ? null : (nicknames.get(post.accountId) ?? null),
  title: post.title,
  body: post.body,
  requirements: readRequirements(post.requirements),
  stats: post.accountId === null ? null : (stats.get(post.accountId) ?? null),
  status: post.status,
  expiresAt: toIso(post.expiresAt),
  createdAt: post.createdAt.toISOString()
});

export const toOfferView = (offer: CoachingOffer) => ({
  id: offer.id,
  title: offer.title,
  description: offer.description,
  priceRub: Number(offer.priceRub),
  durationMinutes: offer.durationMinutes,
  withReplay: offer.withReplay,
  isActive: offer.isActive
});

export const toCoachView = ({ coach, stats }: CoachViewInput) => ({
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

export const toTournamentView = ({ tournament, nicknames, bracket, maxParticipants }: TournamentViewInput) => ({
  id: tournament.id,
  slug: tournament.slug,
  title: tournament.title,
  description: tournament.description,
  requirements: readRequirements(tournament.requirements),
  maxParticipants,
  bracket,
  status: tournament.status,
  organizerUserId: tournament.organizerUserId,
  registrationEndsAt: toIso(tournament.registrationEndsAt),
  startsAt: tournament.startsAt.toISOString(),
  participants: tournament.participants.map((participant) => ({
    accountId: Number(participant.accountId),
    nickname: nicknames.get(participant.accountId) ?? null,
    teamName: participant.teamName,
    seed: participant.seed,
    verified: participant.verified
  }))
});

export const toReportView = (report: ContentReport): ContentReportView => ({
  id: report.id,
  targetType: report.targetType,
  targetId: report.targetId,
  reason: report.reason,
  details: report.details,
  status: report.status,
  reporterUserId: report.reporterUserId,
  createdAt: report.createdAt.toISOString(),
  resolvedAt: toIso(report.resolvedAt)
});
