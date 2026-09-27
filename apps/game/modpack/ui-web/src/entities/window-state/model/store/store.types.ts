import type { UiComponent } from '../../../../shared/api/protocol';
import type { SECTION } from '../../config';

export type Section = (typeof SECTION)[keyof typeof SECTION];

export type View = {
  section: Section;
  componentId: string | null;
};

export type ComponentGroup = {
  id: string;
  components: UiComponent[];
};
