import type { BlogPost } from '../../../../../generated';
import type { BlogPostRow } from '../../selects';

export type BlogCoverInput = {
  post: Pick<BlogPost, 'coverKey' | 'coverUrl'>;
  apiUrl: string;
};

export type ToBlogPostViewInput = {
  post: BlogPostRow;
  apiUrl: string;
};

export type ImageFileUrlInput = {
  key: string;
  apiUrl: string;
};
