import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import type { StreamerProfile } from '../../../../generated';
import type { PlatformVideo, ReplaceChannelsInput, StreamerProfileView, UpsertProfileInput } from '../streamers.types';

import { AppBadRequestException, AppConflictException, AppForbiddenException, AppNotFoundException } from '../../../common/exceptions';
import { isUniqueViolation, PrismaService, REDIS } from '../../../core';
import { STREAMERS } from '../config';
import { parseChannel } from '../lib';
import { LivePlatformsService } from './live-platforms.service';
import { StreamerCardsService } from './streamer-cards.service';

@Injectable()
export class StreamerProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cards: StreamerCardsService,
    private readonly platforms: LivePlatformsService,
    @Inject(REDIS) private readonly redis: Redis
  ) {}

  async get(userId: string): Promise<StreamerProfileView> {
    const profile = await this.prisma.streamerProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new AppNotFoundException('NOT_FOUND', 'No streamer profile yet');
    }

    return this.toView(profile);
  }

  async bySlug(slug: string): Promise<StreamerProfileView> {
    return this.toView(await this.publicBySlug(slug));
  }

  async publicBySlug(slug: string): Promise<StreamerProfile> {
    const profile = await this.prisma.streamerProfile.findUnique({ where: { slug } });

    if (!profile || profile.hiddenAt || (profile.kind === 'editorial' && !STREAMERS.editorialEnabled)) {
      throw new AppNotFoundException('NOT_FOUND', `No streamer ${slug}`);
    }

    return profile;
  }

  async upsert({ userId, slug, displayName, accountId, bio, channels }: UpsertProfileInput): Promise<StreamerProfileView> {
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
      ...(bio === undefined ? {} : { bio })
    };

    try {
      const profile = await this.prisma.streamerProfile.upsert({
        where: { userId },
        create: { userId, kind: 'claimed', ...data },
        update: data
      });

      if (channels) {
        await this.replaceChannels({ profileId: profile.id, channels });
      }

      return this.toView(profile);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppConflictException('CONFLICT', `The slug ${slug} or a channel is taken`);
      }

      throw error;
    }
  }

  async replaceChannels({ profileId, channels }: ReplaceChannelsInput): Promise<void> {
    const parsed = channels.map((channel) => {
      const result = parseChannel(channel);

      if (!result) {
        throw new AppBadRequestException('VALIDATION_FAILED', `Not a ${channel.platform} channel url: ${channel.url}`);
      }

      return { ...result, sourceUrl: channel.sourceUrl ?? null };
    });

    const existing = await this.prisma.streamerChannel.findMany({ where: { profileId } });
    const kept = parsed.map((channel) => existing.find((row) => row.platform === channel.platform && row.handle === channel.handle));

    await this.prisma.$transaction([
      this.prisma.streamerChannel.deleteMany({ where: { profileId, id: { notIn: kept.flatMap((row) => (row ? [row.id] : [])) } } }),
      ...parsed.flatMap((channel, index) =>
        kept[index]
          ? []
          : [
              this.prisma.streamerChannel.create({
                data: { profileId, platform: channel.platform, handle: channel.handle, url: channel.url, sourceUrl: channel.sourceUrl }
              })
            ]
      )
    ]);
  }

  async toView(profile: StreamerProfile): Promise<StreamerProfileView> {
    const [channels, settings, followers, live] = await Promise.all([
      this.prisma.streamerChannel.findMany({ where: { profileId: profile.id }, orderBy: { createdAt: 'asc' } }),
      this.prisma.streamerSettings.findUnique({ where: { profileId: profile.id }, select: { profileId: true } }),
      this.prisma.streamerFollow.count({ where: { profileId: profile.id } }),
      this.cards.live(profile)
    ]);

    const youtube = channels.find((channel) => channel.platform === 'youtube' && channel.handle.startsWith('UC'));

    return {
      slug: profile.slug,
      displayName: profile.displayName,
      kind: profile.kind,
      accountId: this.cards.accountIdOf(profile),
      accountSourceUrl: profile.accountSourceUrl,
      bio: profile.bio,
      channels: channels.map((channel) => this.cards.channelView(channel)),
      isLive: profile.isLive,
      live,
      hasSettings: settings !== null,
      followers,
      latestVideos: youtube ? await this.videos(youtube.handle) : []
    };
  }

  private async videos(channelId: string): Promise<PlatformVideo[]> {
    const key = `${STREAMERS.cachePrefix}videos:${channelId}`;
    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as PlatformVideo[];
    }

    const videos = await this.platforms.youtubeVideos(channelId);

    await this.redis.set(key, JSON.stringify(videos), 'EX', STREAMERS.videosCacheSeconds);

    return videos;
  }
}
