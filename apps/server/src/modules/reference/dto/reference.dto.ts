import { gameVersionSchema, serversOnlineSchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class GameVersionDto extends createZodDto(gameVersionSchema) {}
export class ServersOnlineDto extends createZodDto(serversOnlineSchema) {}
