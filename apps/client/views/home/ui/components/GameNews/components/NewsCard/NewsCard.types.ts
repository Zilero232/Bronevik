import type { NewsPage } from '@/shared/api/generated';

export type NewsCardProps = {
  item: NewsPage['items'][number];
};
