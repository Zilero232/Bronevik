import type { BlogPostRow } from '../../selects';

export type ToBlogPostViewInput = {
  post: BlogPostRow;
  apiUrl: string;
};
