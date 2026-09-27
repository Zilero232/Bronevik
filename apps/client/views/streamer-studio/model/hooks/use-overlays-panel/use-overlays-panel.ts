'use client';

import { useState } from 'react';

import { OVERLAY_EDITOR } from '../../../config';
import { useOverlays } from '../use-overlays';

export const useOverlaysPanel = () => {
  const query = useOverlays();
  const [selection, setSelection] = useState<string | null>(null);

  const overlays = query.data ?? [];
  const selected = selection === OVERLAY_EDITOR.newId ? null : (overlays.find(({ id }) => id === selection) ?? overlays[0] ?? null);

  const onCreate = () => setSelection(OVERLAY_EDITOR.newId);
  const onRemoved = () => setSelection(null);

  return {
    query,
    overlays,
    selected,
    editorKey: selected?.id ?? OVERLAY_EDITOR.newId,
    onSelect: setSelection,
    onCreate,
    onRemoved
  };
};
