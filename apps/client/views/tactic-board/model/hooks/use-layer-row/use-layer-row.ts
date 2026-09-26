'use client';

import type { FormEvent } from 'react';

import { useEffect, useRef, useState } from 'react';

import type { TacticLayer } from '@/shared/api/tactics';

import { useWorkspace } from '../../context';

export const useLayerRow = (layer: TacticLayer) => {
  const { isEditable, onSelectLayer, onRenameLayer, onToggleLayer, onRemoveLayer } = useWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draftName, setDraftName] = useState<string | null>(null);
  const isRenaming = draftName !== null;

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
    }
  }, [isRenaming]);

  const onStartRename = () => {
    if (isEditable) {
      setDraftName(layer.name);
    }
  };

  const onCommitRename = () => {
    if (draftName !== null && draftName !== layer.name) {
      onRenameLayer({ layerId: layer.id, name: draftName });
    }

    setDraftName(null);
  };

  const onSubmitRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCommitRename();
  };

  return {
    isEditable,
    inputRef,
    isRenaming,
    draftName: draftName ?? '',
    itemCount: layer.strokes.length + layer.icons.length,
    onDraftChange: setDraftName,
    onStartRename,
    onCommitRename,
    onSubmitRename,
    onSelect: () => onSelectLayer(layer.id),
    onToggle: () => onToggleLayer(layer.id),
    onRemove: () => onRemoveLayer(layer.id)
  };
};
