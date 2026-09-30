import type { ClientSize } from '../gameface.types';

export type GamefaceMockPush = {
  state?: string;
  feed?: string;
  escape?: number;
};

export type GamefaceMockInput = {
  state: string;
  feed?: string;
  clientSize: () => ClientSize;
  mouse?: () => { x: number; y: number };
  tooltips?: boolean;
  onSend: (message: string) => string | GamefaceMockPush | null;
};

export type GamefaceMock = {
  scope: Record<string, unknown>;
  push: (values: GamefaceMockPush) => void;
  sent: () => string[];
  inputAreas: () => number[][];
  viewEvents: () => unknown[];
};
