import type { Overlay } from '@otmetki/schemas';

export type OverlayEditorProps = {
  overlay: Overlay | null;
  onSaved: (id: string) => void;
  onRemoved: () => void;
};
