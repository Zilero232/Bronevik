import type { StoryCardVariant } from '@/ui-kit';

import type { NewsEntry } from '../../../model/hooks';

export type NewsCardProps = {
  entry: NewsEntry;
  variant?: StoryCardVariant;
  isPriority?: boolean;
};
