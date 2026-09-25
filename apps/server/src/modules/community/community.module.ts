import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import {
  BuildsController,
  CoachingController,
  CommentsController,
  GuidesController,
  ModerationController,
  PostsController,
  TacticsController,
  TournamentsController
} from './controllers';
import {
  BuildShareService,
  CoachingService,
  CommentService,
  CommunityAccountsService,
  GuideService,
  ModerationService,
  PlatoonService,
  RecruitingService,
  TacticBoardService,
  TournamentService
} from './services';
import { TacticsCollabService } from './tactics';

@Module({
  imports: [BillingCoreModule],
  controllers: [
    BuildsController,
    GuidesController,
    CommentsController,
    PostsController,
    CoachingController,
    TournamentsController,
    ModerationController,
    TacticsController
  ],
  providers: [
    CommunityAccountsService,
    BuildShareService,
    GuideService,
    CommentService,
    PlatoonService,
    RecruitingService,
    CoachingService,
    TournamentService,
    ModerationService,
    TacticBoardService,
    TacticsCollabService
  ]
})
export class CommunityModule {}
