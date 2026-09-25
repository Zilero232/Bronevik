import { Injectable } from '@nestjs/common';

import type { StreamerProfile } from '../../../../generated';
import type { StreamerProfileView, UpsertProfileInput } from '../streamers.types';

import { Prisma } from '../../../../generated';
import { AppConflictException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { readRecord, toNumber } from '../../../common/lib';
import { isUniqueViolation, PrismaService } from '../../../core';

@Injectable()
export class StreamerProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string): Promise<StreamerProfileView> {
    const profile = await this.prisma.streamerProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new AppNotFoundException('NOT_FOUND', 'No streamer profile yet');
    }

    return this.toView(profile);
  }

  async bySlug(slug: string): Promise<StreamerProfileView> {
    const profile = await this.prisma.streamerProfile.findUnique({ where: { slug } });

    if (!profile) {
      throw new AppNotFoundException('NOT_FOUND', `No streamer ${slug}`);
    }

    return this.toView(profile);
  }

  async upsert({ userId, slug, displayName, accountId, bio, links }: UpsertProfileInput): Promise<StreamerProfileView> {
    if (accountId) {
      const owned = await this.prisma.userLestaAccount.count({ where: { userId, accountId: BigInt(accountId) } });

      if (owned === 0) {
        throw new AppForbiddenException('FORBIDDEN', 'The account is not linked to this user');
      }
    }

    const data = {
      slug,
      displayName,
      ...(accountId === undefined ? {} : { accountId: accountId === null ? null : BigInt(accountId) }),
      ...(bio === undefined ? {} : { bio }),
      ...(links === undefined ? {} : { links: links === null ? Prisma.JsonNull : links })
    };

    try {
      const profile = await this.prisma.streamerProfile.upsert({ where: { userId }, create: { userId, ...data }, update: data });

      return this.toView(profile);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppConflictException('CONFLICT', `The slug ${slug} is taken`);
      }

      throw error;
    }
  }

  private toView(profile: StreamerProfile): StreamerProfileView {
    const links = profile.links ? readRecord(profile.links) : null;

    return {
      slug: profile.slug,
      displayName: profile.displayName,
      accountId: profile.accountId === null ? null : toNumber(profile.accountId),
      bio: profile.bio,
      links: links ? Object.fromEntries(Object.entries(links).filter((entry): entry is [string, string] => typeof entry[1] === 'string')) : null,
      isLive: profile.isLive
    };
  }
}
