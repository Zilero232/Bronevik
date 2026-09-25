import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InlineKeyboard } from 'grammy';

import type { BotCommandSpec, BotContext, ConsumeInput, GuardInput, OpenButtonInput, PlayerTextInput, TelegramIdentity } from '../telegram.types';

import { AppConfigService } from '../../../config';
import { BOT_FALLBACK_USERNAME, SITE_LINKS, WEB_LOGIN } from '../config';
import { formatNumber, formatPercent, isPublicUrl, looksLikeLinkCode, playerUrl, siteUrl, statCardUrl } from '../lib';
import { TelegramIdentityService } from './telegram-identity.service';
import { TelegramLinkService } from './telegram-link.service';
import { TelegramStatsService } from './telegram-stats.service';

@Injectable()
export class TelegramCommandsService {
  private readonly logger = new Logger(TelegramCommandsService.name);

  constructor(
    private readonly config: AppConfigService,
    private readonly stats: TelegramStatsService,
    private readonly links: TelegramLinkService,
    private readonly identity: TelegramIdentityService
  ) {}

  get commands(): BotCommandSpec[] {
    return [
      { command: 'me', run: (ctx) => this.me(ctx) },
      { command: 'session', run: (ctx) => this.session(ctx) },
      { command: 'marks', run: (ctx) => this.marks(ctx) },
      { command: 'clan', run: (ctx) => this.clan(ctx) },
      { command: 'tank', run: (ctx) => this.tank(ctx) },
      { command: 'top', run: (ctx) => this.top(ctx) },
      { command: 'login', run: (ctx) => this.login(ctx) },
      { command: 'help', run: (ctx) => this.help(ctx) }
    ];
  }

  identityOf(ctx: BotContext): TelegramIdentity | null {
    const from = ctx.from;

    if (!from || from.is_bot) {
      return null;
    }

    return {
      telegramId: BigInt(from.id),
      username: from.username ?? null,
      name: from.username ?? from.first_name,
      languageCode: from.language_code ?? null
    };
  }

  async guard({ ctx, run }: GuardInput): Promise<void> {
    try {
      await run();
    } catch (error) {
      const isNotFound = error instanceof HttpException && error.getStatus() === HttpStatus.NOT_FOUND;

      if (!isNotFound) {
        this.logger.warn(`telegram command failed: ${error instanceof Error ? error.message : String(error)}`);
      }

      await ctx.reply(ctx.t(isNotFound ? 'player-not-found' : 'error-generic'));
    }
  }

  async start(ctx: BotContext): Promise<void> {
    const payload = typeof ctx.match === 'string' ? ctx.match.trim() : '';
    const identity = this.identityOf(ctx);

    if (!identity) {
      return;
    }

    if (looksLikeLinkCode(payload)) {
      await this.consume({ ctx, identity, code: payload });

      return;
    }

    const keyboard = new InlineKeyboard();
    const webUrl = this.config.get('WEB_URL');

    if (isPublicUrl(webUrl)) {
      const userId = await this.identity.ensureUser(identity);

      keyboard
        .url(ctx.t('login-button'), await this.links.issueWebLogin(userId))
        .row()
        .webApp(ctx.t('open-app'), webUrl);
    }

    await ctx.reply(ctx.t('start-welcome'), { reply_markup: keyboard });
  }

  async consume({ ctx, identity, code }: ConsumeInput): Promise<void> {
    try {
      await this.links.consumeCode({ code, identity });
      await ctx.reply(ctx.t('start-linked'));
    } catch (error) {
      const isConflict = error instanceof HttpException && error.getStatus() === HttpStatus.CONFLICT;

      await ctx.reply(ctx.t(isConflict ? 'start-code-taken' : 'start-code-invalid'));
    }
  }

