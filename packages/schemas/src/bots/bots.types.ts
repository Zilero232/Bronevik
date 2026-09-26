import type { z } from 'zod';

import type { discordStatusSchema, vkStatusSchema } from './bots.schemas';

export type DiscordStatus = z.infer<typeof discordStatusSchema>;
export type VkStatus = z.infer<typeof vkStatusSchema>;
