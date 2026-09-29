import type { StoryCardVariant } from '@/ui-kit';

import type { BlogPostSummary } from '../../api';

export type BlogPostCardProps = {
  post: BlogPostSummary;
  variant?: StoryCardVariant;
  isPriority?: boolean;
};
