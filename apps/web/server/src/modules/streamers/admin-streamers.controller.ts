import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { MODERATION } from '../moderation';
import {
  AdminClaimListDto,
  EditorialStreamerDto,
  IdParamsDto,
  ResolveClaimDto,
  SaveStreamerSettingsDto,
  SlugParamsDto,
  StreamerInvitationListDto
} from './dto';
import { StreamerClaimService, StreamerProfileService, StreamerSettingsService } from './services';

@ApiTags('streamers')
@Roles([...MODERATION.roles])
@Controller('admin/streamers')
export class AdminStreamersController {
  constructor(
    private readonly claims: StreamerClaimService,
    private readonly profiles: StreamerProfileService,
    private readonly settings: StreamerSettingsService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createEditorial(@Body() body: EditorialStreamerDto) {
    await this.claims.createEditorial(body);
  }

  @Post(':slug/settings')
  @HttpCode(HttpStatus.NO_CONTENT)
  async saveEditorialSettings(@CurrentUserId() userId: string, @Param() { slug }: SlugParamsDto, @Body() body: SaveStreamerSettingsDto) {
    const profile = await this.profiles.publicBySlug(slug);

    await this.settings.save({ profileId: profile.id, userId, source: 'editorial', values: body.values, sourceUrls: body.sourceUrls });
  }

  @Post(':slug/hide')
  @HttpCode(HttpStatus.NO_CONTENT)
  async hide(@Param() { slug }: SlugParamsDto) {
    await this.claims.hide(slug);
  }

  @Get('claims')
  @ZodResponse({ type: AdminClaimListDto })
  pendingClaims() {
    return this.claims.pending();
  }

  @Post('claims/:id/resolve')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resolveClaim(@CurrentUserId() moderatorId: string, @Param() { id }: IdParamsDto, @Body() { approve }: ResolveClaimDto) {
    await this.claims.resolve({ id, approve, moderatorId });
  }

  @Get('invitations')
  @ZodResponse({ type: StreamerInvitationListDto })
  invitations() {
    return this.claims.invitations();
  }

  @Post('invitations/seed')
  @HttpCode(HttpStatus.NO_CONTENT)
  async seedInvitations() {
    await this.claims.seedInvitations();
  }

  @Post('invitations/:slug/sent')
  @HttpCode(HttpStatus.NO_CONTENT)
  async invitationSent(@Param() { slug }: SlugParamsDto) {
    await this.claims.markInvitationSent(slug);
  }
}
