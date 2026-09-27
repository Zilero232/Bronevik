import type { useHudEditor } from './use-hud-editor';

export type PointerPress = Pick<MouseEvent, 'clientX' | 'clientY'>;

export type KeyPress = Pick<KeyboardEvent, 'key' | 'preventDefault'>;

export type HudPanelModel = ReturnType<typeof useHudEditor>['panels'][number];
