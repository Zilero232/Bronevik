import type { ComponentGroup, View } from '../../model/store';

export type SidebarProps = {
  groups: ComponentGroup[];
  view: View;
  selectedId: string | null;
};
