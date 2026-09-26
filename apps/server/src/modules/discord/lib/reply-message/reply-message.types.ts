import type { BotLink, BotReply } from '../../../bot-commands';

export type ToMessageInput = {
  reply: BotReply;
  connect: BotLink | null;
};
