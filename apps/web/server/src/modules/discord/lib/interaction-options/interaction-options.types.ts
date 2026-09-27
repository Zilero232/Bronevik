import type { APIApplicationCommandInteractionDataOption } from 'discord-api-types/v10';

export type OptionInput = {
  options: readonly APIApplicationCommandInteractionDataOption[] | undefined;
  name: string;
};
