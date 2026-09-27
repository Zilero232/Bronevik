import { discordStatusSchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class DiscordStatusDto extends createZodDto(discordStatusSchema) {}
