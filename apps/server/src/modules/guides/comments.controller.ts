import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUserId } from '../../common/decorators';
import { IdParamsDto } from '../community-core';
import { COMMENT_TARGET_TO_DB } from './config';
import { CommentDto, CommentListDto, CommentsQueryDto, CreateCommentDto } from './dto';
import { CommentService } from './services';

@ApiTags('community')
@Controller('community/comments')
export class CommentsController {
  constructor(private readonly comments: CommentService) {}

  @AllowAnonymous()
  @Get()
  @ZodResponse({ type: CommentListDto })
  list(@Query() { target, targetId }: CommentsQueryDto) {
    return this.comments.list({ target: COMMENT_TARGET_TO_DB[target], targetId });
  }

  @Post()
  @ZodResponse({ type: CommentDto, status: HttpStatus.CREATED })
  create(@CurrentUserId() userId: string, @Body() { target, ...body }: CreateCommentDto) {
    return this.comments.create({ ...body, target: COMMENT_TARGET_TO_DB[target], userId });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUserId() userId: string, @Param() { id }: IdParamsDto) {
    await this.comments.remove({ id, userId });
  }
}
