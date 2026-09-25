import type { Overlay } from '@bronevik/schemas';

export type OverlayEditorProps = {
  overlay: Overlay | null;
  previewPublicId: string | null;
  onSaved: (id: string) => void;
  onRemoved: () => void;
};
