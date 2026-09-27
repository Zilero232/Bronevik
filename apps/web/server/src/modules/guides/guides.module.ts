import { Module } from '@nestjs/common';

import { CommentsController } from './comments.controller';
import { GuidesController } from './guides.controller';
import { CommentService, GuideService } from './services';

@Module({
  controllers: [GuidesController, CommentsController],
  providers: [GuideService, CommentService]
})
export class GuidesModule {}
