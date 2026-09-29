import { Module } from '@nestjs/common';

import { ObjectStorageModule } from '../../core';
import { BlogEditorController } from './blog-editor.controller';
import { BlogController } from './blog.controller';
import { BLOG_IMAGES } from './config';
import { BlogEditorService, BlogFeedService, BlogImageService, BlogQueryService } from './services';

@Module({
  imports: [ObjectStorageModule.register({ root: BLOG_IMAGES.root })],
  controllers: [BlogController, BlogEditorController],
  providers: [BlogQueryService, BlogFeedService, BlogImageService, BlogEditorService]
})
export class BlogModule {}
