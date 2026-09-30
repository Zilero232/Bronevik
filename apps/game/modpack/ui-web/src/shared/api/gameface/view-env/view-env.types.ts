import type { GamefaceBridge } from '../gameface.types';

export type ViewEnv = Pick<
  GamefaceBridge,
  'clientSize' | 'clientSizeRem' | 'fitView' | 'mousePosition' | 'remScale' | 'resizeView' | 'setInputArea' | 'viewRect'
>;
