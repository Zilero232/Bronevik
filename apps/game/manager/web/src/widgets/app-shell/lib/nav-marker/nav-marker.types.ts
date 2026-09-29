import type { StatusView } from '@/entities/patch-report';
import type { PageId } from '@/shared/lib';

export type NavMarker = 'new' | 'problem' | 'update';

export type NavMarkerInput = {
  page: PageId;
  view: StatusView | null;
  canInstall: boolean;
};
