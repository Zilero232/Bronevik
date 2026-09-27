import type { BotLocale, BotReply } from '../bot-commands';

export type VkTextInput = {
  locale: BotLocale;
  key: string;
};

export type VkKeyboardInput = {
  locale: BotLocale;
  reply: BotReply | null;
  isLinked: boolean;
};

export type VkCallbackBody = {
  type?: unknown;
  secret?: unknown;
} & Record<string, unknown>;
