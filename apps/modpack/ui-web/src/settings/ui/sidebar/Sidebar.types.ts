import type { ComponentGroup, View } from '../../model/store/store.types';

export type SidebarProps = {
  groups: ComponentGroup[];
  view: View;
  selectedId: string | null;
};
