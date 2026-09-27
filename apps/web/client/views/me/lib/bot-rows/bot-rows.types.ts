import type { BotProvider } from '../../api';

export type BotRowLink = {
  key: 'bot' | 'invite' | 'miniApp';
  href: string;
};

export type BotRowView = {
  provider: BotProvider;
  accountId: string | null;
  canLink: boolean;
  isAvailable: boolean;
  links: BotRowLink[];
};
