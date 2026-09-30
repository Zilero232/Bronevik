import type { ComponentType } from 'preact';

import type { UiSection } from '../../../../shared/api/protocol';
import type { CardProps } from '../components';

export type SectionCardsProps = {
  section: UiSection;
  columns: number;
  card: ComponentType<CardProps>;
};
