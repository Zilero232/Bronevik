import type { ComponentType } from 'preact';

import type { CardProps } from '../components';

export type SearchPageProps = {
  columns: number;
  card: ComponentType<CardProps>;
};
