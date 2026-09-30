import type { ComponentChildren } from 'preact';

import type { useWindowFrame } from '../model/hooks';

export type WindowFrameModel = ReturnType<typeof useWindowFrame>;

export type WindowFrameProps = {
  frame: WindowFrameModel;
  label: string;
  children: ComponentChildren;
};
