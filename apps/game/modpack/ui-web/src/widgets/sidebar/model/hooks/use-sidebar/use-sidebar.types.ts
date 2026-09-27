import type { useSidebar } from './use-sidebar';

export type SidebarItemModel = ReturnType<typeof useSidebar>['groups'][number]['items'][number];
