import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { PROVIDER_FROM_PATH, STREAMERS } from './config';
import {
  ActivateChallengeDto,
  ApplyListDto,
  ApplyRequestDto,
  ChallengeListDto,
  ClaimStatusDto,
  ConnectProviderDto,
  ConnectUrlDto,
  CreateApplyRequestDto,
  CreateChallengeDto,
  CreateOverlayDto,
  FollowStreamerDto,
  IdParamsDto,
  IntegrationListDto,
  OAuthCallbackDto,
  OverlayDataDto,
  OverlayDto,
  OverlayListDto,
  PreviewOverlayDto,
  RemovalRequestDto,
  SaveStreamerSettingsDto,
  SettingsAggregatesDto,
  SettingsAggregatesQueryDto,
  SettingsCompareDto,
  SettingsCompareQueryDto,
  SettingsHistoryDto,
  SettingsShareDto,
  SettingsShareResponseDto,
  SettingsTableDto,
  SlugParamsDto,
  StartClaimDto,
  StreamerChallengeDto,
  StreamerClaimDto,
  StreamerDirectoryDto,
  StreamerDirectoryQueryDto,
  StreamerFollowListDto,
  StreamerLiveListDto,
  StreamerProfileDto,
  StreamerSettingsViewDto,
  TwitchChannelParamsDto,
  TwitchPanelDto,
  UpdateOverlayDto,
  UpdatePredictionsDto,
  UpdateSettingsShareDto,
  UpsertProfileDto
} from './dto';
import {
  ChallengeService,
  IntegrationsService,
  IntegrationStoreService,
  OverlayService,
  SettingsAggregateService,
  SettingsShareService,
  StreamerClaimService,
  StreamerDirectoryService,
  StreamerFollowService,
  StreamerProfileService,
  StreamerSettingsService,
  TwitchPanelService
} from './services';

@ApiTags('streamers')
@Controller('streamers')
export class StreamersController {
  constructor(
    private readonly profiles: StreamerProfileService,
    private readonly overlays: OverlayService,
    private readonly challenges: ChallengeService,
    private readonly integrations: IntegrationsService,
    private readonly store: IntegrationStoreService,
    private readonly panels: TwitchPanelService,
    private readonly directory: StreamerDirectoryService,
    private readonly claims: StreamerClaimService,
    private readonly settings: StreamerSettingsService,
    private readonly aggregates: SettingsAggregateService,
    private readonly shares: SettingsShareService,
    private readonly follows: StreamerFollowService
  ) {}

  @AllowAnonymous()
  @Get()
  @ZodResponse({ type: StreamerDirectoryDto })
  list(@Query() query: StreamerDirectoryQueryDto) {
    return this.directory.list(query);
  }

  @AllowAnonymous()
  @Get('live')
  @ZodResponse({ type: StreamerLiveListDto })
  live() {
    return this.directory.live();
  }

  @AllowAnonymous()
  @Get('settings')
  @ZodResponse({ type: SettingsTableDto })
  settingsTable() {
    return this.settings.table();
  }

  @AllowAnonymous()
  @Get('settings/compare')
  @ZodResponse({ type: SettingsCompareDto })
  compareSettings(@Query() { slugs }: SettingsCompareQueryDto) {
    return this.settings.compare(slugs);
  }

  @AllowAnonymous()
  @Get('settings/aggregates')
  @ZodResponse({ type: SettingsAggregatesDto })
  settingsAggregates(@Query() { cohort }: SettingsAggregatesQueryDto) {
    return this.aggregates.read(cohort);
  }

  @Get('me/settings')
  @ZodResponse({ type: StreamerSettingsViewDto })
  mySettings(@CurrentUserId() userId: string) {
    return this.settings.mine(userId);
  }

  @Put('me/settings')
  @ZodResponse({ type: StreamerSettingsViewDto })
  saveSettings(@CurrentUserId() userId: string, @Body() body: SaveStreamerSettingsDto) {
    return this.settings.saveMine({ userId, source: body.source, values: body.values, sourceUrls: body.sourceUrls });
  }

