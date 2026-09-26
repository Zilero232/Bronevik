import { Injectable } from '@nestjs/common';

import type { BotContext, PlayerTextInput } from '../telegram.types';

import { formatNumberOr, formatPercentOr } from '../../../common/lib';
import { AppConfigService, TIME } from '../../../config';
import { openButton, playerUrl, statCardUrl } from '../lib';
import { TelegramStatsService } from './telegram-stats.service';

@Injectable()
export class TelegramPlayerCommandsService {
  constructor(
    private readonly config: AppConfigService,
    private readonly stats: TelegramStatsService
  ) {}

  async me(ctx: BotContext): Promise<void> {
    const nickname = typeof ctx.match === 'string' ? ctx.match.trim() : '';
    const accountId = nickname ? await this.stats.resolve(nickname) : ctx.chat$?.accountId;

    if (!accountId) {
      await ctx.reply(ctx.t('not-linked'));

      return;
    }

    const card = await this.stats.player(accountId);
    const webUrl = this.config.get('WEB_URL');

    await ctx.reply(await this.playerText({ ctx, card }), {
      link_preview_options: { url: statCardUrl({ webUrl, accountId }), prefer_large_media: true },
      reply_markup: openButton({ label: ctx.t('open-site'), url: playerUrl({ webUrl, nickname: card.nickname }) })
    });
  }

  async playerText({ ctx, card }: PlayerTextInput): Promise<string> {
    const locale = await ctx.i18n.getLocale();
    const missing = ctx.t('missing');

    return ctx.t('player-card', {
      nickname: card.nickname,
      clan: card.clanTag ? `[${card.clanTag}]` : '',
      battles: formatNumberOr({ value: card.battles, locale, missing }),
      winRate: formatPercentOr({ value: card.winRate === null ? null : card.winRate / 100, locale, missing }),
      avgDamage: formatNumberOr({ value: card.avgDamage, locale, missing }),
      wn8: formatNumberOr({ value: card.wn8, locale, missing })
    });
  }

  async session(ctx: BotContext): Promise<void> {
    const accountId = ctx.chat$?.accountId;

    if (!accountId) {
      await ctx.reply(ctx.t('not-linked'));

      return;
    }

    const session = await this.stats.session(accountId);

    if (!session) {
      await ctx.reply(ctx.t('session-none'));

      return;
    }

    const locale = await ctx.i18n.getLocale();
    const missing = ctx.t('missing');

    await ctx.reply(
      ctx.t('session-card', {
        startedAt: new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short', timeZone: TIME.zone }).format(session.startedAt),
        state: ctx.t(session.isOpen ? 'session-open' : 'session-closed'),
        battles: session.battles,
        winRate: formatPercentOr({ value: session.wins / session.battles, locale, missing }),
        avgDamage: formatNumberOr({ value: session.avgDamage, locale, missing }),
        wn8: formatNumberOr({ value: session.wn8, locale, missing })
      })
    );
  }

  async marks(ctx: BotContext): Promise<void> {
    const accountId = ctx.chat$?.accountId;

    if (!accountId) {
      await ctx.reply(ctx.t('not-linked'));

      return;
    }

    const card = await this.stats.marks(accountId);

    if (card.moe1 + card.moe2 + card.moe3 === 0 && card.closest.length === 0) {
      await ctx.reply(ctx.t('marks-none'));

      return;
    }

    const locale = await ctx.i18n.getLocale();
    const lines = card.closest.map((line) =>
      ctx.t('marks-line', {
        tank: line.tankName,
        percent: formatNumberOr({ value: line.percent, locale, digits: 2, missing: '0' }),
        marks: line.marks
      })
    );

    const text = [
      ctx.t('marks-card', { moe3: card.moe3, moe2: card.moe2, moe1: card.moe1 }),
      ...(lines.length > 0 ? ['', ctx.t('marks-closest'), ...lines] : [])
    ];

    await ctx.reply(text.join('\n'));
  }
}
