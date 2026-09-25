import { telegramLinkCodeSchema, telegramSessionTokenSchema, telegramStatusSchema, telegramWebLoginSchema } from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';

export class TelegramStatusDto extends createZodDto(telegramStatusSchema) {}
export class TelegramLinkCodeDto extends createZodDto(telegramLinkCodeSchema) {}
export class TelegramWebLoginDto extends createZodDto(telegramWebLoginSchema) {}
export class TelegramSessionTokenDto extends createZodDto(telegramSessionTokenSchema) {}
