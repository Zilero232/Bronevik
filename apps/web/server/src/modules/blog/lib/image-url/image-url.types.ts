import type { BlogPost } from '../../../../../generated';

export type BlogCoverInput = {
  post: Pick<BlogPost, 'coverKey' | 'coverUrl'>;
  apiUrl: string;
};

export type ImageFileUrlInput = {
  key: string;
  apiUrl: string;
};
