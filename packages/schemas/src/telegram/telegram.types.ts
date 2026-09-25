import type { z } from 'zod';

import type { telegramLinkCodeSchema, telegramSessionTokenSchema, telegramStatusSchema, telegramWebLoginSchema } from './telegram.schemas';

export type TelegramStatus = z.infer<typeof telegramStatusSchema>;
export type TelegramLinkCode = z.infer<typeof telegramLinkCodeSchema>;
export type TelegramWebLoginInput = z.infer<typeof telegramWebLoginSchema>;
export type TelegramSessionToken = z.infer<typeof telegramSessionTokenSchema>;
