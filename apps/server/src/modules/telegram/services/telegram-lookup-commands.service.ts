import { Injectable } from '@nestjs/common';

import type { BotContext } from '../telegram.types';

import { formatNumberOr } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { SITE_LINKS } from '../config';
import { openButton, siteUrl } from '../lib';
import { TelegramStatsService } from './telegram-stats.service';

@Injectable()
export class TelegramLookupCommandsService {
  constructor(
    private readonly config: AppConfigService,
    private readonly stats: TelegramStatsService
  ) {}

  async clan(ctx: BotContext): Promise<void> {
    const accountId = ctx.chat$?.accountId;

    if (!accountId) {
      await ctx.reply(ctx.t('not-linked'));

      return;
    }

    const clan = await this.stats.clan(accountId);

    if (!clan) {
      await ctx.reply(ctx.t('clan-none'));

      return;
    }

    await ctx.reply(ctx.t('clan-card', { tag: clan.tag, name: clan.name, members: clan.membersCount, role: clan.role }), {
      reply_markup: openButton({
        label: ctx.t('open-site'),
        url: siteUrl({ webUrl: this.config.get('WEB_URL'), path: SITE_LINKS.clan.replace('{tag}', clan.tag) })
      })
    });
  }

  async tank(ctx: BotContext): Promise<void> {
    const query = typeof ctx.match === 'string' ? ctx.match.trim() : '';

    if (!query) {
      await ctx.reply(ctx.t('tank-usage'));

      return;
    }

    const tank = await this.stats.tank(query);

    if (!tank) {
      await ctx.reply(ctx.t('tank-not-found'));

      return;
    }

    const locale = await ctx.i18n.getLocale();
    const missing = ctx.t('missing');
    const text = tank.moe
      ? ctx.t('tank-card', {
          name: tank.name,
          tier: tank.tier,
          type: tank.type,
          p65: formatNumberOr({ value: tank.moe.p65, locale, missing }),
          p85: formatNumberOr({ value: tank.moe.p85, locale, missing }),
          p95: formatNumberOr({ value: tank.moe.p95, locale, missing })
        })
      : `${tank.name}\n${ctx.t('tank-no-thresholds')}`;

    await ctx.reply(text, {
      reply_markup: openButton({
        label: ctx.t('open-site'),
        url: siteUrl({ webUrl: this.config.get('WEB_URL'), path: SITE_LINKS.tank.replace('{slug}', tank.slug) })
      })
    });
  }

  async top(ctx: BotContext): Promise<void> {
    const rows = await this.stats.top();

    if (rows.length === 0) {
      await ctx.reply(ctx.t('top-empty'));

      return;
    }

    const locale = await ctx.i18n.getLocale();
    const lines = rows.map((row, index) =>
      ctx.t('top-line', {
        place: index + 1,
        nickname: row.nickname,
        wn8: formatNumberOr({ value: row.wn8, locale, missing: '0' }),
        battles: formatNumberOr({ value: row.battles, locale, missing: '0' })
      })
    );

    await ctx.reply([ctx.t('top-header'), ...lines].join('\n'));
  }
}
