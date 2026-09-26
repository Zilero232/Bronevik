import {
  analyticsAccountQuerySchema,
  analyticsBattleParamsSchema,
  analyticsBattlesQuerySchema,
  analyticsMapsSchema,
  analyticsOverviewSchema,
  analyticsPlatoonsSchema,
  analyticsQuerySchema,
  analyticsRngSchema,
  analyticsTankParamsSchema,
  analyticsTankQuerySchema,
  analyticsTankSchema,
  battleAnalysisSchema,
  firstWinSchema,
  myBattleSchema,
  myBattlesPageSchema,
  playlistQuerySchema,
  playlistSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class AnalyticsAccountQueryDto extends createZodDto(analyticsAccountQuerySchema) {}
export class AnalyticsQueryDto extends createZodDto(analyticsQuerySchema) {}
export class AnalyticsTankParamsDto extends createZodDto(analyticsTankParamsSchema) {}
export class AnalyticsTankQueryDto extends createZodDto(analyticsTankQuerySchema) {}
export class AnalyticsBattleParamsDto extends createZodDto(analyticsBattleParamsSchema) {}
export class AnalyticsBattlesQueryDto extends createZodDto(analyticsBattlesQuerySchema) {}
export class PlaylistQueryDto extends createZodDto(playlistQuerySchema) {}
export class AnalyticsOverviewDto extends createZodDto(analyticsOverviewSchema) {}
export class AnalyticsTankDto extends createZodDto(analyticsTankSchema) {}
export class AnalyticsMapsDto extends createZodDto(analyticsMapsSchema) {}
export class AnalyticsPlatoonsDto extends createZodDto(analyticsPlatoonsSchema) {}
export class AnalyticsRngDto extends createZodDto(analyticsRngSchema) {}
export class MyBattlesPageDto extends createZodDto(myBattlesPageSchema) {}
export class MyBattleDto extends createZodDto(myBattleSchema) {}
export class BattleAnalysisDto extends createZodDto(battleAnalysisSchema) {}
export class PlaylistDto extends createZodDto(playlistSchema) {}
export class FirstWinDto extends createZodDto(firstWinSchema) {}
