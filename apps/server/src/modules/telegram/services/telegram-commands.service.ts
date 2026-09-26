import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InlineKeyboard } from 'grammy';

import type { BotCommandSpec, BotContext, ConsumeInput, GuardInput, TelegramIdentity } from '../telegram.types';

import { errorMessage } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { BOT, WEB_LOGIN } from '../config';
import { isPublicUrl, looksLikeLinkCode } from '../lib';
import { TelegramIdentityService } from './telegram-identity.service';
import { TelegramLinkService } from './telegram-link.service';
import { TelegramLookupCommandsService } from './telegram-lookup-commands.service';
import { TelegramMissionCommandsService } from './telegram-mission-commands.service';
import { TelegramPlayerCommandsService } from './telegram-player-commands.service';
import { TelegramPlaylistCommandsService } from './telegram-playlist-commands.service';

@Injectable()
export class TelegramCommandsService {
  private readonly logger = new Logger(TelegramCommandsService.name);

  constructor(
    private readonly config: AppConfigService,
    private readonly players: TelegramPlayerCommandsService,
    private readonly lookups: TelegramLookupCommandsService,
    private readonly missions: TelegramMissionCommandsService,
    private readonly playlists: TelegramPlaylistCommandsService,
    private readonly links: TelegramLinkService,
    private readonly identity: TelegramIdentityService
  ) {}

  get commands(): BotCommandSpec[] {
    return [
      { command: 'me', run: (ctx) => this.players.me(ctx) },
      { command: 'session', run: (ctx) => this.players.session(ctx) },
      { command: 'marks', run: (ctx) => this.players.marks(ctx) },
      { command: 'clan', run: (ctx) => this.lookups.clan(ctx) },
      { command: 'tank', run: (ctx) => this.lookups.tank(ctx) },
      { command: 'top', run: (ctx) => this.lookups.top(ctx) },
      { command: 'lbz', run: (ctx) => this.missions.lbz(ctx) },
      { command: 'next', run: (ctx) => this.playlists.next(ctx) },
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
        this.logger.warn(`telegram command failed: ${errorMessage(error)}`);
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
    await ctx.reply(ctx.t('help', { bot: this.config.get('TELEGRAM_BOT_USERNAME') || BOT.fallbackUsername }));
  }
}
