import type { Overlay } from '@otmetki/schemas';

export type OverlayListProps = {
  overlays: Overlay[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
};
