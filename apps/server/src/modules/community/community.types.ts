import type { Build as BuildView, CreateBuildInput } from '@bronevik/schemas';
import type { z } from 'zod';

import type {
  CoachingOrderStatus,
  CommentTarget,
  ModerationStatus,
  PostStatus,
  Prisma,
  RecruitingPostKind,
  TacticBoard,
  TournamentStatus
} from '../../../generated';
import type { BUILD_INCLUDE, GUIDE_INCLUDE } from './config';
import type {
  buildPageSchema,
  buildsQuerySchema,
  checkoutSchema,
  coachesQuerySchema,
  coachingOrderSchema,
  coachPageSchema,
  coachSchema,
  commentSchema,
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
  guidePageSchema,
  guideSchema,
  guidesQuerySchema,
  likeResultSchema,
  platoonPageSchema,
  platoonQuerySchema,
  recruitingPageSchema,
  recruitingQuerySchema,
  registerTournamentSchema,
  reportMatchSchema,
  resolveReportSchema,
  reviewOrderSchema,
  tacticBoardDataSchema,
  tacticBoardSchema,
  tournamentPageSchema,
  tournamentSchema,
  tournamentsQuerySchema,
  updateBuildSchema,
  updateGuideSchema,
  updateOfferSchema,
  updateTacticBoardSchema,
  upsertCoachSchema
} from './dto/community.schemas';
import type { BoardRole } from './lib/board-access';
import type { PlayerStats } from './lib/requirements';

export type { BuildView, CreateBuildInput, PlayerStats };

export type Viewer = { viewerUserId: string | null };
export type Owned = { userId: string };
export type ById = { id: string };

export type LikeResult = z.infer<typeof likeResultSchema>;

export type BuildsQuery = z.output<typeof buildsQuerySchema> & Viewer;
export type BuildPage = z.infer<typeof buildPageSchema>;
export type CreateBuildRequest = CreateBuildInput & Owned;
export type UpdateBuildRequest = z.output<typeof updateBuildSchema> & Owned & ById;
export type PopularBuildsInput = { tankId: number } & Viewer;

export type GuideView = z.infer<typeof guideSchema>;
export type GuidesQuery = z.output<typeof guidesQuerySchema> & Viewer;
export type GuidePage = z.infer<typeof guidePageSchema>;
export type CreateGuideRequest = z.output<typeof createGuideSchema> & Owned;
export type UpdateGuideRequest = z.output<typeof updateGuideSchema> & Owned & ById;
export type GuideAuthor = z.infer<typeof guideAuthorSchema>;
export type GuideBySlugInput = { slug: string } & Viewer;

export type CommentView = z.infer<typeof commentSchema>;
export type ListCommentsInput = { target: CommentTarget; targetId: string };
export type CreateCommentRequest = Omit<z.output<typeof createCommentSchema>, 'target'> & Owned & { target: CommentTarget };

export type PlatoonQuery = z.output<typeof platoonQuerySchema>;
export type PlatoonPage = z.infer<typeof platoonPageSchema>;
export type CreatePlatoonRequest = z.output<typeof createPlatoonSchema> & Owned;

export type RecruitingQuery = Omit<z.output<typeof recruitingQuerySchema>, 'kind'> & { kind: RecruitingPostKind | undefined };
export type RecruitingPage = z.infer<typeof recruitingPageSchema>;
export type CreateRecruitingRequest = Omit<z.output<typeof createRecruitingSchema>, 'kind'> & Owned & { kind: RecruitingPostKind };

export type CloseOwnInput = Owned & ById;

export type CoachView = z.infer<typeof coachSchema>;
export type CoachesQuery = z.output<typeof coachesQuerySchema>;
export type CoachPage = z.infer<typeof coachPageSchema>;
export type UpsertCoachRequest = z.output<typeof upsertCoachSchema> & Owned;
export type CreateOfferRequest = z.output<typeof createOfferSchema> & Owned;
export type UpdateOfferRequest = z.output<typeof updateOfferSchema> & Owned & ById;
export type CoachingOrderView = z.infer<typeof coachingOrderSchema>;
export type CreateOrderRequest = z.output<typeof createOrderSchema> & Owned;
export type ReviewOrderRequest = z.output<typeof reviewOrderSchema> & Owned & ById;
export type Checkout = z.infer<typeof checkoutSchema>;

export type TournamentView = z.infer<typeof tournamentSchema>;
export type TournamentsQuery = z.output<typeof tournamentsQuerySchema>;
export type TournamentPage = z.infer<typeof tournamentPageSchema>;
export type CreateTournamentRequest = z.output<typeof createTournamentSchema> & Owned;
export type RegisterTournamentRequest = z.output<typeof registerTournamentSchema> & Owned & ById;
export type ReportMatchRequest = z.output<typeof reportMatchSchema> & Owned & ById;

export type ContentReportView = z.infer<typeof contentReportSchema>;
export type CreateReportRequest = z.output<typeof createReportSchema> & Owned;
export type ResolveReportRequest = z.output<typeof resolveReportSchema> & Owned & ById;
export type ModerateInput = { target: 'build' | 'comment' | 'guide'; id: string; status: ModerationStatus };

export type TacticBoardView = z.infer<typeof tacticBoardSchema>;
export type TacticBoardData = z.infer<typeof tacticBoardDataSchema>;
export type CreateTacticBoardRequest = z.output<typeof createTacticBoardSchema> & Owned;
export type UpdateTacticBoardRequest = z.output<typeof updateTacticBoardSchema> & ById & { userId: string | null; token: string | null };
export type OpenBoardInput = ById & { userId: string | null; token: string | null };

export type AccountOfInput = { userId: string; accountId?: number };
export type ExpireResult = { platoon: number; recruiting: number };
export type PostStatusValue = PostStatus;

export type IdViewer = ById & Viewer;
export type LikeInput = ById & Owned & { liked: boolean };
export type BuildRow = Prisma.BuildGetPayload<{ include: typeof BUILD_INCLUDE }>;
export type BuildViewsInput = { rows: BuildRow[] } & Viewer;
export type GuideRow = Prisma.GuideGetPayload<{ include: typeof GUIDE_INCLUDE }>;
export type GuideViewsInput = { rows: GuideRow[] } & Viewer;

export type OrderTransition = {
  id: string;
  where: Prisma.CoachingOrderWhereInput;
  status: CoachingOrderStatus;
  completedAt?: Date;
};

export type TournamentMove = CloseOwnInput & {
  from: TournamentStatus;
  to: TournamentStatus;
};

export type ReportTarget = {
  targetType: string;
  targetId: string;
};

export type BoardAccess = {
  board: TacticBoard;
  role: BoardRole;
};

export type BoardState = {
  state: Uint8Array | null;
  data: TacticBoardData;
};

export type StoreBoardInput = {
  id: string;
  state: Uint8Array;
  snapshot: TacticBoardData | null;
};

export type CollabContext = {
  boardId: string;
};
