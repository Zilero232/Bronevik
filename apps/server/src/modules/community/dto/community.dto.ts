import { createZodDto } from 'nestjs-zod';

import {
  boardTokenQuerySchema,
  bracketSchema,
  buildListSchema,
  buildPageSchema,
  buildsQuerySchema,
  checkoutSchema,
  coachesQuerySchema,
  coachingOrderListSchema,
  coachingOrderSchema,
  coachOfferSchema,
  coachPageSchema,
  coachSchema,
  commentListSchema,
  commentSchema,
  commentsQuerySchema,
  contentReportListSchema,
  contentReportSchema,
  createCommentSchema,
  createGuideSchema,
  createOfferSchema,
  createOrderSchema,
  createPlatoonSchema,
  createRecruitingSchema,
  createReportSchema,
  createTacticBoardSchema,
  createTournamentSchema,
  guideAuthorSchema,
  guideAuthorsSchema,
  guideListSchema,
  guidePageSchema,
  guideSchema,
  guidesQuerySchema,
  idParamsSchema,
  likeResultSchema,
  moderateSchema,
  moderationTargetParamsSchema,
  pendingGuidesSchema,
  platoonPageSchema,
  platoonPostSchema,
  platoonQuerySchema,
  recruitingPageSchema,
  recruitingPostSchema,
  recruitingQuerySchema,
  registerTournamentSchema,
  reportMatchSchema,
  reportsQuerySchema,
  resolveReportSchema,
  reviewOrderSchema,
  slugParamsSchema,
  tacticBoardDataSchema,
  tacticBoardListSchema,
  tacticBoardSchema,
  tacticLayerSchema,
  tankParamsSchema,
  tournamentPageSchema,
  tournamentParticipantSchema,
  tournamentSchema,
  tournamentsQuerySchema,
  updateBuildSchema,
  updateGuideSchema,
  updateOfferSchema,
  updateTacticBoardSchema,
  upsertCoachSchema
} from './community.schemas';

export class IdParamsDto extends createZodDto(idParamsSchema) {}
export class TankParamsDto extends createZodDto(tankParamsSchema) {}
export class SlugParamsDto extends createZodDto(slugParamsSchema) {}
export class LikeResultDto extends createZodDto(likeResultSchema) {}
export class BuildsQueryDto extends createZodDto(buildsQuerySchema) {}
export class BuildPageDto extends createZodDto(buildPageSchema) {}
export class BuildListDto extends createZodDto(buildListSchema) {}
export class UpdateBuildDto extends createZodDto(updateBuildSchema) {}
export class GuideDto extends createZodDto(guideSchema) {}
export class GuidesQueryDto extends createZodDto(guidesQuerySchema) {}
export class GuidePageDto extends createZodDto(guidePageSchema) {}
export class GuideListDto extends createZodDto(guideListSchema) {}
export class CreateGuideDto extends createZodDto(createGuideSchema) {}
export class UpdateGuideDto extends createZodDto(updateGuideSchema) {}
export class GuideAuthorDto extends createZodDto(guideAuthorSchema) {}
export class GuideAuthorsDto extends createZodDto(guideAuthorsSchema) {}
export class CommentDto extends createZodDto(commentSchema) {}
export class CommentsQueryDto extends createZodDto(commentsQuerySchema) {}
export class CommentListDto extends createZodDto(commentListSchema) {}
export class CreateCommentDto extends createZodDto(createCommentSchema) {}
export class PlatoonPostDto extends createZodDto(platoonPostSchema) {}
export class PlatoonQueryDto extends createZodDto(platoonQuerySchema) {}
export class PlatoonPageDto extends createZodDto(platoonPageSchema) {}
export class CreatePlatoonDto extends createZodDto(createPlatoonSchema) {}
export class RecruitingPostDto extends createZodDto(recruitingPostSchema) {}
export class RecruitingQueryDto extends createZodDto(recruitingQuerySchema) {}
export class RecruitingPageDto extends createZodDto(recruitingPageSchema) {}
export class CreateRecruitingDto extends createZodDto(createRecruitingSchema) {}
export class CoachOfferDto extends createZodDto(coachOfferSchema) {}
export class CoachDto extends createZodDto(coachSchema) {}
export class CoachesQueryDto extends createZodDto(coachesQuerySchema) {}
export class CoachPageDto extends createZodDto(coachPageSchema) {}
export class UpsertCoachDto extends createZodDto(upsertCoachSchema) {}
export class CreateOfferDto extends createZodDto(createOfferSchema) {}
export class UpdateOfferDto extends createZodDto(updateOfferSchema) {}
export class CoachingOrderDto extends createZodDto(coachingOrderSchema) {}
export class CoachingOrderListDto extends createZodDto(coachingOrderListSchema) {}
export class CreateOrderDto extends createZodDto(createOrderSchema) {}
export class ReviewOrderDto extends createZodDto(reviewOrderSchema) {}
export class CheckoutDto extends createZodDto(checkoutSchema) {}
export class BracketDto extends createZodDto(bracketSchema) {}
export class TournamentParticipantDto extends createZodDto(tournamentParticipantSchema) {}
export class TournamentDto extends createZodDto(tournamentSchema) {}
export class TournamentsQueryDto extends createZodDto(tournamentsQuerySchema) {}
export class TournamentPageDto extends createZodDto(tournamentPageSchema) {}
export class CreateTournamentDto extends createZodDto(createTournamentSchema) {}
export class RegisterTournamentDto extends createZodDto(registerTournamentSchema) {}
export class ReportMatchDto extends createZodDto(reportMatchSchema) {}
export class CreateReportDto extends createZodDto(createReportSchema) {}
export class ContentReportDto extends createZodDto(contentReportSchema) {}
export class ReportsQueryDto extends createZodDto(reportsQuerySchema) {}
export class ContentReportListDto extends createZodDto(contentReportListSchema) {}
export class ResolveReportDto extends createZodDto(resolveReportSchema) {}
export class ModerateDto extends createZodDto(moderateSchema) {}
export class ModerationTargetParamsDto extends createZodDto(moderationTargetParamsSchema) {}
export class PendingGuidesDto extends createZodDto(pendingGuidesSchema) {}
export class TacticLayerDto extends createZodDto(tacticLayerSchema) {}
export class TacticBoardDataDto extends createZodDto(tacticBoardDataSchema) {}
export class TacticBoardDto extends createZodDto(tacticBoardSchema) {}
export class TacticBoardListDto extends createZodDto(tacticBoardListSchema) {}
export class CreateTacticBoardDto extends createZodDto(createTacticBoardSchema) {}
export class UpdateTacticBoardDto extends createZodDto(updateTacticBoardSchema) {}
export class BoardTokenQueryDto extends createZodDto(boardTokenQuerySchema) {}
