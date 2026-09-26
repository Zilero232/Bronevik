import { DiscordAPIError } from '@discordjs/rest';
import { RESTJSONErrorCodes } from 'discord-api-types/v10';

export const isUnknownMember = (error: unknown): boolean => error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.UnknownMember;
