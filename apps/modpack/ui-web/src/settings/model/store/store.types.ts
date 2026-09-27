import type { UiComponent } from '../protocol';

export type Section = 'components' | 'hud' | 'profiles';

export type View = {
  section: Section;
  componentId: string | null;
};

export type ComponentGroup = {
  id: string;
  components: UiComponent[];
};