  private async me(ctx: BotContext): Promise<void> {
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
      reply_markup: this.openButton({ ctx, url: playerUrl({ webUrl, nickname: card.nickname }) })
    });
  }

  async playerText({ ctx, card }: PlayerTextInput): Promise<string> {
    const locale = await ctx.i18n.getLocale();
    const missing = ctx.t('missing');

    return ctx.t('player-card', {
      nickname: card.nickname,
      clan: card.clanTag ? `[${card.clanTag}]` : '',
      battles: formatNumber({ value: card.battles, locale }) ?? missing,
      winRate: formatPercent({ value: card.winRate === null ? null : card.winRate / 100, locale }) ?? missing,
      avgDamage: formatNumber({ value: card.avgDamage, locale }) ?? missing,
      wn8: formatNumber({ value: card.wn8, locale }) ?? missing
    });
  }

  private async session(ctx: BotContext): Promise<void> {
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
        startedAt: new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Moscow' }).format(session.startedAt),
        state: ctx.t(session.isOpen ? 'session-open' : 'session-closed'),
        battles: session.battles,
        winRate: formatPercent({ value: session.wins / session.battles, locale }) ?? missing,
        avgDamage: formatNumber({ value: session.avgDamage, locale }) ?? missing,
        wn8: formatNumber({ value: session.wn8, locale }) ?? missing
      })
    );
  }

  private async marks(ctx: BotContext): Promise<void> {
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
      ctx.t('marks-line', { tank: line.tankName, percent: formatNumber({ value: line.percent, locale, digits: 2 }) ?? '0', marks: line.marks })
    );

    const text = [
      ctx.t('marks-card', { moe3: card.moe3, moe2: card.moe2, moe1: card.moe1 }),
      ...(lines.length > 0 ? ['', ctx.t('marks-closest'), ...lines] : [])
    ];

    await ctx.reply(text.join('\n'));
  }

  private async clan(ctx: BotContext): Promise<void> {
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
      reply_markup: this.openButton({ ctx, url: siteUrl({ webUrl: this.config.get('WEB_URL'), path: SITE_LINKS.clan.replace('{tag}', clan.tag) }) })
    });
  }

  private async tank(ctx: BotContext): Promise<void> {
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
          p65: formatNumber({ value: tank.moe.p65, locale }) ?? missing,
          p85: formatNumber({ value: tank.moe.p85, locale }) ?? missing,
          p95: formatNumber({ value: tank.moe.p95, locale }) ?? missing
        })
      : `${tank.name}\n${ctx.t('tank-no-thresholds')}`;

    await ctx.reply(text, {
      reply_markup: this.openButton({ ctx, url: siteUrl({ webUrl: this.config.get('WEB_URL'), path: SITE_LINKS.tank.replace('{slug}', tank.slug) }) })
    });
  }

  private async top(ctx: BotContext): Promise<void> {
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
        wn8: formatNumber({ value: row.wn8, locale }) ?? '0',
        battles: formatNumber({ value: row.battles, locale }) ?? '0'
      })
    );

    await ctx.reply([ctx.t('top-header'), ...lines].join('\n'));
  }

  private async login(ctx: BotContext): Promise<void> {
    const identity = this.identityOf(ctx);

    if (!identity) {
      return;
    }

    const userId = ctx.chat$?.userId ?? (await this.identity.ensureUser(identity));
    const url = await this.links.issueWebLogin(userId);

    await ctx.reply(`${ctx.t('login-link', { minutes: WEB_LOGIN.ttlMinutes })}\n${url}`, {
      link_preview_options: { is_disabled: true },
      reply_markup: isPublicUrl(url) ? new InlineKeyboard().url(ctx.t('login-button'), url) : undefined
    });
  }

  private async help(ctx: BotContext): Promise<void> {
    await ctx.reply(ctx.t('help', { bot: this.config.get('TELEGRAM_BOT_USERNAME') || BOT_FALLBACK_USERNAME }));
  }

  private openButton({ ctx, url }: OpenButtonInput): InlineKeyboard | undefined {
    return isPublicUrl(url) ? new InlineKeyboard().url(ctx.t('open-site'), url) : undefined;
  }
}
