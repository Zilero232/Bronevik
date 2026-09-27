import type { EditInteractionResponseOptions } from '@discordjs/core';

import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { isNonNullish } from 'remeda';

import type { ToMessageInput } from './reply-message.types';

import { isPublicUrl } from '../../../bot-commands';
import { DISCORD } from '../../config';

export const toMessage = ({ reply, connect }: ToMessageInput): EditInteractionResponseOptions => {
  const buttons = [reply.link, connect].filter(isNonNullish).map((link) => ({
    type: ComponentType.Button as const,
    style: ButtonStyle.Link as const,
    label: link.label,
    url: link.url
  }));

  return {
    content: reply.text,
    embeds: reply.imageUrl && isPublicUrl(reply.imageUrl) ? [{ color: DISCORD.embedColor, image: { url: reply.imageUrl } }] : [],
    components: buttons.length > 0 ? [{ type: ComponentType.ActionRow, components: buttons }] : []
  };
};
