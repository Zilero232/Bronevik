import { createZodDto } from 'nestjs-zod';

import {
  commentListSchema,
  commentSchema,
  commentsQuerySchema,
  createCommentSchema,
  createGuideSchema,
  guideAuthorsSchema,
  guideListSchema,
  guidePageSchema,
  guideSchema,
  guidesQuerySchema,
  updateGuideSchema
} from './guides.schemas';

export class GuideDto extends createZodDto(guideSchema) {}
export class GuidesQueryDto extends createZodDto(guidesQuerySchema) {}
export class GuidePageDto extends createZodDto(guidePageSchema) {}
export class GuideListDto extends createZodDto(guideListSchema) {}
export class CreateGuideDto extends createZodDto(createGuideSchema) {}
export class UpdateGuideDto extends createZodDto(updateGuideSchema) {}
export class GuideAuthorsDto extends createZodDto(guideAuthorsSchema) {}
export class CommentDto extends createZodDto(commentSchema) {}
export class CommentsQueryDto extends createZodDto(commentsQuerySchema) {}
export class CommentListDto extends createZodDto(commentListSchema) {}
export class CreateCommentDto extends createZodDto(createCommentSchema) {}
