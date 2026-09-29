import {
  blogArticleSchema,
  blogEditorAccessSchema,
  blogEditorPostListSchema,
  blogEditorPostSchema,
  blogImageUploadSchema,
  blogPostPageSchema,
  blogTagsSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { blogImageParamsSchema, blogPostsQuerySchema, blogSlugParamsSchema, createBlogPostSchema, updateBlogPostSchema } from './blog.schemas';

export class BlogArticleDto extends createZodDto(blogArticleSchema) {}
export class BlogPostPageDto extends createZodDto(blogPostPageSchema) {}
export class BlogPostsQueryDto extends createZodDto(blogPostsQuerySchema) {}
export class BlogTagsDto extends createZodDto(blogTagsSchema) {}
export class BlogSlugParamsDto extends createZodDto(blogSlugParamsSchema) {}
export class BlogImageParamsDto extends createZodDto(blogImageParamsSchema) {}
export class BlogEditorAccessDto extends createZodDto(blogEditorAccessSchema) {}
export class BlogEditorPostDto extends createZodDto(blogEditorPostSchema) {}
export class BlogEditorPostListDto extends createZodDto(blogEditorPostListSchema) {}
export class BlogImageUploadDto extends createZodDto(blogImageUploadSchema) {}
export class CreateBlogPostDto extends createZodDto(createBlogPostSchema) {}
export class UpdateBlogPostDto extends createZodDto(updateBlogPostSchema) {}
