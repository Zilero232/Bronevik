import type { StatusView } from '@/entities/patch-report';
import type { SectionId } from '@/shared/lib';

export type NavMarker = 'new' | 'problem' | 'update';

export type NavMarkerInput = {
  section: SectionId;
  view: StatusView | null;
  canInstall: boolean;
};
