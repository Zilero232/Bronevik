import type { APIApplicationCommandInteractionDataBasicOption } from 'discord-api-types/v10';

import type { OptionInput } from './interaction-options.types';

const optionOf = ({ options, name }: OptionInput): APIApplicationCommandInteractionDataBasicOption | undefined =>
  options?.find((option): option is APIApplicationCommandInteractionDataBasicOption => option.name === name && 'value' in option);

export const stringOption = (input: OptionInput): string | null => {
  const value = optionOf(input)?.value;

  return typeof value === 'string' ? value.trim() : null;
};

export const booleanOption = (input: OptionInput): boolean => optionOf(input)?.value === true;