  @Get('me/settings/apply')
  @ZodResponse({ type: ApplyListDto })
  applyRequests(@CurrentUserId() userId: string) {
    return this.shares.myRequests(userId);
  }

  @Post('me/settings/apply')
  @ZodResponse({ type: ApplyRequestDto, status: HttpStatus.CREATED })
  requestApply(@CurrentUserId() userId: string, @Body() body: CreateApplyRequestDto) {
    return this.shares.requestApply({ ...body, userId });
  }

  @Get('me/settings/share')
  @ZodResponse({ type: SettingsShareResponseDto })
  async settingsShare(@CurrentUserId() userId: string) {
    return { share: await this.shares.share(userId) };
  }

  @Put('me/settings/share')
  @ZodResponse({ type: SettingsShareDto })
  updateSettingsShare(@CurrentUserId() userId: string, @Body() { anonymousStats }: UpdateSettingsShareDto) {
    return this.shares.setAnonymous({ userId, anonymousStats });
  }

  @Delete('me/settings/share')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSettingsShare(@CurrentUserId() userId: string) {
    await this.shares.removeShare(userId);
  }

  @Get('me/follows')
  @ZodResponse({ type: StreamerFollowListDto })
  myFollows(@CurrentUserId() userId: string) {
    return this.follows.list(userId);
  }

  @Get('me')
  @ZodResponse({ type: StreamerProfileDto })
  profile(@CurrentUserId() userId: string) {
    return this.profiles.get(userId);
  }

  @Put('me')
  @ZodResponse({ type: StreamerProfileDto })
  saveProfile(@CurrentUserId() userId: string, @Body() body: UpsertProfileDto) {
    return this.profiles.upsert({ ...body, userId });
  }

  @Get('me/overlays')
  @ZodResponse({ type: OverlayListDto })
  listOverlays(@CurrentUserId() userId: string) {
    return this.overlays.list(userId);
  }

  @Post('me/overlays')
  @ZodResponse({ type: OverlayDto, status: HttpStatus.CREATED })
  createOverlay(@CurrentUserId() userId: string, @Body() body: CreateOverlayDto) {
    return this.overlays.create({ ...body, userId });
  }

