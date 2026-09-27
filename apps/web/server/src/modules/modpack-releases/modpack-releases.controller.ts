import type { Response } from 'express';

import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { ModpackLatestQueryDto, ModpackLatestReleaseDto, ModpackManagerUpdateDto, ModpackManagerUpdateQueryDto } from './dto';
import { ModpackReleasesService } from './services';

@ApiTags('modpack')
@AllowAnonymous()
@Controller('modpack')
export class ModpackReleasesController {
  constructor(private readonly releases: ModpackReleasesService) {}

  @Get('releases/latest')
  @ApiOperation({ operationId: 'getLatestModpackRelease', summary: 'The newest modpack release that supports a game client version' })
  @ZodResponse({ type: ModpackLatestReleaseDto, status: HttpStatus.OK })
  latest(@Query() { game }: ModpackLatestQueryDto) {
    return this.releases.latest(game);
  }

  @Get('manager/update')
  @ApiOperation({ operationId: 'getModpackManagerUpdate', summary: 'Tauri updater feed of the modpack manager; 204 when it is current' })
  @ApiOkResponse({ type: ModpackManagerUpdateDto })
  @ApiNoContentResponse()
  async managerUpdate(@Query() query: ModpackManagerUpdateQueryDto, @Res({ passthrough: true }) response: Response) {
    const update = await this.releases.managerUpdate(query);

    if (!update) {
      response.status(HttpStatus.NO_CONTENT);
    }

    return update ?? undefined;
  }
}
