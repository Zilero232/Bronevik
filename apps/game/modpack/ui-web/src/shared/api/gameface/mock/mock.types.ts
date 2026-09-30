import type { ClientSize } from '../gameface.types';

export type GamefaceMockPush = {
  state?: string;
  feed?: string;
};

export type GamefaceMockInput = {
  state: string;
  feed?: string;
  clientSize: () => ClientSize;
  onSend: (message: string) => string | GamefaceMockPush | null;
};

export type GamefaceMock = {
  scope: Record<string, unknown>;
  sent: () => string[];
  inputAreas: () => number[][];
};
