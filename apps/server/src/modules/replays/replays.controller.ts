import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AllowAnonymous, OptionalAuth } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import type { UploadedReplayFile } from './replays.types';

import { CurrentUserId, OptionalUserId } from '../../common/decorators';
import { MOD_DEVICE } from '../mod';
import { REPLAY_UPLOAD, replayFileInterceptor } from './config';
import {
  BestOfWeekDto,
  BestOfWeekQueryDto,
  HeatmapDto,
  HeatmapParamsDto,
  HeatmapQueryDto,
  PaginationQueryDto,
  ReplayDto,
  ReplayIdParamsDto,
  ReplayPageDto,
  ReplaySearchQueryDto,
  ReplayTracksDto,
  UpdateReplayDto,
  UploadedReplayDto,
  UploadReplayDto
} from './dto';
import { HeatmapService, ReplayOwnerService, ReplayQueryService, ReplayUploadService } from './services';

@ApiTags('replays')
@Controller('replays')
export class ReplaysController {
  constructor(
    private readonly uploads: ReplayUploadService,
    private readonly queries: ReplayQueryService,
    private readonly owners: ReplayOwnerService,
    private readonly heatmaps: HeatmapService
  ) {}

  @Post()
  @Throttle({ default: REPLAY_UPLOAD.userThrottle })
  @UseInterceptors(replayFileInterceptor)
  @ApiConsumes('multipart/form-data')
  @ZodResponse({ type: UploadedReplayDto, status: HttpStatus.CREATED })
  upload(@CurrentUserId() userId: string, @UploadedFile() file: UploadedReplayFile | undefined, @Body() { visibility }: UploadReplayDto) {
    return this.uploads.upload({ file, uploaderUserId: userId, deviceId: null, visibility });
  }

  @AllowAnonymous()
  @Post('mod')
  @Throttle({ default: REPLAY_UPLOAD.modThrottle })
  @UseInterceptors(replayFileInterceptor)
  @ApiConsumes('multipart/form-data')
  @ZodResponse({ type: UploadedReplayDto, status: HttpStatus.CREATED })
  uploadFromMod(
    @UploadedFile() file: UploadedReplayFile | undefined,
    @Headers(MOD_DEVICE.header) deviceId: string | undefined,
    @Headers(MOD_DEVICE.signatureHeader) signature: string | undefined
  ) {
    return this.uploads.uploadFromMod({ file, deviceId, signature });
  }

  @AllowAnonymous()
  @Get()
  @ZodResponse({ type: ReplayPageDto })
  search(@Query() query: ReplaySearchQueryDto) {
    return this.queries.search(query);
  }

  @AllowAnonymous()
  @Get('best')
  @ZodResponse({ type: BestOfWeekDto })
  best(@Query() { week }: BestOfWeekQueryDto) {
    return this.queries.bestOfWeek(week);
  }

  @Get('mine')
  @ZodResponse({ type: ReplayPageDto })
  mine(@CurrentUserId() userId: string, @Query() { limit, offset }: PaginationQueryDto) {
    return this.queries.mine({ userId, limit, offset });
  }

  @AllowAnonymous()
  @Get('heatmaps/:arenaId')
  @ZodResponse({ type: HeatmapDto })
  heatmap(@Param() { arenaId }: HeatmapParamsDto, @Query() { mode, scope }: HeatmapQueryDto) {
    return this.heatmaps.get({ arenaId, mode, scope });
  }

  @OptionalAuth()
  @Get(':id')
  @ZodResponse({ type: ReplayDto })
  get(@Param() { id }: ReplayIdParamsDto, @OptionalUserId() viewerUserId: string | null) {
    return this.queries.get({ id, viewerUserId });
  }

  @OptionalAuth()
  @Get(':id/tracks')
  @ZodResponse({ type: ReplayTracksDto })
  tracks(@Param() { id }: ReplayIdParamsDto, @OptionalUserId() viewerUserId: string | null) {
    return this.queries.tracks({ id, viewerUserId });
  }

  @OptionalAuth()
  @Get(':id/file')
  async file(@Param() { id }: ReplayIdParamsDto, @OptionalUserId() viewerUserId: string | null) {
    const { fileName, bytes } = await this.queries.file({ id, viewerUserId });

    return new StreamableFile(bytes, {
      type: REPLAY_UPLOAD.contentType,
      disposition: `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      length: bytes.byteLength
    });
  }

  @Patch(':id')
  @ZodResponse({ type: ReplayDto })
  update(@CurrentUserId() userId: string, @Param() { id }: ReplayIdParamsDto, @Body() { visibility }: UpdateReplayDto) {
    return this.owners.updateVisibility({ id, userId, visibility });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUserId() userId: string, @Param() { id }: ReplayIdParamsDto) {
    await this.owners.remove({ id, userId });
  }
}
