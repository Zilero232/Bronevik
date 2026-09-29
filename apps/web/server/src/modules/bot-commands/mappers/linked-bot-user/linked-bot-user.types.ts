import type { BotUserRow } from '../../selects';

export type ToLinkedBotUserInput = {
  userId: string;
  user: BotUserRow;
  languageHint?: string | null;
};
