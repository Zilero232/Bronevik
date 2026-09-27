import { Injectable } from '@nestjs/common';

import type {
  CoachesQuery,
  CoachLookup,
  CoachOfferView,
  CoachPage,
  CoachView,
  CreateOfferRequest,
  UpdateOfferRequest,
  UpsertCoachRequest
} from '../coaching.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { AUTHOR_SELECT, CommunityAccountsService } from '../../community-core';
import { toCoachView, toOfferView } from '../mappers';

@Injectable()
export class CoachProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accounts: CommunityAccountsService
  ) {}

  async list({ tankId, limit, offset }: CoachesQuery): Promise<CoachPage> {
    const where = { isActive: true, hiddenAt: null, ...(tankId === undefined ? {} : { tankIds: { has: tankId } }) };
    const [rows, total] = await Promise.all([
      this.prisma.coachProfile.findMany({
        where,
        orderBy: [{ rating: { sort: 'desc', nulls: 'last' } }, { ordersDone: 'desc' }],
        take: limit,
        skip: offset,
        include: { user: { select: AUTHOR_SELECT }, offers: { where: { isActive: true } } }
      }),
      this.prisma.coachProfile.count({ where })
    ]);

    const stats = await this.accounts.statsOf(rows.map((row) => row.accountId));

    return { items: rows.map((coach) => toCoachView({ coach, stats })), total, limit, offset };
  }

  async get({ userId, viewerUserId }: CoachLookup): Promise<CoachView> {
    const isOwner = viewerUserId === userId;
    const coach = await this.prisma.coachProfile.findUnique({
      where: { userId },
      include: { user: { select: AUTHOR_SELECT }, offers: { where: isOwner ? {} : { isActive: true }, orderBy: { createdAt: 'asc' } } }
    });

    if (!coach || (!isOwner && (!coach.isActive || coach.hiddenAt !== null))) {
      throw new AppNotFoundException('NOT_FOUND', `No coach ${userId}`);
    }

    return toCoachView({ coach, stats: await this.accounts.statsOf([coach.accountId]) });
  }

  async upsertProfile({
    userId,
    accountId,
    headline,
    bio,
    priceRub,
    priceNote,
    contacts,
    tankIds,
    isActive
  }: UpsertCoachRequest): Promise<CoachView> {
    const account = await this.accounts.accountOf({ userId, accountId });
    const data = {
      accountId: account,
      headline,
      bio: bio ?? null,
      priceRub: priceRub ?? null,
      priceNote: priceNote ?? null,
      contacts,
      tankIds,
      ...(isActive === undefined ? {} : { isActive })
    };

    await this.prisma.coachProfile.upsert({ where: { userId }, create: { userId, ...data }, update: data });

    return this.get({ userId, viewerUserId: userId });
  }

  async createOffer({ userId, title, description, priceRub, durationMinutes, withReplay }: CreateOfferRequest): Promise<CoachOfferView> {
    await this.get({ userId, viewerUserId: userId });

    const offer = await this.prisma.coachingOffer.create({
      data: { coachUserId: userId, title, description: description ?? null, priceRub: priceRub ?? null, durationMinutes, withReplay }
    });

    return toOfferView(offer);
  }

  async updateOffer({ id, userId, ...changes }: UpdateOfferRequest): Promise<CoachOfferView> {
    const { count } = await this.prisma.coachingOffer.updateMany({ where: { id, coachUserId: userId }, data: changes });

    if (count === 0) {
      throw new AppNotFoundException('NOT_FOUND', `No offer ${id} of yours`);
    }

    return toOfferView(await this.prisma.coachingOffer.findUniqueOrThrow({ where: { id } }));
  }
}
