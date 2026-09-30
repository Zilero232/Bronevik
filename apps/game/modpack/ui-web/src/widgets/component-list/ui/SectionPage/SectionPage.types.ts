import type { ComponentChildren, ComponentType } from 'preact';

import type { UiSection } from '../../../../shared/api/protocol';
import type { CardProps } from '../components';

export type SectionPageProps = {
  section: UiSection;
  columns: number;
  card: ComponentType<CardProps>;
  intro?: ComponentChildren;
};
