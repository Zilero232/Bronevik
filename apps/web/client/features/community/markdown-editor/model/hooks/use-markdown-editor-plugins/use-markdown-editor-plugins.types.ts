import type { ComponentType } from 'react';

export type MarkdownImageUpload = (file: File) => Promise<string>;

export type UseMarkdownEditorPluginsInput = {
  toolbar: ComponentType;
  onImageUpload: MarkdownImageUpload;
};
