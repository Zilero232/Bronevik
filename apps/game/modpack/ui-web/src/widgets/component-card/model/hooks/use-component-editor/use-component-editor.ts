import { useState } from 'react';

import type { EditorHint, UseComponentEditorInput } from './use-component-editor.types';

import { closeEditor, useT } from '../../../../../entities/window-state';
import { useEscapeLayer } from '../../../../../shared/lib/use-escape-layer';
import { EDITOR } from '../../../config';
import { editorGroups } from '../../../lib/editor-layout';
import { useComponentCard } from '../use-component-card';

export const useComponentEditor = ({ component, editor }: UseComponentEditorInput) => {
  const t = useT();
  const card = useComponentCard({ component, forceOpen: true });
  const [hint, setHint] = useState<EditorHint | null>(null);
  const [zoom, setZoom] = useState<number>(EDITOR.zoomLevels[0]);

  useEscapeLayer({ kind: 'view', onEscape: closeEditor });

  return {
    card,
    groups: editorGroups({ fields: component.fields, editor, otherLabel: t('editorOther') }),
    hint: hint ?? { label: component.title, text: component.hint ?? t('editorIdle') },
    zoom,
    zoomItems: EDITOR.zoomLevels.map((level) => ({ value: String(level), label: `${level}×` })),
    setZoom: (value: string) => setZoom(Number(value)),
    showHint: setHint,
    clearHint: () => setHint(null),
    close: closeEditor
  };
};
