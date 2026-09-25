import { Injectable } from '@nestjs/common';
import { InlineQueryResultBuilder } from 'grammy';

import type { BotContext } from '../telegram.types';

import { AppConfigService } from '../../../config';
import { BOT_TEXT_LIMITS } from '../config';
import { formatNumber, formatPercent, isPublicUrl, statCardUrl } from '../lib';
import { TelegramCommandsService } from './telegram-commands.service';
import { TelegramStatsService } from './telegram-stats.service';

@Injectable()
export class TelegramInlineService {
  constructor(
    private readonly config: AppConfigService,
    private readonly stats: TelegramStatsService,
    private readonly commands: TelegramCommandsService
  ) {}

  async answer(ctx: BotContext): Promise<void> {
    const query = ctx.inlineQuery?.query.trim() ?? '';
    const options = { cache_time: BOT_TEXT_LIMITS.inlineCacheSeconds };

    if (query.length < BOT_TEXT_LIMITS.queryMinLength) {
      await ctx.answerInlineQuery([], options);

      return;
    }

    const accountId = await this.stats.resolve(query).catch(() => null);

    if (!accountId) {
      await ctx.answerInlineQuery([], options);

      return;
    }

    const card = await this.stats.player(accountId);
    const locale = await ctx.i18n.getLocale();
    const missing = ctx.t('missing');
    const image = statCardUrl({ webUrl: this.config.get('WEB_URL'), accountId });
    const text = await this.commands.playerText({ ctx, card });

    const result = InlineQueryResultBuilder.article(`player-${accountId}`, card.nickname, {
      description: ctx.t('inline-card-description', {
        wn8: formatNumber({ value: card.wn8, locale }) ?? missing,
        winRate: formatPercent({ value: card.winRate === null ? null : card.winRate / 100, locale }) ?? missing,
        battles: formatNumber({ value: card.battles, locale }) ?? missing
      }),
      ...(isPublicUrl(image) ? { thumbnail_url: image } : {})
    }).text(text, { link_preview_options: { url: image, prefer_large_media: true } });

    await ctx.answerInlineQuery([result], options);
  }
}
