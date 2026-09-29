import type { BLOG_IMAGES } from '../../config';

export type ImageExtension = keyof typeof BLOG_IMAGES.types;

export type ImageType = {
  extension: ImageExtension;
  contentType: (typeof BLOG_IMAGES.types)[ImageExtension];
};
