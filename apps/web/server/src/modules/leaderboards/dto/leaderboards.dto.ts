import { leaderboardQuerySchema, leaderboardSchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class LeaderboardQueryDto extends createZodDto(leaderboardQuerySchema) {}
export class LeaderboardDto extends createZodDto(leaderboardSchema) {}
