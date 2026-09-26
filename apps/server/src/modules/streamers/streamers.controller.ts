import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { PROVIDER_FROM_PATH } from './config';
import {
  ActivateChallengeDto,
  ChallengeListDto,
  ConnectProviderDto,
  ConnectUrlDto,
  CreateChallengeDto,
  CreateOverlayDto,
  IdParamsDto,
  IntegrationListDto,
  OAuthCallbackDto,
  OverlayDataDto,
  OverlayDto,
  OverlayListDto,
  PreviewOverlayDto,
  SlugParamsDto,
  StreamerChallengeDto,
  StreamerProfileDto,
  UpdateOverlayDto,
  UpsertProfileDto
} from './dto';
import { ChallengeService, IntegrationsService, IntegrationStoreService, OverlayService, StreamerProfileService } from './services';

@ApiTags('streamers')
@Controller('streamers')
export class StreamersController {
  constructor(
    private readonly profiles: StreamerProfileService,
    private readonly overlays: OverlayService,
    private readonly challenges: ChallengeService,
    private readonly integrations: IntegrationsService,
    private readonly store: IntegrationStoreService
  ) {}

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
}
