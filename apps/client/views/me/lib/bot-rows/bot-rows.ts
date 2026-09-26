import { isNonNullish } from 'remeda';

import type { BotLinks } from '../../api';
import type { BotRowLink, BotRowView } from './bot-rows.types';

const linksOf = (entries: [BotRowLink['key'], string | null][]): BotRowLink[] =>
  entries.flatMap(([key, href]) => (isNonNullish(href) ? [{ key, href }] : []));

export const botRows = ({ discord, vk }: BotLinks): BotRowView[] => [
  {
    provider: 'discord',
    accountId: discord.accountId,
    canLink: discord.linkEnabled,
    isAvailable: discord.enabled || discord.linkEnabled || discord.accountId !== null,
    links: linksOf([['invite', discord.inviteUrl]])
  },
  {
    provider: 'vk',
    accountId: vk.accountId,
    canLink: vk.linkEnabled,
    isAvailable: vk.enabled || vk.linkEnabled || vk.accountId !== null || vk.miniAppUrl !== null,
    links: linksOf([
      ['bot', vk.botUrl],
      ['miniApp', vk.miniAppUrl]
    ])
  }
];
