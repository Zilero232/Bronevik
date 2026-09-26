'use client';

import { useState } from 'react';

import { OVERLAY_EDITOR } from '../../../config';
import { useOverlays } from '../use-overlays';

export const useOverlaysPanel = () => {
  const { data: overlays = [], isPending, isError, isFetching, refetch } = useOverlays();
  const [selection, setSelection] = useState<string | null>(null);

  const selected = selection === OVERLAY_EDITOR.newId ? null : (overlays.find(({ id }) => id === selection) ?? overlays[0] ?? null);

  const onCreate = () => setSelection(OVERLAY_EDITOR.newId);
  const onRemoved = () => setSelection(null);
  const onRetry = () => void refetch();

  return {
    overlays,
    selected,
    editorKey: selected?.id ?? OVERLAY_EDITOR.newId,
    isPending,
    isError,
    isFetching,
    onSelect: setSelection,
    onCreate,
    onRemoved,
    onRetry
  };
};
