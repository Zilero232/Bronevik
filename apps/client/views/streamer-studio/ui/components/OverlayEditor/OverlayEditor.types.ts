import type { Overlay } from '@bronevik/schemas';

export type OverlayEditorProps = {
  overlay: Overlay | null;
  onSaved: (id: string) => void;
  onRemoved: () => void;
};