  @Post('me/overlays/preview')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: OverlayDataDto })
  previewOverlay(@CurrentUserId() userId: string, @Body() body: PreviewOverlayDto) {
    return this.overlays.preview({ ...body, userId });
  }

  @Patch('me/overlays/:id')
  @ZodResponse({ type: OverlayDto })
  updateOverlay(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto, @Body() body: UpdateOverlayDto) {
    return this.overlays.update({ ...body, userId, id });
  }

  @Delete('me/overlays/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeOverlay(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    await this.overlays.remove({ userId, id });
  }

  @Get('me/challenges')
  @ZodResponse({ type: ChallengeListDto })
  listChallenges(@CurrentUserId() userId: string) {
    return this.challenges.list(userId);
  }

  @Post('me/challenges')
  @ZodResponse({ type: StreamerChallengeDto, status: HttpStatus.CREATED })
  createChallenge(@CurrentUserId() userId: string, @Body() body: CreateChallengeDto) {
    return this.challenges.create({ ...body, userId });
  }

  @Post('me/challenges/:id/activate')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: StreamerChallengeDto })
  activateChallenge(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto, @Body() { donorName }: ActivateChallengeDto) {
    return this.challenges.activateByStreamer({ userId, id, donorName: donorName ?? null });
  }

  @Post('me/challenges/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: StreamerChallengeDto })
  cancelChallenge(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    return this.challenges.cancel({ userId, id });
  }

  @Get('me/integrations')
  @ZodResponse({ type: IntegrationListDto })
  listIntegrations(@CurrentUserId() userId: string) {
    return this.store.list(userId);
  }

  @Post('me/integrations/:provider/connect')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: ConnectUrlDto })
  async connect(@CurrentUserId() userId: string, @Param() { provider }: ConnectProviderDto) {
    return { url: await this.integrations.connectUrl({ userId, provider: PROVIDER_FROM_PATH[provider] }) };
  }

  @Put('me/integrations/twitch/predictions')
  @ZodResponse({ type: IntegrationListDto })
  setPredictions(@CurrentUserId() userId: string, @Body() { enabled }: UpdatePredictionsDto) {
    return this.store.setPredictions({ userId, enabled });
  }

  @AllowAnonymous()
  @SkipThrottle()
  @Get('twitch-panel/:channelId')
  @ZodResponse({ type: TwitchPanelDto })
  twitchPanel(@Param() { channelId }: TwitchChannelParamsDto) {
    return this.panels.cached(channelId);
  }

  @Delete('me/integrations/:provider')
  @HttpCode(HttpStatus.NO_CONTENT)
  async disconnect(@CurrentUserId() userId: string, @Param() { provider }: ConnectProviderDto) {
    await this.store.remove({ userId, provider: PROVIDER_FROM_PATH[provider] });
  }

  @AllowAnonymous()
  @Get('integrations/:provider/callback')
  @Redirect()
  async callback(@Param() { provider }: ConnectProviderDto, @Query() { code, state }: OAuthCallbackDto) {
    return { url: await this.integrations.callback({ provider: PROVIDER_FROM_PATH[provider], code, state }) };
  }

  @AllowAnonymous()
  @Get(':slug')
  @ZodResponse({ type: StreamerProfileDto })
  bySlug(@Param() { slug }: SlugParamsDto) {
    return this.profiles.bySlug(slug);
  }

  @AllowAnonymous()
  @Get(':slug/settings')
  @ZodResponse({ type: StreamerSettingsViewDto })
  settingsBySlug(@Param() { slug }: SlugParamsDto) {
    return this.settings.bySlug(slug);
  }

  @AllowAnonymous()
  @Get(':slug/settings.json')
  @Header('content-disposition', 'attachment')
  @ZodResponse({ type: StreamerSettingsViewDto })
  settingsJson(@Param() { slug }: SlugParamsDto) {
    return this.settings.bySlug(slug);
  }

  @AllowAnonymous()
  @Get(':slug/settings/history')
  @ZodResponse({ type: SettingsHistoryDto })
  settingsHistory(@Param() { slug }: SlugParamsDto) {
    return this.settings.history(slug);
  }

  @Get(':slug/claim')
  @ZodResponse({ type: ClaimStatusDto })
  async claimStatus(@CurrentUserId() userId: string, @Param() { slug }: SlugParamsDto) {
    return { claim: await this.claims.mine({ userId, slug }) };
  }

  @Throttle({ default: STREAMERS.claimThrottle })
  @Post(':slug/claim')
  @ZodResponse({ type: StreamerClaimDto, status: HttpStatus.CREATED })
  claim(@CurrentUserId() userId: string, @Param() { slug }: SlugParamsDto, @Body() body: StartClaimDto) {
    return this.claims.start({ ...body, userId, slug });
  }

  @Throttle({ default: STREAMERS.claimThrottle })
  @Post(':slug/claim/verify')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: StreamerClaimDto })
  verifyClaim(@CurrentUserId() userId: string, @Param() { slug }: SlugParamsDto) {
    return this.claims.verify({ userId, slug });
  }

  @AllowAnonymous()
  @Throttle({ default: STREAMERS.removalThrottle })
  @Post(':slug/removal-request')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removalRequest(@Param() { slug }: SlugParamsDto, @Body() body: RemovalRequestDto) {
    await this.claims.requestRemoval({ ...body, slug });
  }

  @Put(':slug/follow')
  @ZodResponse({ type: StreamerFollowListDto })
  follow(@CurrentUserId() userId: string, @Param() { slug }: SlugParamsDto, @Body() { tankId }: FollowStreamerDto) {
    return this.follows.follow({ userId, slug, tankId });
  }

  @Delete(':slug/follow')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(@CurrentUserId() userId: string, @Param() { slug }: SlugParamsDto) {
    await this.follows.unfollow({ userId, slug });
  }
}
