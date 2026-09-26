import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { IdParamsDto, SlugParamsDto } from '../community-core';
import { CreateTournamentDto, RegisterTournamentDto, ReportMatchDto, TournamentDto, TournamentPageDto, TournamentsQueryDto } from './dto';
import { TournamentService } from './services';

@ApiTags('community')
@Controller('community/tournaments')
export class TournamentsController {
  constructor(private readonly tournaments: TournamentService) {}

  @AllowAnonymous()
  @Get()
  @ZodResponse({ type: TournamentPageDto })
  list(@Query() query: TournamentsQueryDto) {
    return this.tournaments.list(query);
  }

  @AllowAnonymous()
  @Get(':slug')
  @ZodResponse({ type: TournamentDto })
  get(@Param() { slug }: SlugParamsDto) {
    return this.tournaments.get(slug);
  }

  @Post()
  @ZodResponse({ type: TournamentDto, status: HttpStatus.CREATED })
  create(@CurrentUserId() userId: string, @Body() body: CreateTournamentDto) {
    return this.tournaments.create({ ...body, userId });
  }

  @Post(':id/open')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: TournamentDto })
  open(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    return this.tournaments.openRegistration({ id, userId });
  }

  @Post(':id/register')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: TournamentDto })
  register(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto, @Body() body: RegisterTournamentDto) {
    return this.tournaments.register({ ...body, id, userId });
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: TournamentDto })
  start(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    return this.tournaments.start({ id, userId });
  }

  @Post(':id/matches')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: TournamentDto })
  report(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto, @Body() body: ReportMatchDto) {
    return this.tournaments.reportMatch({ ...body, id, userId });
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: TournamentDto })
  cancel(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    return this.tournaments.cancel({ id, userId });
  }
}
