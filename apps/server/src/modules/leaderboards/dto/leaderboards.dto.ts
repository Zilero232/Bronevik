import { leaderboardQuerySchema, leaderboardSchema } from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';

export class LeaderboardQueryDto extends createZodDto(leaderboardQuerySchema) {}
export class LeaderboardDto extends createZodDto(leaderboardSchema) {}
