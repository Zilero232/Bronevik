import type { Overlay } from '@otmetki/schemas';

export type UseOverlayFormInput = {
  overlay: Overlay | null;
  onSaved: (id: string) => void;
  onRemoved: () => void;
};
