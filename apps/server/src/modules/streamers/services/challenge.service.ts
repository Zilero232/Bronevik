import { Injectable } from '@nestjs/common';
import { challengeConditionSchema } from '@otmetki/schemas';
import { addMinutes } from 'date-fns';
import pRetry from 'p-retry';

import type { Challenge } from '../../../../generated';
import type {
  ActivateByStreamerInput,
  ActivateChallengeInput,
  CreateStreamerChallengeInput,
  DonationInput,
  OwnedInput,
  StreamerChallengeView
} from '../streamers.types';

import { AppBadRequestException, AppConflictException, AppNotFoundException } from '../../../common/exceptions';
import { randomCode, readRecord, toIso } from '../../../common/lib';
import { isUniqueViolation, PrismaService } from '../../../core';
import { CHALLENGE } from '../config';
import { matchDonation } from '../lib';

@Injectable()
export class ChallengeService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<StreamerChallengeView[]> {
    const challenges = await this.prisma.challenge.findMany({
      where: { streamerUserId: userId },
      orderBy: { createdAt: 'desc' },
      take: CHALLENGE.listLimit
    });

    return challenges.map((challenge) => this.toView(challenge));
  }

  async create({ userId, title, condition, amount, expiresInMinutes }: CreateStreamerChallengeInput): Promise<StreamerChallengeView> {
    const [profile, open] = await Promise.all([
      this.prisma.streamerProfile.findUnique({ where: { userId }, select: { accountId: true } }),
      this.prisma.challenge.count({ where: { streamerUserId: userId, status: { in: ['pending', 'active'] } } })
    ]);

    if (!profile?.accountId) {
      throw new AppBadRequestException('VALIDATION_FAILED', 'Link a Lesta account to the streamer profile first');
    }

    if (open >= CHALLENGE.maxOpen) {
      throw new AppConflictException('PLAN_LIMIT_REACHED', 'Too many open challenges');
    }

    const accountId = profile.accountId;

    try {
      const challenge = await pRetry(
        () =>
          this.prisma.challenge.create({
            data: {
              streamerUserId: userId,
              accountId,
              code: randomCode({ alphabet: CHALLENGE.codeAlphabet, length: CHALLENGE.codeLength }),
              title,
              condition,
              amount,
              currency: CHALLENGE.defaultCurrency,
              progress: { battles: 0, value: 0, battleIds: [], durationMinutes: expiresInMinutes }
            }
          }),
        { retries: CHALLENGE.codeAttempts - 1, minTimeout: 0, shouldRetry: ({ error }) => isUniqueViolation(error) }
      );

      return this.toView(challenge);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppConflictException('CONFLICT', 'Could not allocate a challenge code');
      }

      throw error;
    }
  }

  async cancel({ userId, id }: OwnedInput): Promise<StreamerChallengeView> {
    await this.owned({ userId, id });

    const updated = await this.prisma.challenge.updateMany({
      where: { id, status: { in: ['pending', 'active'] } },
      data: { status: 'cancelled', resolvedAt: new Date() }
    });

    if (updated.count === 0) {
      throw new AppConflictException('CONFLICT', 'The challenge is already resolved');
    }

    return this.toView(await this.prisma.challenge.findUniqueOrThrow({ where: { id } }));
  }

  async activateByStreamer({ userId, id, donorName }: ActivateByStreamerInput): Promise<StreamerChallengeView> {
    await this.owned({ userId, id });

    const activated = await this.activate({ challengeId: id, donorName, donorMessage: null, source: null, externalId: null, now: new Date() });

    if (!activated) {
      throw new AppConflictException('CONFLICT', 'Only a pending challenge can be activated');
    }

    return this.toView(activated);
  }

  async activate({ challengeId, donorName, donorMessage, source, externalId, now }: ActivateChallengeInput): Promise<Challenge | null> {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });

    if (challenge?.status !== 'pending') {
      return null;
    }

    const progress = readRecord(challenge.progress);
    const minutes = typeof progress.durationMinutes === 'number' ? progress.durationMinutes : null;

    try {
      const updated = await this.prisma.challenge.updateMany({
        where: { id: challengeId, status: 'pending' },
        data: {
          status: 'active',
          donorName,
          donorMessage,
          donationSource: source,
          donationExternalId: externalId,
          acceptedAt: now,
          expiresAt: minutes === null ? null : addMinutes(now, minutes)
        }
      });

      return updated.count === 0 ? null : this.prisma.challenge.findUnique({ where: { id: challengeId } });
    } catch (error) {
      if (isUniqueViolation(error)) {
        return null;
      }

      throw error;
    }
  }

  async handleDonation({ streamerUserId, externalId, donorName, message, amount, currency }: DonationInput): Promise<Challenge | null> {
    const pending = await this.prisma.challenge.findMany({
      where: { streamerUserId, status: 'pending' },
      select: { id: true, code: true, amount: true, currency: true }
    });

    const matched = matchDonation({
      message,
      amount,
      currency,
      challenges: pending.map((challenge) => ({ ...challenge, amount: challenge.amount.toNumber() }))
    });

    if (!matched) {
      return null;
    }

    return this.activate({
      challengeId: matched.id,
      donorName,
      donorMessage: message,
      source: 'donationAlerts',
      externalId,
      now: new Date()
    });
  }

  toView(challenge: Challenge): StreamerChallengeView {
    const progress = readRecord(challenge.progress);

    return {
      id: challenge.id,
      code: challenge.code,
      title: challenge.title,
      condition: challengeConditionSchema.parse(challenge.condition),
      amount: challenge.amount.toNumber(),
      currency: challenge.currency,
      status: challenge.status,
      donorName: challenge.donorName,
      progress:
        typeof progress.battles === 'number' && typeof progress.value === 'number' ? { battles: progress.battles, value: progress.value } : null,
      createdAt: challenge.createdAt.toISOString(),
      expiresAt: toIso(challenge.expiresAt),
      resolvedAt: toIso(challenge.resolvedAt)
    };
  }

  private async owned({ userId, id }: OwnedInput): Promise<Challenge> {
    const challenge = await this.prisma.challenge.findUnique({ where: { id } });

    if (challenge?.streamerUserId !== userId) {
      throw new AppNotFoundException('NOT_FOUND', `No challenge ${id}`);
    }

    return challenge;
  }
}
