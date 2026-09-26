import type { NewsPage } from '@/shared/api/generated';

export type NewsRowProps = {
  item: NewsPage['items'][number];
};
