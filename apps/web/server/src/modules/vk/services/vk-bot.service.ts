import type { OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import type { MessageContext } from 'vk-io';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { Keyboard, VK } from 'vk-io';

import type { VkCallbackBody, VkKeyboardInput, VkTextInput } from '../vk.types';

import { errorMessage } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { AUTH_PROVIDER } from '../../../lib/auth';
import { BOT_LOCALE, BotAccountsService, BotRepliesService, createFluentStore, isPublicUrl, SITE_LINKS, siteUrl } from '../../bot-commands';
import { VK_BOT, VK_LOCALE_FILES, VK_TOKENS } from '../config';
import { parseVkCommand } from '../lib';

@Injectable()
export class VkBotService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(VkBotService.name);
  private readonly i18n = createFluentStore({ files: VK_LOCALE_FILES });
  private isPolling = false;

  constructor(
    @Inject(VK_TOKENS.bot) private readonly vk: VK | null,
    private readonly config: AppConfigService,
    private readonly accounts: BotAccountsService,
    private readonly replies: BotRepliesService
  ) {
    this.vk?.updates.on('message_new', (ctx) => this.onMessage(ctx));
  }

  get usesCallback(): boolean {
    return Boolean(this.config.get('VK_CALLBACK_CONFIRMATION') && this.config.get('VK_CALLBACK_SECRET'));
  }

  onApplicationBootstrap(): void {
    if (!this.vk) {
      this.logger.log('vk bot is disabled: VK_BOT_TOKEN or VK_GROUP_ID is empty');

      return;
    }

    if (this.config.get('NODE_ENV') === 'test' || this.usesCallback) {
      return;
    }

    this.vk.updates
      .startPolling()
      .then(() => {
        this.isPolling = true;
        this.logger.log('vk bot is polling');
      })
      .catch((error: unknown) => {
        this.logger.error(`vk polling could not start: ${errorMessage(error)}`);
      });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.vk && this.isPolling) {
      await this.vk.updates.stop();
    }
  }

  async handleWebhook(body: VkCallbackBody): Promise<void> {
    await this.vk?.updates.handleWebhookUpdate(body);
  }

  private async onMessage(ctx: MessageContext): Promise<void> {
    if (ctx.isOutbox || ctx.isGroup || !ctx.text) {
      return;
    }

    const parsed = parseVkCommand(ctx.text);

    if (!parsed && ctx.isChat) {
      return;
    }

    const linked = await this.accounts.find({ providerId: AUTH_PROVIDER.vk, externalId: String(ctx.senderId) }).catch(() => null);
    const locale = linked?.locale ?? BOT_LOCALE.fallbackLocale;

    try {
      if (!parsed || parsed.command === 'help') {
        await ctx.send({ message: this.t({ locale, key: 'help' }), keyboard: this.keyboard({ locale, reply: null, isLinked: Boolean(linked) }) });

        return;
      }

      const reply = await this.replies.reply({ command: parsed.command, locale, accountId: linked?.accountId ?? null, argument: parsed.argument });

      await ctx.send({ message: reply.text, keyboard: this.keyboard({ locale, reply, isLinked: Boolean(linked) }) });
    } catch (error) {
      this.logger.warn(`vk command failed: ${errorMessage(error)}`);
      await ctx.send(this.replies.failure({ locale, error }).text).catch(() => undefined);
    }
  }

  private keyboard({ locale, reply, isLinked }: VkKeyboardInput) {
    const builder = Keyboard.builder().inline();
    const miniApp = this.miniAppUrl();
    const connect = siteUrl({ webUrl: this.config.get('WEB_URL'), path: SITE_LINKS.settings });

    if (reply?.link) {
      builder.urlButton({ label: reply.link.label.slice(0, VK_BOT.maxLabelLength), url: reply.link.url }).row();
    }

    if (!reply) {
      builder
        .textButton({ label: this.t({ locale, key: 'button-stats' }) })
        .textButton({ label: this.t({ locale, key: 'button-session' }) })
        .row()
        .textButton({ label: this.t({ locale, key: 'button-marks' }) })
        .textButton({ label: this.t({ locale, key: 'button-top' }) })
        .row();
    }

    if (miniApp) {
      builder.urlButton({ label: this.t({ locale, key: 'open-app' }), url: miniApp }).row();
    } else if (!isLinked && isPublicUrl(connect)) {
      builder.urlButton({ label: this.t({ locale, key: 'connect-button' }), url: connect }).row();
    }

    return builder;
  }

  private miniAppUrl(): string | null {
    const appId = this.config.get('VK_MINI_APP_ID');

    return appId > 0 ? VK_BOT.miniAppUrl.replace('{id}', String(appId)) : null;
  }

  private t({ locale, key }: VkTextInput): string {
    return this.i18n.t(locale, key);
  }
}
