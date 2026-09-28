import type { RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';

import type { NotificationMessageInput } from './notification-message.types';

import { isPublicUrl } from '../../../bot-commands';
import { DISCORD } from '../../config';

export const toNotificationMessage = ({ title, body, url }: NotificationMessageInput): RESTPostAPIChannelMessageJSONBody => ({
  embeds: [{ color: DISCORD.embedColor, title, description: body, ...(isPublicUrl(url) ? { url } : {}) }],
  allowed_mentions: { parse: [] }
});
