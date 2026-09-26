import { Injectable, Logger } from '@nestjs/common';
import { getAppToken } from '@twurple/auth';
import { chunk } from 'remeda';
import Parser from 'rss-parser';

import type { LiveStream } from '../lib';
import type { CachedToken, PlatformVideo } from '../streamers.types';

import { errorMessage } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { http } from '../../../lib/http';
import { LIVE, STREAMERS } from '../config';
import { twitchStreamsSchema, twitchUsersSchema, vkChannelsSchema, vkTokenSchema, youtubeChannelSchema, youtubeLiveSchema } from '../dto';

@Injectable()
export class LivePlatformsService {
  private readonly logger = new Logger(LivePlatformsService.name);
  private readonly parser = new Parser();
  private twitchToken: CachedToken | null = null;
  private vkToken: CachedToken | null = null;

  constructor(private readonly config: AppConfigService) {}

  hasTwitch(): boolean {
    return this.config.get('TWITCH_CLIENT_ID') !== '' && this.config.get('TWITCH_CLIENT_SECRET') !== '';
  }

  hasVk(): boolean {
    return this.config.get('VK_LIVE_CLIENT_ID') !== '' && this.config.get('VK_LIVE_CLIENT_SECRET') !== '';
  }

  hasYoutube(): boolean {
    return this.config.get('YOUTUBE_API_KEY') !== '';
  }

  async twitchStreams(logins: readonly string[]): Promise<LiveStream[]> {
    if (!this.hasTwitch() || logins.length === 0) {
      return [];
    }

    const token = await this.twitchAccess();
    const streams: LiveStream[] = [];

    for (const part of chunk([...logins], LIVE.twitch.batch)) {
      const body = await http
        .get(`${LIVE.twitch.helixUrl}/streams`, {
          searchParams: new URLSearchParams(part.map((login): [string, string] => ['user_login', login])),
          headers: { 'client-id': this.config.get('TWITCH_CLIENT_ID'), authorization: `Bearer ${token}` }
        })
        .json();

      for (const stream of twitchStreamsSchema.parse(body).data) {
        streams.push({ platform: 'twitch', handle: stream.user_login.toLowerCase(), viewers: stream.viewer_count });
      }
    }

    return streams;
  }

  async twitchDescription(login: string): Promise<string | null> {
    if (!this.hasTwitch()) {
      return null;
    }

    const token = await this.twitchAccess();
    const body = await http
      .get(`${LIVE.twitch.helixUrl}/users`, {
        searchParams: { login },
        headers: { 'client-id': this.config.get('TWITCH_CLIENT_ID'), authorization: `Bearer ${token}` }
      })
      .json();

    return twitchUsersSchema.parse(body).data[0]?.description ?? null;
  }

  async vkStreams(handles: readonly string[]): Promise<LiveStream[]> {
    if (!this.hasVk() || handles.length === 0) {
      return [];
    }

    const streams: LiveStream[] = [];

    for (const part of chunk([...handles], LIVE.vk.batch)) {
      for (const entry of await this.vkChannels(part)) {
        const handle = entry.channel.nick?.toLowerCase() ?? '';

        if (handle !== '' && entry.stream?.status === 'online') {
          streams.push({ platform: 'vkVideoLive', handle, viewers: entry.stream.counters?.viewers ?? null });
        }
      }
    }

    return streams;
  }

  async vkDescription(handle: string): Promise<string | null> {
    if (!this.hasVk()) {
      return null;
    }

    return (await this.vkChannels([handle]))[0]?.channel.description ?? null;
  }

  async youtubeLive(channelIds: readonly string[]): Promise<LiveStream[]> {
    if (!this.hasYoutube()) {
      return [];
    }

    const streams: LiveStream[] = [];

    for (const channelId of channelIds) {
      try {
        const body = await http
          .get(`${LIVE.youtube.apiUrl}/search`, {
            searchParams: { part: 'id', channelId, eventType: 'live', type: 'video', key: this.config.get('YOUTUBE_API_KEY') }
          })
          .json();

        if (youtubeLiveSchema.parse(body).items.length > 0) {
          streams.push({ platform: 'youtube', handle: channelId.toLowerCase(), viewers: null });
        }
      } catch (error) {
        this.logger.warn(`youtube live check failed for ${channelId}: ${errorMessage(error)}`);
      }
    }

    return streams;
  }

  async youtubeDescription(channelId: string): Promise<string | null> {
    if (!this.hasYoutube()) {
      return null;
    }

    const body = await http
      .get(`${LIVE.youtube.apiUrl}/channels`, { searchParams: { part: 'snippet', id: channelId, key: this.config.get('YOUTUBE_API_KEY') } })
      .json();

    return youtubeChannelSchema.parse(body).items[0]?.snippet.description ?? null;
  }

  async youtubeVideos(channelId: string): Promise<PlatformVideo[]> {
    try {
      const feed = await this.parser.parseURL(`${LIVE.youtube.rssUrl}?channel_id=${encodeURIComponent(channelId)}`);

      return feed.items
        .slice(0, STREAMERS.videosLimit)
        .flatMap((item) =>
          item.link && item.title && item.isoDate ? [{ id: item.id ?? item.link, title: item.title, url: item.link, publishedAt: item.isoDate }] : []
        );
    } catch (error) {
      this.logger.warn(`youtube rss failed for ${channelId}: ${errorMessage(error)}`);

      return [];
    }
  }

  private async vkChannels(handles: readonly string[]) {
    const token = await this.vkAccess();
    const body = await http
      .post(`${LIVE.vk.apiUrl}/v1/channels`, {
        json: { channels: handles.map((handle) => ({ url: `https://live.vkvideo.ru/${handle}` })) },
        headers: { authorization: `Bearer ${token}` }
      })
      .json();

    return vkChannelsSchema.parse(body).data.channels;
  }

  private async twitchAccess(): Promise<string> {
    if (this.twitchToken && this.twitchToken.expiresAt > Date.now()) {
      return this.twitchToken.value;
    }

    const token = await getAppToken(this.config.get('TWITCH_CLIENT_ID'), this.config.get('TWITCH_CLIENT_SECRET'));

    this.twitchToken = { value: token.accessToken, expiresAt: Date.now() + (token.expiresIn ?? 3600) * LIVE.tokenMsPerSecond };

    return token.accessToken;
  }

  private async vkAccess(): Promise<string> {
    if (this.vkToken && this.vkToken.expiresAt > Date.now()) {
      return this.vkToken.value;
    }

    const credentials = Buffer.from(`${this.config.get('VK_LIVE_CLIENT_ID')}:${this.config.get('VK_LIVE_CLIENT_SECRET')}`).toString('base64');
    const body = await http
      .post(LIVE.vk.tokenUrl, { body: new URLSearchParams({ grant_type: 'client_credentials' }), headers: { authorization: `Basic ${credentials}` } })
      .json();

    const token = vkTokenSchema.parse(body);

    this.vkToken = { value: token.access_token, expiresAt: Date.now() + token.expires_in * LIVE.tokenMsPerSecond };

    return token.access_token;
  }
}
