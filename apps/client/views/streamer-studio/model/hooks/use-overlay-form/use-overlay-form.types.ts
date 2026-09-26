import type { Overlay } from '@bronevik/schemas';

export type UseOverlayFormInput = {
  overlay: Overlay | null;
  onSaved: (id: string) => void;
  onRemoved: () => void;
};
