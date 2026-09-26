import { Injectable } from '@nestjs/common';

import type { BotHandler, ExternalBotCommand, ExternalCommandSpec, RunExternalCommandInput } from '../telegram.types';

@Injectable()
export class TelegramCommandRegistry {
  private readonly handlers = new Map<ExternalBotCommand, BotHandler>();

  register({ command, run }: ExternalCommandSpec): void {
    this.handlers.set(command, run);
  }

  async run({ command, ctx }: RunExternalCommandInput): Promise<void> {
    await this.handlers.get(command)?.(ctx);
  }
}
