import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, Post, Query, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { FEED, SIGNATURE } from './config';
import {
  ChallengesDto,
  CreateFollowDto,
  FeedDto,
  FeedQueryDto,
  FollowListDto,
  FollowParamsDto,
  LeagueDto,
  LeagueQueryDto,
  SignatureParamsDto,
  WrappedDto,
  WrappedParamsDto,
  WrappedQueryDto
} from './dto';
import { FeedService, FollowService, LeagueService, SignatureService, WeeklyChallengeService, WrappedService } from './services';

@ApiTags('social')
@Controller()
export class SocialController {
  constructor(
    private readonly follows: FollowService,
    private readonly feeds: FeedService,
    private readonly leagues: LeagueService,
    private readonly challenges: WeeklyChallengeService,
    private readonly signatures: SignatureService,
    private readonly wrapped: WrappedService
  ) {}

  @Get('social/follows')
  @ZodResponse({ type: FollowListDto })
  listFollows(@CurrentUserId() userId: string) {
    return this.follows.list(userId);
  }

  @Post('social/follows')
  @ZodResponse({ type: FollowListDto, status: HttpStatus.CREATED })
  follow(@CurrentUserId() userId: string, @Body() body: CreateFollowDto) {
    return this.follows.create({ ...body, userId });
  }

  @Delete('social/follows/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(@CurrentUserId() userId: string, @Param() { id }: FollowParamsDto) {
    await this.follows.remove({ userId, id });
  }

  @Get('social/feed')
  @ZodResponse({ type: FeedDto })
  feed(@CurrentUserId() userId: string, @Query() { days }: FeedQueryDto) {
    return this.feeds.feed({ userId, days: days ?? FEED.days });
  }

  @Get('social/leagues')
  @ZodResponse({ type: LeagueDto })
  league(@CurrentUserId() userId: string, @Query() { scope, metric, week }: LeagueQueryDto) {
    return this.leagues.league({ userId, scope, metric, week });
  }

  @Get('social/challenges')
  @ZodResponse({ type: ChallengesDto })
  weeklyChallenges(@CurrentUserId() userId: string) {
    return this.challenges.forUser(userId);
  }

  @AllowAnonymous()
  @Get('sig/:file')
  @Header('content-type', 'image/png')
  @Header('cache-control', `public, max-age=${SIGNATURE.cacheSeconds}`)
  async signature(@Param() { file }: SignatureParamsDto) {
    return new StreamableFile(await this.signatures.png(file), { type: 'image/png' });
  }

  @AllowAnonymous()
  @Get('players/:id/wrapped')
  @ZodResponse({ type: WrappedDto })
  yearWrapped(@Param() { id }: WrappedParamsDto, @Query() { year }: WrappedQueryDto) {
    return this.wrapped.wrapped({ accountId: id, year: year ?? new Date().getUTCFullYear() });
  }
}
