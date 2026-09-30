import type { ComponentChildren } from 'preact';

import type { Section } from '../../../../../entities/window-state';

export type ToolPageProps = {
  section: Section;
  children: ComponentChildren;
};
