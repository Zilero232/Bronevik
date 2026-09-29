import type { VK_COMMAND_ALIASES } from '../../config';

type VkCommand = keyof typeof VK_COMMAND_ALIASES;

export type ParsedVkCommand = {
  command: VkCommand;
  argument: string;
};
