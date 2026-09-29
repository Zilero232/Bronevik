import type { ImageUploadHandler } from '@mdxeditor/editor';
import type { ComponentType } from 'react';

export type MarkdownImageUpload = NonNullable<ImageUploadHandler>;

export type UseMarkdownEditorPluginsInput = {
  toolbar: ComponentType;
  onImageUpload: MarkdownImageUpload;
};
