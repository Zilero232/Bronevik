import type { TechTreeNode } from '@otmetki/schemas';

import type { PathPanelProps } from '../PathPanel/PathPanel.types';

export type PathAsideProps = Omit<PathPanelProps, 'selected'> & {
  selected: TechTreeNode | null;
};
