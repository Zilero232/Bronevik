import type { GamefaceBridge } from '../gameface.types';

export type ViewModel = Pick<GamefaceBridge, 'escape' | 'feed' | 'onDataChanged' | 'send' | 'state'>;

export type WhenReadyInput = { engine: Record<string, unknown> | null; callback: () => void };
